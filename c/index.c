#include <stdio.h>
#include <stdlib.h>
#include "candles.h"
#include "indicators.h"

#define TASK_MAX 1000

typedef struct {
  int indicator;
  int size;
  int inputs_length;
  TI_REAL * * inputs;
  int options_length;
  TI_REAL * options;
  int outputs_length;
  TI_REAL * * outputs;
  int status;
} task;

task task_list[TASK_MAX];
int next_task = 0;

int new_task(
  int indicator,
  int size,
  int inputs_length,
  int options_length,
  int outputs_length
) {
  task_list[next_task].indicator = indicator;
  task_list[next_task].size = size;

  task_list[next_task].inputs_length = inputs_length;
  task_list[next_task].inputs = malloc(sizeof(TI_REAL *) * inputs_length);
  for (int i = 0; i < inputs_length; ++i) {
    task_list[next_task].inputs[i] = malloc(sizeof(TI_REAL) * size);
  }

  task_list[next_task].options_length = options_length;
  task_list[next_task].options = malloc(sizeof(TI_REAL) * options_length);

  task_list[next_task].outputs = malloc(sizeof(TI_REAL *) * outputs_length);
  for (int i = 0; i < outputs_length; ++i) {
    task_list[next_task].outputs[i] = malloc(sizeof(TI_REAL) * size);
  }

  task_list[next_task].status = 0;

  return next_task++;
}

int main() {
  printf("你好，世界\n");
  printf("%d\n", new_task(0, 100, 1, 1, 1));
  printf("%d\n", new_task(0, 100, 1, 1, 1));
  printf("%d\n", new_task(0, 100, 1, 1, 1));
  printf("你好，鸡毛\n");
  return 0;
}
