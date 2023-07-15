#include <stdio.h>
#include <stdlib.h>
#include "candles.h"
#include "indicators.h"

int main() {
  printf("你好，世界\n");
  const ti_indicator_info *info = ti_indicators;
  while (info->name != 0) {
    printf("Found %s\n", info->name);
    ++info;
  }
  return 0;
}
