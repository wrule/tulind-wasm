#include <stdio.h>
#include <stdlib.h>
#include "candles.h"
#include "indicators.h"

int main() {
  printf("你好，世界\n");
  const ti_indicator_info *info = ti_indicators;
  printf("[\n");
  while (info->name != 0) {
    printf("\t{\n");
    printf("\t\t\"name\": \"%s\",\n", info->name);
    printf("\t\t\"full_name\": \"%s\",\n", info->full_name);
    printf("\t\t\"type\": %d,\n", info->type);
    printf("\t\t\"inputs\": %d,\n", info->inputs);
    printf("\t\t\"options\": %d,\n", info->options);
    printf("\t\t\"outputs\": %d,\n", info->outputs);
    printf("\t},\n");
    ++info;
  }
  printf("]\n");
  return 0;
}
