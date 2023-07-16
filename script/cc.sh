#!/bin/bash
emcc -O3 c/index.c c/tiamalgamation.c -o dist/tulind.js \
  -s MODULARIZE=1 \
  -s EXPORT_NAME='Tulind' \
  -s EXPORTED_FUNCTIONS='[
    "_new_task",
    "_inputs_number",
    "_inputs_map",
    "_options_number",
    "_outputs_number",
    "_link_task",
    "_run_task"
  ]'
