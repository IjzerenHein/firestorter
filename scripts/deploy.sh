#!/bin/bash
yarn codecov
yarn release-notes publish --scope IjzerenHein --name Firestorter --token $1 ./CHANGELOG.md
