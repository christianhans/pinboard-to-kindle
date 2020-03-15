<p align="center">
  <a href="https://github.com/christianhans/pinboard-to-kindle">
    <img src="https://i.imgur.com/4ZxMhrt.jpg" alt="Raspberry Pi and Kindle" width="300">
  </a>

  <h3 align="center">Pinboard to Kindle</h3>

  <p align="center">
    Calibre recipe for sending unread Pinboard bookmarks to your Kindle.
  </p>
</p>

## Table of Contents

* [Overview](#overview)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
* [License](#license)

## Overview

  * Leverages a headless Firefox instance and Mozilla's [readability](https://github.com/mozilla/readability) library to fetch clutter- and ad-free article pages.
    + This results in eBooks with articles that look similar to Firefox's Reader View.
    + Pages with dynamic content (e.g. a page that loads images or text via JavaScript) can be fetched correctly.
    + Most images embedded in articles are fetched as well and will be part of the generated eBook.
  * Fetches only unread Pinboard bookmarks that have the tag `kindle-to` (per default up to 50 bookmarks).
  * When a Pinboard bookmark was successfully fetched, the tag `kindle-to` is replaced with the `kindle-sent` tag.
  * The tags `kindle-to`, `kindle-sent` and number of maximum bookmarks to fetch can be configured in `pinboard-to-kindle.recipe`.

## Getting Started

### Prerequisites

  * Git
    + Required to clone this repository (alternatively you download this repository as ZIP archive)
  * Node.js
    * Version 10 or later
  * NPM
    * Version 5 or later
  * Calibre
    + Version 3.39.1 or later
  * Firefox
    + Version 68 or later
  * Geckodriver
    + Version 0.26.0 or later

#### macOS

On macOS with [Homebrew](https://brew.sh) you can run this command to install all prerequisites:

```
brew install git node geckodriver
brew cask install calibre firefox
```

#### Debian and Ubuntu

On Debian and Ubuntu you can run this command to install all prerequisites except Geckodriver:

```
sudo apt-get install git nodejs npm calibre firefox-esr
```

Prebuilt Geckodriver binaries for x86 and x64 architectures can be downloaded [here](https://github.com/mozilla/geckodriver/releases). Copy `geckodriver` for example to `/user/local/bin`, such that the `geckodriver` binary is in your `PATH`.

### Installation
  
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

## License

Distributed under the MIT License. See `LICENSE` for more information.
