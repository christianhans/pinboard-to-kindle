# pinboard-to-kindle

![Raspberry Pi and Kindle](https://i.imgur.com/4ZxMhrt.jpg)

Pinboard recipe for sending unread Pinboard bookmarks to your Kindle.

## Prerequisites

  * [Calibre](https://calibre-ebook.com) 3.0 or more recent
    + Version 4.11.2 is the latest tested version
  * Git
    + Required to clone this repository (alternatively you download this repository as ZIP archive)

On Debian, Raspian and Ubuntu you can run this command to install all prerequisites:

```
sudo apt-get install git calibre
```

On macOS with [Homebrew](https://brew.sh) installed the following commands will also install all prerequisites:

```
brew install git
brew cask install calibre
```

## Installation
  
Clone this repository and `cd` into the cloned `pinboard-to-kindle` directory:

```
git clone https://github.com/christianhans/pinboard-to-kindle.git
cd pinboard-to-kindle
```

Set `FETCH_ARTICLE_MOZ_READABILITY_SCRIPT_PATH` so it points to the full file path of `fetch-article-moz-readability/index.js`. For example:

```
echo 'FETCH_ARTICLE_MOZ_READABILITY_SCRIPT_PATH="/home/pi/pinboard-to-kindle/fetch-article-moz-readability/index.js"' >> config.env
```

Set your Pinboard API token. Copy your token from [this page](https://pinboard.in/settings/password) and replace `username:A3F...HG78` below with your actual token:

```
echo 'PINBOARD_TOKEN="username:A3F...HG78"' >> config.env
```

## Usage

In order to generate an eBook optimized for Kindle Paperwhite run:

```
eval $(egrep -v "^#" config.env | xargs) ebook-convert pinboard-to-kindle.recipe pinboard.mobi --output-profile kindle_pw3
```

To generate an eBook in ePub format run:

```
eval $(egrep -v "^#" config.env | xargs) ebook-convert pinboard-to-kindle.recipe pinboard.epub
```
