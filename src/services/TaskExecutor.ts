import { PriorityTaskManager } from './../task/algorithm/PriorityTaskManager';
import { ITaskConfig as ITaskConfig } from '../interfaces/TaskConfig';
import { ITask } from 'interfaces/Task';

export class TaskExecutor {
  private readonly MAX_TASKS_NUMBER = 3;
  private tasks: ITask[];
  private currentTasks: ITask[] = [];
  private taskConfig: ITaskConfig;
  private startTime: number | undefined;
  private taskManager: PriorityTaskManager;
  private blockedTasks: string[] = [];

  constructor(tasks: ITask[], taskConfig: ITaskConfig, taskManager: PriorityTaskManager) {
    this.tasks = tasks;
    this.taskConfig = taskConfig;
    this.taskManager = taskManager;
  }

  executeTasks = (): void => {
    this.startTime = new Date().getTime();
    this.startExecutingTasks();
  };

  private startExecutingTasks = (): void => {
    let task = null;
    do {
      task = this.taskManager.getTask(this.currentTasks, this.blockedTasks);
      if (task) {
        this.executeTask(task);
      }
    } while (this.currentTasks.length < this.MAX_TASKS_NUMBER && task !== null);
  };

  private finish = () => {
    if (this.startTime) {
      const executionTime = (new Date().getTime() - this.startTime) / 1000;
      console.log('All task finished! Execution time(s): %f', executionTime);
    }
  };

  private cleanWindows = (task: ITask) => {
    const rateLimit = this.taskConfig.clean_the_windows;
    setTimeout(() => {
      console.log('Squeeesh');
      this.taskFinished(task);
    }, 300);
  };

  private waterPlants = (task: ITask) => {
    setTimeout(() => {
      console.log('Blub');
      this.taskFinished(task);
    }, 700);
  };

  private feedCat = (task: ITask) => {
    setTimeout(() => {
      console.log('Meow');
      this.taskFinished(task);
    }, 500);
  };

  private taskFinished = (finsihedTask: ITask) => {
    this.currentTasks = this.currentTasks.filter((task) => task.id != finsihedTask.id);
    if (this.tasks.length) {
      const nextTask = this.taskManager.getTask(this.currentTasks, this.blockedTasks);
      if (nextTask) {
        this.executeTask(nextTask);
      }
    }
    // if (!this.tasks.length && !this.currentTasks.length) {
    //   this.finish();
    // }
    if (this.taskManager.size() === 0 && !this.currentTasks.length) {
      this.finish();
    }
  };

  private getTask = (): ITask | null => {
    let task = null;
    if (this.tasks.length > 0) {
      if (this.currentTasks.length === 0) {
        task = this.tasks.shift() ?? null;
      } else {
        for (const [index, el] of this.tasks.entries()) {
          if (this.currentTasks.every((currentTask) => currentTask.robotName !== el.robotName)) {
            task = el;
            this.tasks.splice(index, 1);
            break;
          }
        }
      }
    }
    return task;
  };

  private executeTask = (task: ITask): void => {
    this.currentTasks.push(task);
    switch (task.name) {
      case 'clean_the_windows':
        this.cleanWindows(task);
        break;
      case 'feed_the_cat':
        this.feedCat(task);
        break;
      case 'water_the_plants':
        this.waterPlants(task);
        break;
      default:
        throw new Error(`Unexpected task: ${task.name}`);
        break;
    }
  };
}
