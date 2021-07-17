import { PriorityTaskManager } from './../task/algorithm/PriorityTaskManager';
import { TaskExecutor } from '../task/TaskExecutor';
import { tasks } from './../data/Tasks';
import * as taskConfig from '../config/task.json';

const taskManager = new PriorityTaskManager(tasks, taskConfig)
const tasksExecutor = new TaskExecutor(taskManager, taskConfig);
tasksExecutor.executeTasks();
