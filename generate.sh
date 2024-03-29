#!/bin/bash
# Usage: generate.sh <day>

# Check if the day is given
if [ -z "$1" ]; then
    echo "Usage: generate.sh <day>"
    exit 1
fi

# Pad the day with a 0 if it's a single digit
if [ ${#1} -lt 2 ]; then
    day=$(printf "%02d" $1)
else
    day=$1
fi

year=$(date +"%Y")
day_path="$year/$day"

# Check if the day already exists
if [ -d "$day_path" ]; then
    echo "Day already exists"
    exit 1
fi

# Create the year folder if it doesn't exist
mkdir -p "$year"

# Copy the template to the day
cp -r .template "$day_path"

# Open files in VSCode
code -r "$day_path"/a.ts "$day_path"/b.ts "$day_path"/input.txt

# Start the deno watchers
chmod +x watch.sh
./watch.sh "$day"

# Kill the watchers on exit
trap "kill -- -$$" EXIT