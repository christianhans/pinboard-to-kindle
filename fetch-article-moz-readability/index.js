const { writeFile } = require('fs');
const { Builder, Capabilities } = require('selenium-webdriver');
const crypto = require("crypto");
const firefox = require('selenium-webdriver/firefox');
const { Readability } = require("@mozilla/readability");
const JSDOM = require('jsdom').JSDOM;
const URL = require('url').URL;
const argv = require('minimist')(process.argv.slice(2));

// Don't use Firefox for these domains. Will use JSDOM to fetch page source instead.
const FIREFOX_DOMAIN_DENYLIST = [
    'spiegel.de'
]

// Don't use Readability for these domains. Will use full page HTML instead.
const READABILITY_DOMAIN_DENYLIST = [
    'newyorker.com'
]

function url_in_blacklist(url, blacklist) {
    let parsed_url = new URL(url);
    let hostname = parsed_url.hostname.toLowerCase();
    for (const blacklisted_domain of blacklist) {
        if (hostname.endsWith(blacklisted_domain.toLowerCase())) {
            return true;
        }
    }
    return false;
}

function use_firefox(url) {
    return !url_in_blacklist(url, FIREFOX_DOMAIN_DENYLIST);
}

function use_readability(url) {
    return !url_in_blacklist(url, READABILITY_DOMAIN_DENYLIST);
}

function countWords(str) {
    return str.trim().split(/\s+/).length;
}

function getHash(url) {
    return crypto
        .createHash("sha256")
        .update(process.env.PINBOARD_MARK_READ_SECRET + url)
        .digest("hex")
        .substring(0, 32);
}

async function fetch_page_source_firefox(url, callback) {
    const driver = await new Builder()
        .forBrowser('firefox')
        .withCapabilities(Capabilities.firefox().set("acceptInsecureCerts", true))
        .setFirefoxOptions(new firefox.Options().addArguments("-headless"))
        .build();
    try {
        await driver.get(url);
        await driver.sleep(5000);
        const page_source = await driver.getPageSource();
        return callback(page_source);
    } finally {
        await driver.quit();
    }
}

async function fetch_page_source_jsdom(url, callback) {
    JSDOM.fromURL(url).then(dom => {
        callback(dom.window.document.documentElement.outerHTML);
    });
}

async function make_readable(url, callback) {
    let fetch_page_source = fetch_page_source_jsdom;
    if (use_firefox(url)) {
        fetch_page_source = fetch_page_source_firefox;
    }
    fetch_page_source(url, page_source => {
        let res = [];

        // Parse article
        const dom = new JSDOM(page_source);
        let reader = new Readability(dom.window.document);
        let article = reader.parse();
        let articleHtml = page_source;
        if (use_readability(url)) {
            articleHtml = article.content;
        }

        // Base path for images and other media
        res.push('<base href="' + url + '" />')

        // Meta data (sub title, site name, word count)
        let meta = [];
        if (article.byline) {
            meta.push(article.byline);	
        }
        if (article.siteName) {
            meta.push(article.siteName);
        }
        meta.push(countWords(article.textContent) + ' words');	
        
        // Article links
        let links = [];
        links.push('<a class="pb-to-kindle-article-link" href="' + url + '">Article link</a>');
        if (process.env.PINBOARD_MARK_READ_URL && process.env.PINBOARD_MARK_READ_SECRET) {
            let href =
              process.env.PINBOARD_MARK_READ_URL +
              "?h=" +
              getHash(url) +
              "&url=" +
              encodeURIComponent(url);
            links.push('<a class="pb-to-kindle-article-mark-as-read-link" href="' + href + '">Mark as read</a>');
        }

        // Output
        if (article.title) {
            res.push('<h2 class="pb-to-kindle-article-title">' + article.title + '</h2>');
        }
        res.push('<p><i class="pb-to-kindle-article-metadata">' + meta.join(' • ') + '</i></p>');
        res.push('<p><i class="pb-to-kindle-article-links">' + links.join(' • ') + '</i></p>');
        res.push('<hr>');
        res.push(articleHtml);
        res.push('<hr>');
        res.push('<p><i>' + links.join(' • ') + '</i></p>');

        return callback(res); 
    });
}

function validate_args(argv) {
    if (argv._.length != 1) {
        console.error('Error: Exactly one input URL has to be specified.');
        return process.exit(1); 
    }
    if (!argv.output_file) {
        console.error('Error: Missing parameter --output_file.');
        return process.exit(1);
    }
}

/* Main */
validate_args(argv);
make_readable(argv._[0], res => {
    writeFile(argv.output_file, res.join('\n'), (err) => {
        if (err) {
            console.error('Error: Could not save to output file.');
            console.error(err);
            return process.exit(1);
        }
    });
});
