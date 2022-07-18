#!/bin/bash
#TODO: convert to node
untracked=$(
    setopt CSH_NULL_GLOB || true; git status --porcelain -su ./src/posts/**/*.{jpg,jpeg,png,webp,avif,gif} | cut -c 4-
)
files=$(
    for file in ${untracked}; do 
        if [ $(identify -ping -format "%w" "$file") -gt 1500 ]; then 
            echo "$file"; 
        fi; 
    done
)
mogrify -resize 1500x\> ${files}