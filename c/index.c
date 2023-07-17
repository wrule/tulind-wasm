#include <stdio.h>
#include <stdlib.h>
#include "candles.h"
#include "indicators.h"

#define TASK_MAX 1000
#define DATA_MAX 4

typedef struct {
  int enabled;
  int target_index;
  int is_outputs;
  int data_index;
} MapInfo;

typedef struct {
  int used;
  int indicator_index;
  int size;
  int inputs_offset;
  int outputs_offset;
  MapInfo inputs_map[DATA_MAX];
  TI_REAL options[DATA_MAX];
  TI_REAL * inputs[DATA_MAX];
  TI_REAL * outputs[DATA_MAX];
} Task;

Task task_list[TASK_MAX];
int next_task = 0;

void free_task(int task_index) {
  Task * task = &task_list[task_index];
  ti_indicator_info * indicator = &ti_indicators[task->indicator_index];
  for (int i = 0; i < indicator->inputs; ++i)
    if (!task->inputs_map[i].enabled && task->inputs[i] != NULL)
      free(task->inputs[i]);
  for (int i = 0; i < indicator->outputs; ++i)
    free(task->outputs[i]);
  task->used = 0;
}

void free_current() {
  if (task_list[next_task].used) free_task(next_task);
}

void reset() {
  for (int i = 0; i < TASK_MAX; ++i)
    if (task_list[i].used) free(i);
  next_task = 0;
}

int new_task(int indicator_index, int size) {
  Task * task = &task_list[next_task];
  ti_indicator_info * indicator = &ti_indicators[indicator_index];
  if (task->used) free_task(next_task);
  task->indicator_index = indicator_index;
  task->size = size;
  for (int i = 0; i < indicator->outputs; ++i)
    task->outputs[i] = malloc(sizeof(TI_REAL) * task->size);
  task->used = 1;
  int task_index = next_task;
  if (++next_task >= TASK_MAX) next_task = 0;
  return task_index;
}

void inputs_number(
  int task_index,
  int input_index,
  int offset,
  TI_REAL number
) {
  Task * task = &task_list[task_index];
  if (task->inputs[input_index] == NULL)
    task->inputs[input_index] = malloc(sizeof(TI_REAL) * task->size);
  task->inputs[input_index][offset] = number;
  task->inputs_map[input_index].enabled = 0;
}

void inputs_map(
  int task_index,
  int input_index,
  int target_index,
  int is_outputs,
  int data_index
) {
  MapInfo * info = &task_list[task_index].inputs_map[input_index];
  info->enabled = 1;
  info->target_index = target_index;
  info->is_outputs = is_outputs;
  info->data_index = data_index;
}

void options_number(int task_index, int offset, TI_REAL number) {
  task_list[task_index].options[offset] = number;
}

TI_REAL outputs_number(int task_index, int output_index, int offset) {
  return task_list[task_index].outputs[output_index][offset];
}

void link_task(int task_index) {
  Task * task = &task_list[task_index];
  ti_indicator_info * indicator = &ti_indicators[task->indicator_index];
  int inputs_offset = 0;
  for (int i = 0; i < indicator->inputs; ++i) {
    MapInfo * info = &task->inputs_map[i];
    if (info->enabled) {
      Task * target = &task_list[info->target_index];
      int offset = 0;
      if (info->is_outputs) {
        offset = target->outputs_offset;
        task->inputs[i] = target->outputs[info->data_index];
      } else {
        offset = target->inputs_offset;
        task->inputs[i] = target->inputs[info->data_index];
      }
      if (offset > inputs_offset) inputs_offset = offset;
    }
  }
  task->inputs_offset = inputs_offset;
}

void run_task(int task_index) {
  link_task(task_index);
  Task * task = &task_list[task_index];
  ti_indicator_info * indicator = &ti_indicators[task->indicator_index];
  task->outputs_offset = task->inputs_offset + indicator->start(task->options);
  const TI_REAL * inputs[DATA_MAX];
  TI_REAL * outputs[DATA_MAX];
  for (int i = 0; i < indicator->inputs; ++i)
    inputs[i] = &task->inputs[i][task->inputs_offset];
  for (int i = 0; i < indicator->outputs; ++i)
    outputs[i] = &task->outputs[i][task->outputs_offset];
  indicator->indicator(
    task->size - task->inputs_offset,
    inputs,
    task->options,
    outputs
  );
}

void run() {
  for (int i = 0; i < next_task; ++i) {
    run_task(i);
  }
}

int main() {
  reset();
  return 0;
}
