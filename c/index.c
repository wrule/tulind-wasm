#include <stdio.h>
#include <stdlib.h>
#include "candles.h"
#include "indicators.h"

int new_task(
  int size,
  int inputs_length,
  int options_length,
  int outputs_length
) {
  printf("%d %d %d %d\n", size, inputs_length, options_length, outputs_length);
  TI_REAL * options = malloc(sizeof(TI_REAL) * options_length);
  TI_REAL * * inputs = malloc(sizeof(TI_REAL *) * inputs_length);
  for (int i = 0; i < inputs_length; ++i) {
    inputs[i] = malloc(sizeof(TI_REAL) * size);
  }
  TI_REAL * * outputs = malloc(sizeof(TI_REAL *) * outputs_length);
  for (int i = 0; i < outputs_length; ++i) {
    outputs[i] = malloc(sizeof(TI_REAL) * size);
  }
  return 0;
}

int main() {
  printf("你好，世界\n");
  new_task(100, 1, 1, 1);
  return 0;
}
