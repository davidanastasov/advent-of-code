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

# Check if the day already exists
if [ -d "$day" ]; then
    echo "Day already exists"
    exit 1
fi

# Copy the template to the day
cp -r .template $day