# pinboard-to-kindle

![Raspberry Pi and Kindle](https://i.imgur.com/4ZxMhrt.jpg)

Send a daily newspaper containing unread Pinboard bookmarks to your Kindle

## Prerequisites

  * [Calibre](https://calibre-ebook.com) 3.0 or more recent
    + Version 4.11.2 is the latest tested version
  * Git
    + Required to clone this repository (alternatively you download this repository as ZIP archive)

## Installation on Debian/Raspian 10.x

Prerequisites:

```
sudo apt-get install git calibre
```
  
Clone this repository:

```
git clone https://github.com/christianhans/pinboard-to-kindle.git
```

Open `pinboard-to-kindle.recipe` in a text editor of your choice. For example:

```
cd pinboard-to-kindle
nano pinboard-to-kindle.recipe
```

Adjust `FETCH_ARTICLE_MOZ_READABILITY_SCRIPT_PATH` so that it contains the full file path to `fetch-article-moz-readability/index.js`, for example:

```
FETCH_ARTICLE_MOZ_READABILITY_SCRIPT_PATH = "/home/pi/pinboard-to-kindle/fetch-article-moz-readability/index.js"
```

Save the file and close your text editor.

## Usage
