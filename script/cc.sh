#!/bin/bash
emcc c/index.c c/tiamalgamation.c -o dist/index.html
  # -s MODULARIZE=1 \
  # -s EXPORT_NAME='Tulind' \
  # -s EXPORTED_FUNCTIONS='[
  #   "_new_task",
  #   "_inputs_number",
  #   "_options_number",
  #   "_outputs_number",
  #   "_run_task"
  # ]'
