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
  echo -e "Usage:\t$SCRIPT_NAME [-h] [-k KELVIN] [-s SHIP_NAME]"
  echo -e ""
  echo -e "Build the app frontend and the desk files required to install it on an Urbit ship"
  echo -e ""
  echo -e "Options:"
  echo -e "  -h\tPrint script usage info"
  echo -e "  -k\tSet alternative kelvin version to use (default: $DEFAULT_KELVIN)"
  # XX add eslint?
  # echo -e "  -l\tFix formatting errors raised by eslint"
  echo -e "  -s\tSet name of the distributor ship"
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
  echo "  info+'A tool for publishing.'" >> $DOCKET_FILE
  echo "  color+0x57.3c7c" >> $DOCKET_FILE
  echo "  image+''" >> $DOCKET_FILE
  echo "  base+'blog'" >> $DOCKET_FILE
  echo "  version+[$VERSION_MAJOR $VERSION_MINOR $VERSION_PATCH]" >> $DOCKET_FILE
  echo "  license+'MIT'" >> $DOCKET_FILE
  echo "  website+'https://github.com/thecommons-urbit/blog'" >> $DOCKET_FILE
  echo "  glob-ames+[~$SHIP 0v0]" >> $DOCKET_FILE
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

# XX add eslint?
# LINT_FIX=0

VERSION_MAJOR=0
VERSION_MINOR=1
VERSION_PATCH=1
VERSION_FULL="$VERSION_MAJOR.$VERSION_MINOR.$VERSION_PATCH"

DEFAULT_KELVIN=412
DEFAULT_DISTRIBUTOR="simsur-ronbet"

KELVIN=$DEFAULT_KELVIN
SHIP=$DEFAULT_DISTRIBUTOR

# --------------------------------------
# MAIN
# --------------------------------------

# Parse arguments
OPTS=":hk:s:"
while getopts ${OPTS} opt; do
  case ${opt} in
    h)
      usage 0
      ;;
    k)
      KELVIN=$OPTARG
      ;;
    s)
      SHIP=$OPTARG
      ;;
    :)
      echo "$SCRIPT_NAME: Missing argument for '-${OPTARG}'" >&2
      usage 2
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
cd "$ROOT_DIR/src/frontend"
npm run build
mv "$ROOT_DIR/src/frontend/dist" "$ROOT_DIR/build/frontend/"

# Copy app backend
cp -r "$ROOT_DIR/src/backend"/* "$ROOT_DIR/build/desk/"

# Build desk.docket-0
docket

# Build desk.bill
echo ":~  %blog  ==" > $DESK_DIR/desk.bill

# Build desk.ship
echo "$SHIP" > $DESK_DIR/desk.ship

# Build sys.kelvin
echo "[%zuse $KELVIN]" > $DESK_DIR/sys.kelvin
