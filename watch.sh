#!/bin/bash
# Usage: watch.sh <day>

# Check if the day is given
if [ -z "$1" ]; then
    echo "Usage: watch.sh <day>"
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

# Check if the day doesn't exists
if [ ! -d "$day_path" ]; then
    echo "Day doesn't exist"
    exit 1
fi

# Set cwd
cd "$day_path"

# Console colors
BLUE=$(tput setaf 4)
YELLOW=$(tput setaf 3)
NONE=$(tput op)

# Start the deno watchers
deno run --allow-all --quiet --watch a.ts | sed -e 's/^/'"$BLUE"'[Part 1]'"$NONE"'\ /' & 
deno run --allow-all --quiet --watch b.ts | sed -e 's/^/'"$YELLOW"'[Part 2]'"$NONE"'\ /' &

# Kill all deno processes on exit
trap "kill -- -$$" EXIT

wait