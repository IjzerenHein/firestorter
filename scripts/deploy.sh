#!/bin/bash
bun codecov
bun release-notes publish --scope IjzerenHein --name Firestorter --token $1 ./CHANGELOG.md
