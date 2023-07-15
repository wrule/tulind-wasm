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
} Task;

Task task_list[TASK_MAX];
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

  return next_task++;
}

void inputs_number(
  int task_index,
  int x,
  int y,
  TI_REAL number
) {
  task_list[task_index].inputs[y][x] = number;
}

void options_number(
  int task_index,
  int x,
  TI_REAL number
) {
  task_list[task_index].options[x] = number;
}

TI_REAL outputs_number(
  int task_index,
  int x,
  int y
) {
  return task_list[task_index].outputs[y][x];
}

void run_task(int task_index) {
  Task task = task_list[task_index];
  ti_indicator_info indicator = ti_indicators[task.indicator];
  indicator.indicator(task.size, (const TI_REAL * *)task.inputs, task.options, task.outputs);
}

void show_task_output(int task_index) {
  Task task = task_list[task_index];
  for (int y = 0; y < task.outputs_length; ++y) {
    for (int x = 0; x < task.size; ++x) {
      printf("%lf ", task.outputs[y][x]);
    }
    printf("\n");
  }
}

// int main() {
//   printf("你好，世界\n");
//   printf("%d\n", new_task(0, 100, 1, 1, 1));
//   printf("%d\n", new_task(0, 100, 1, 1, 1));
//   printf("%d\n", new_task(0, 100, 1, 1, 1));
//   printf("你好，鸡毛\n");
//   const ti_indicator_info * info = ti_indicators;
//   printf("%s\n", info[0].name);
//   /* The last item is all zeros, so loop until then. */
//   // int i = 0;
//   // while (info->name != 0) {
//   //   printf("Found %s %d\n", info->name, info->type);
//   //   i++;
//   //   ++info;
//   // }
//   // printf("%d\n", i);
//   return 0;
// }
