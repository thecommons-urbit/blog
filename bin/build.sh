#!/bin/bash
# ==============================================================================
#
# build - Build the frontend and add necessary metadata.
#
# ==============================================================================

# Stop on error
set -e

# --------------------------------------
# Functions
# --------------------------------------

#
# Print script usage
#
usage() {
  if [[ $1 -ne 0 ]]; then
    exec 1>&2
  fi

  echo -e ""
  echo -e "Usage:\t$SCRIPT_NAME [-h] [-k KELVIN] [-l] [-s SHIP_NAME] [-u URL] [-v GLOB_HASH]"
  echo -e ""
  echo -e "Build the app frontend and the desk files required to install it on an Urbit ship"
  echo -e ""
  echo -e "Options:"
  echo -e "  -h\tPrint script usage info"
  echo -e "  -k\tSet alternative kelvin version to use (default: $DEFAULT_KELVIN)"
  echo -e "  -l\tFix formatting errors raised by eslint"
  echo -e "  -s\tSet name of the distributor ship"
  echo -e "  -u\tURL for %glob-http"
  echo -e "  -v\tSet glob hash for %glob-http"
  echo -e ""
  exit $1
}

#
# Build docket file
#
docket() {
  DOCKET_FILE=$DESK_DIR/desk.docket-0

  echo ":~" > $DOCKET_FILE
  echo "  title+'Common Blog'" >> $DOCKET_FILE
  echo "  info+'Self-hosted writing and publishing.'" >> $DOCKET_FILE
  echo "  color+0xef.f0f4" >> $DOCKET_FILE
  echo "  image+'https://github.com/thecommons-urbit/blog/blob/main/assets/tile.png?raw=true'" >> $DOCKET_FILE
  echo "  base+'blog'" >> $DOCKET_FILE
  echo "  version+[$VERSION_MAJOR $VERSION_MINOR $VERSION_PATCH]" >> $DOCKET_FILE
  echo "  license+'MIT'" >> $DOCKET_FILE
  echo "  website+'https://github.com/thecommons-urbit/blog'" >> $DOCKET_FILE

  if [[ -z $GLOB_URL ]] && [[ -z $GLOB_HASH ]]; then
    echo "  glob-ames+[~$SHIP 0v0]" >> $DOCKET_FILE
  elif [[ -z $GLOB_URL ]] && [[ ! -z $GLOB_HASH ]]; then
    echo "  glob-http+['$DEFAULT_GLOB_URL' $GLOB_HASH]" >> $DOCKET_FILE
  else
    echo "  glob-http+['$GLOB_URL' $GLOB_HASH]" >> $DOCKET_FILE
  fi

  echo "==" >> $DOCKET_FILE
}

# --------------------------------------
# Variables
# --------------------------------------

SCRIPT_NAME=$(basename $0 | cut -d '.' -f 1)
SCRIPT_PATH=$(realpath $0)
SCRIPT_DIR=$(dirname $SCRIPT_PATH)

ROOT_DIR=$(dirname $SCRIPT_DIR)
BUILD_DIR="$ROOT_DIR/build"
DESK_DIR="$BUILD_DIR/desk"
FRONTEND_DIR="$BUILD_DIR/frontend"

LINT_FIX=0

VERSION_MAJOR=0
VERSION_MINOR=2
VERSION_PATCH=0
VERSION_FULL="$VERSION_MAJOR.$VERSION_MINOR.$VERSION_PATCH"

DEFAULT_KELVIN=412
DEFAULT_GLOB_HASH=0v0
DEFAULT_DISTRIBUTOR="dister-bonbud-macryg"
DEFAULT_GLOB_URL="https://raw.githubusercontent.com/thecommons-urbit/blog/develop/glob/v$VERSION_FULL.glob"

KELVIN=$DEFAULT_KELVIN
SHIP=$DEFAULT_DISTRIBUTOR

# --------------------------------------
# MAIN
# --------------------------------------

# Parse arguments
OPTS=":hlk:s:u:v:"
while getopts ${OPTS} opt; do
  case ${opt} in
    h)
      usage 0
      ;;
    k)
      KELVIN=$OPTARG
      ;;
    l)
      LINT_FIX=1
      ;;
    s)
      SHIP=$OPTARG
      ;;
    u)
      GLOB_URL=$OPTARG
      ;;
    v)
      GLOB_HASH=$OPTARG
      ;;
    :)
      if [[ "${OPTARG}" == "u" ]]; then
        echo "$SCRIPT_NAME: Missing GLOB argument for '-u'" >&2
        usage 2
      else
        echo "$SCRIPT_NAME: Missing argument for '-${OPTARG}'" >&2
        usage 2
      fi
      ;;
    ?)
      echo "$SCRIPT_NAME: Invalid option '-${OPTARG}'" >&2
      usage 2
      ;;
  esac
done

# Clean up build directories
rm -rf $BUILD_DIR
mkdir -p $DESK_DIR

# Build frontend
if [ $LINT_FIX -eq 0 ]; then
  cd "$ROOT_DIR/src/frontend"
  npm run lint
  npm run build
  mv "$ROOT_DIR/src/frontend/dist" "$ROOT_DIR/build/frontend/"
else
  cd "$ROOT_DIR/src/frontend"
  npm run lint -- --fix
  npm run build
  mv "$ROOT_DIR/src/frontend/dist" "$ROOT_DIR/build/frontend/"
fi

# Copy app backend
cp -r "$ROOT_DIR/src/backend"/* "$ROOT_DIR/build/desk/"

# Build desk.docket-0
docket

# Build metadata
echo ":~  %blog  ==" > $DESK_DIR/desk.bill
echo "~$SHIP" > $DESK_DIR/desk.ship
echo "[%zuse $KELVIN]" > $DESK_DIR/sys.kelvin
