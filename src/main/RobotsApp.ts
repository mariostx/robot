import { PriorityTaskManager } from './../task/algorithm/PriorityTaskManager';
import { ITask } from '../interfaces/Task';
import { TaskExecutor } from '../services/TaskExecutor';
import { tasks } from './../data/Tasks';
import * as taskConfig from '../config/task.json';

const taskManager = new PriorityTaskManager(tasks, taskConfig)
const tasksExecutor = new TaskExecutor(tasks, taskConfig, taskManager);
tasksExecutor.executeTasks();
// const MAX_TASKS_NUMBER = 3;
// let currentTasks: Array<ITask> = [];

// const cleanWindows = (task: ITask) => {
//   setTimeout(() => {
//     console.log('Squeeesh');
//     taskFinished(task);
//   }, 300);
// };

// const waterPlants = (task: ITask) => {
//   setTimeout(() => {
//     console.log('Blub');
//     taskFinished(task);
//   }, 700);
// };

// const feedCat = (task: ITask) => {
//   setTimeout(() => {
//     console.log('Meow');
//     taskFinished(task);
//   }, 500);
// };

// const taskFinished = (finsihedTask: ITask) => {
//   //console.log('finished', finsihedTask);
//   currentTasks = currentTasks.filter((task) => task.id != finsihedTask.id);
//   if (tasks.length) {
//     const nextTask = getTask();
//     if (nextTask) {
//       executeTask(nextTask);
//     }
//   }
//   if (!tasks.length && !currentTasks.length) {
//     console.log('all tasks finished - TODO: statistics');
//   }
// };

// const getTask = (): ITask | null => {
//   let task = null;
//   if (tasks.length > 0) {
//     if (currentTasks.length === 0) {
//       task = tasks.shift() ?? null;
//     } else {
//       for (const [index, el] of tasks.entries()) {
//         if (currentTasks.every((currentTask) => currentTask.robotName !== el.robotName)) {
//           task = el;
//           tasks.splice(index, 1);
//           break;
//         }
//       }
//     }
//   }
//   console.log('get task', task);
//   return task;
// };

// const executeTask = (task: ITask): void => {
//   currentTasks.push(task);
//   switch (task.name) {
//     case 'clean_the_windows':
//       cleanWindows(task);
//       break;
//     case 'feed_the_cat':
//       feedCat(task);
//       break;
//     case 'water_the_plants':
//       waterPlants(task);
//   }
// };

// const startExecutingTasks = ((): void => {
//   for (let index = 0; index < MAX_TASKS_NUMBER; index++) {
//     const nextTask = getTask();
//     if (nextTask) {
//       executeTask(nextTask);
//     }
//   }
// })();
