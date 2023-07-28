#!/bin/bash

rush_list=$(node common/scripts/install-run-rush.js -q list --to-version-policy npm --json)
json_packages=$(echo $rush_list \
    | sed 's/^[^{]*[{]/{/')

packages=$(echo $json_packages \
    | jq '.projects[] | select((.tags == []) or (.tags[] | index("substrate") | not)) | .name + "@" + .version' -r)

for pkg in $packages; do
    echo "$pkg"
    npm dist-tag add "$pkg" "latest" || exit 1
done
