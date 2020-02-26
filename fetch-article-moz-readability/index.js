const fs = require('fs');
const readability = require('readability-nodejs');
const JSDOM = require('jsdom').JSDOM;
const argv = require('minimist')(process.argv.slice(2));

function countWords(str) {
	return str.trim().split(/\s+/).length;
}

function fetch_article(url, callback) {
    JSDOM.fromURL(url).then(dom => {
        let res = [];

        // Parse article
        let reader = new readability.Readability(dom.window.document);
        let article = reader.parse();
    
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
        links.push('<a id="pb-to-kindle-article-link" href="' + url + '">Article link</a>');
    
        // Output
        if (article.title) {
            res.push('<h2 id="pb-to-kindle-article-title">' + article.title + '</h2>');
        }
        res.push('<p><i id="pb-to-kindle-article-metadata">' + meta.join(' • ') + '</i></p>');
        res.push('<p><i id="pb-to-kindle-article-links">' + links.join(' • ') + '</i></p>');
        res.push('<hr>');
        res.push(article.content);
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
fetch_article(argv._[0], res => {
    fs.writeFile(argv.output_file, res.join('\n'), (err) => {
        if (err) {
            console.error('Error: Could not save to output file.');
            console.error(err);
            return process.exit(1);
        }
    });
});