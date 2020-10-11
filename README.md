<p align="center">
  <a href="https://github.com/christianhans/pinboard-to-kindle">
    <img src="https://imgur.com/rWkJ1Bt.jpg" alt="Raspberry Pi and Kindle" width="400">
  </a>

  <h3 align="center">Pinboard to Kindle</h3>

  <p align="center">
    Calibre recipe for sending unread Pinboard bookmarks to your Kindle.
  </p>
  
  <p align="center">
  ➡️ <a href="https://christianhans.info/12791/running-your-own-read-later-service-with-raspberry-pi-and-pinboard">Build your personal Read Later Service using Raspberry Pi</a>
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

| Prerequisite | Version         | Comment                              |
|--------------|-----------------|--------------------------------------|
| Git          | Any             | Required for cloning this repository |
| Node.js      | 10 or later     |                                      |
| NPM          | 5 or later      |                                      |
| Calibre      | 3.39.1 or later |                                      |
| Firefox      | 68 or later     |                                      |
| Geckodriver  | 0.26.0 or later |                                      |

#### Install Prerequisites on macOS

On macOS you can use [Homebrew](https://brew.sh) to install all prerequisites:

```sh
brew install git node geckodriver
brew cask install calibre firefox
```

#### Install Prerequisites on Debian/Ubuntu

On Debian and Ubuntu you can run this command to install all prerequisites except Geckodriver:

```sh
sudo apt-get install git nodejs npm calibre firefox-esr
```

Prebuilt Geckodriver binaries for x86 and x64 architectures can be downloaded [here](https://github.com/mozilla/geckodriver/releases). Copy `geckodriver` for example to `/user/local/bin`, such that the `geckodriver` binary is in your `PATH`.

### Installation
  
Clone this repository and `cd` into the cloned `pinboard-to-kindle` directory:

```sh
git clone https://github.com/christianhans/pinboard-to-kindle.git
cd pinboard-to-kindle
```

Set your Pinboard API token. Copy your token from [this page](https://pinboard.in/settings/password) and replace `username:A3F...HG78` below with your actual token:

```sh
echo 'PINBOARD_TOKEN="username:A3F...HG78"' >> config.env
```

## Usage

In order to generate an eBook optimized for Kindle Paperwhite run:

```sh
eval $(egrep -v "^#" config.env | xargs) ebook-convert pinboard-to-kindle.recipe pinboard.mobi --output-profile kindle_pw3
```

To generate an eBook in ePub format run:

```sh
eval $(egrep -v "^#" config.env | xargs) ebook-convert pinboard-to-kindle.recipe pinboard.epub
```

## License

Distributed under the MIT License. See `LICENSE` for more information.
