#!/bin/bash

if [ -z "${1}" ] || [ -z "${2}" ] || [ "${1}" == "-h|--help" ]
then
  echo "Usage:"
  echo "  process.sh /path/to/calibre.recipe Title"
  exit 0
fi

# Define as environment variables or define here:
# MAIL_FROM = ""
# MAIL_TO = ""

RECIPE_PATH="$1"
TITLE="${@:2}"
DATE=`date +%Y-%m-%d`

FETCHED_DIR_PATH="${HOME}/calibre-fetched"
if [ ! -d ${FETCHED_DIR_PATH} ]
then
  mkdir ${FETCHED_DIR_PATH}
fi

ebook-convert "${RECIPE_PATH}" "${FETCHED_DIR_PATH}/${TITLE}-${DATE}.mobi" \
	--title "${TITLE} ${DATE}" --output-profile kindle_pw3 && \
	echo "" | mail -a"From:$MAIL_FROM" -s "[pinboard-to-kindle] ${TITLE} ${DATE}" \
		-A "${FETCHED_DIR_PATH}/${TITLE}-${DATE}.mobi" "${MAIL_TO}"
