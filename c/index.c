#include <stdio.h>
#include <stdlib.h>
#include "candles.h"
#include "indicators.h"

#define TASK_MAX 1000

typedef struct {
  int indicator_index;
  int size;
  int size_buffer;
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
  task_list[next_task].size_buffer = size - input_offset;
  task_list[next_task].inputs_offset = input_offset;
  task_list[next_task].outputs_offset = -1;
  ti_indicator_info indicator = ti_indicators[indicator_index];
  task_list[next_task].inputs = malloc(sizeof(TI_REAL *) * indicator.inputs);
  task_list[next_task].inputs_buffer = malloc(sizeof(TI_REAL *) * indicator.inputs);
  for (int i = 0; i < indicator.inputs; ++i) {
    task_list[next_task].inputs[i] = malloc(sizeof(TI_REAL) * size);
    task_list[next_task].inputs_buffer[i] = &task_list[next_task].inputs[i][input_offset];
  }
  task_list[next_task].options = malloc(sizeof(TI_REAL) * indicator.options);
  task_list[next_task].outputs = malloc(sizeof(TI_REAL *) * indicator.outputs);
  task_list[next_task].outputs_buffer = malloc(sizeof(TI_REAL *) * indicator.outputs);
  for (int i = 0; i < indicator.outputs; ++i) {
    task_list[next_task].outputs[i] = malloc(sizeof(TI_REAL) * size);
    task_list[next_task].outputs_buffer[i] = task_list[next_task].outputs[i];
  }
  return next_task++;
}

void free_task(int task_index) {
  Task * task = &task_list[task_index];
  ti_indicator_info * indicator = &ti_indicators[task->indicator_index];
  for (int i = 0; i < indicator->inputs; ++i) {
    free(task->inputs[i]);
  }
  free(task->inputs);
  free(task->inputs_buffer);
  free(task->options);
  for (int i = 0; i < indicator->outputs; ++i) {
    free(task->outputs[i]);
  }
  free(task->outputs);
  free(task->outputs_buffer);
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
  Task * task = &task_list[task_index];
  ti_indicator_info indicator = ti_indicators[task->indicator_index];
  task->outputs_offset = task->inputs_offset + indicator.start(task->options);
  for (int i = 0; i < indicator.outputs; ++i) {
    task->outputs_buffer[i] = &task->outputs[i][task->outputs_offset];
  }
  indicator.indicator(task->size_buffer, (const TI_REAL * *)task->inputs_buffer, task->options, task->outputs_buffer);
}

int main() {
  printf("你好，世界\n");
  int task_index = new_task(72, 10, 2);
  for (int i = 0; i < 10; ++i) {
    inputs_number(task_index, i, 0, i);
  }
  options_number(task_index, 0, 4);
  run_task(task_index);
  for (int i = 0; i < 10; ++i) {
    printf("%d\t%lf\n", i, outputs_number(task_index, i, 0));
  }
  printf("%d\n", task_list[task_index].outputs_offset);
  free_task(task_index);
  return 0;
}
