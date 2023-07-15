#include <stdio.h>
#include <stdlib.h>
#include "candles.h"
#include "indicators.h"

#define TASK_MAX 1000

typedef struct {
  int indicator_index;
  int size;
  int inputs_offset;
  TI_REAL * * inputs;
  TI_REAL * * inputs_buffer;
  TI_REAL * options;
  int outputs_offset;
  TI_REAL * * outputs;
  TI_REAL * * outputs_buffer;
} Task;

Task task_list[TASK_MAX];
int next_task = 0;

int new_task(int indicator_index, int size, int input_offset) {
  task_list[next_task].indicator_index = indicator_index;
  task_list[next_task].size = size;
  task_list[next_task].inputs_offset = input_offset;
  ti_indicator_info indicator = ti_indicators[indicator_index];
  task_list[next_task].inputs_buffer = malloc(sizeof(TI_REAL *) * indicator.inputs);
  task_list[next_task].inputs = malloc(sizeof(TI_REAL *) * indicator.inputs);
  for (int i = 0; i < indicator.inputs; ++i) {
    task_list[next_task].inputs_buffer[i] = malloc(sizeof(TI_REAL) * size);
    task_list[next_task].inputs[i] = &task_list[next_task].inputs_buffer[i][input_offset];
  }
  task_list[next_task].options = malloc(sizeof(TI_REAL) * indicator.options);
  task_list[next_task].outputs = malloc(sizeof(TI_REAL *) * indicator.outputs);
  for (int i = 0; i < indicator.outputs; ++i) {
    task_list[next_task].outputs[i] = malloc(sizeof(TI_REAL) * size);
  }
  return next_task++;
}

void inputs_number(int task_index, int x, int y, TI_REAL number) {
  task_list[task_index].inputs[y][x] = number;
}

void options_number(int task_index, int x, TI_REAL number) {
  task_list[task_index].options[x] = number;
}

TI_REAL outputs_number(int task_index, int x, int y) {
  return task_list[task_index].outputs[y][x];
}

void run_task(int task_index) {
  Task task = task_list[task_index];
  ti_indicator_info indicator = ti_indicators[task.indicator_index];
  indicator.indicator(task.size, (const TI_REAL * *)task.inputs, task.options, task.outputs);
}

int main() {
  printf("你好，世界\n");
  printf("%d\n", ti_indicators[0].inputs);
  return 0;
}
