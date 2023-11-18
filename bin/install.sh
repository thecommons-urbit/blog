#!/bin/bash
# ==============================================================================
#
# install - Install desk files in a ship's pier.
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
  echo -e "Usage:\t$SCRIPT_NAME [-h] [-p PATH_TO_PIER] [-r PATH_TO_PIER] [-s SHIP_NAME]"
  echo -e ""
  echo -e "Install app files to a desk in an Urbit pier"
  echo -e ""
  echo -e "Options:"
  echo -e "  -h\tPrint script usage info"
  echo -e "  -p\tPath to local directory containing the pier"
  echo -e "  -r\tPath to remote directory containing the pier, access via SSH"
  echo -e "  -s\tName of pier to install to"
  echo -e ""
  exit $1
}

# --------------------------------------
# Variables
# --------------------------------------

INSTALL_VIA_SSH=false
SCRIPT_NAME=$(basename $0 | cut -d '.' -f 1)
SCRIPT_DIR=$(dirname $0)
ROOT_DIR=$(dirname $SCRIPT_DIR)
DESK_DIR="$ROOT_DIR/build/desk"

# --------------------------------------
# MAIN
# --------------------------------------

# Parse arguments
OPTS=":hp:r:s:"
while getopts ${OPTS} opt; do
  case ${opt} in
    h)
      usage 0
      ;;
    p)
      PIER_PATH=$OPTARG
      ;;
    r)
      PIER_PATH=$OPTARG
      INSTALL_VIA_SSH=true
      ;;
    s)
      PIER=$OPTARG
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

# Copy files
INSTALL_DIR="$PIER_PATH/$PIER/blog"

echo "Attempting to install in $INSTALL_DIR"
if [[ $INSTALL_VIA_SSH == true ]]; then
  scp -r ${DESK_DIR}/* ${INSTALL_DIR}/
else
  cp -r ${DESK_DIR}/* ${INSTALL_DIR}/
fi
echo "Successfully installed in $INSTALL_DIR"
