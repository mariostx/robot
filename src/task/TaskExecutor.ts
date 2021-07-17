import { ITaskManager } from '../interfaces/Task';
import { ITaskConfig as ITaskConfig } from '../interfaces/TaskConfig';
import { ITask } from '../interfaces/Task';
import { StopWatch } from '../util/time/StopWatch';

export class TaskExecutor {
  private readonly MAX_TASKS_NUMBER = 3;
  private ongoingTasks: ITask[] = [];
  private stopWatch = new StopWatch();
  private taskManager: ITaskManager;
  private taskConfig: ITaskConfig;
  private blockedTasks: string[] = [];

  constructor(taskManager: ITaskManager, taskConfig: ITaskConfig) {
    this.taskManager = taskManager;
    this.taskConfig = taskConfig;
  }

  executeTasks = (): void => {
    this.stopWatch.start();
    this.getAndExecuteTasks();
  };

  private getAndExecuteTasks = (): void => {
    let task = null;
    do {
      task = this.taskManager.getTask(this.ongoingTasks, this.blockedTasks);
      if (task) {
        this.executeTask(task);
      }
    } while (this.ongoingTasks.length <= this.MAX_TASKS_NUMBER && task !== null);
  };

  private executeTask = (task: ITask): void => {
    this.ongoingTasks.push(task);
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

  private cleanWindows = (task: ITask) => {
    this.execute(task, this.taskConfig.clean_the_windows.executionTime, this.taskConfig.clean_the_windows.rateLimit);
  };

  private feedCat = (task: ITask) => {
    this.execute(task, this.taskConfig.feed_the_cat.executionTime, this.taskConfig.feed_the_cat.rateLimit);
  };

  private waterPlants = (task: ITask) => {
    this.execute(task, this.taskConfig.water_the_plants.executionTime, this.taskConfig.water_the_plants.rateLimit);
  };

  private execute = (task: ITask, executionTime: number, taskRate: number) => {
    this.blockTask(task.name, taskRate);
    const sound = this.getSound(task);
    console.info('%ss\t|%s\t|B| %s', this.stopWatch.elapsedSecondsFixed(3), task.robotName, sound);
    setTimeout(() => {
      console.info('%ss\t|%s\t|E| %s', this.stopWatch.elapsedSecondsFixed(3), task.robotName, sound);
      this.finishTask(task);
    }, executionTime*1000);
  }

  private getSound(task: ITask): string {
    let sound = '';
    switch (task.name) {
      case 'clean_the_windows':
        sound = 'Squeeesh';
        break;
      case 'feed_the_cat':
        sound = 'Meow';
        break;
      case 'water_the_plants':
        sound = 'Blub'
        break;
    }
    return sound;
  }

  private blockTask = (taskName: string, taskRate: number): void => {
    this.blockedTasks.push(taskName);
    setTimeout(() => {
      const index = this.blockedTasks.indexOf(taskName);
      if (index > -1) {
        this.blockedTasks.splice(index, 1);
      }
      this.getAndExecuteTasks();
    }, taskRate*1000);
  }

  private finishTask = (finsihedTask: ITask) => {
    this.ongoingTasks = this.ongoingTasks.filter((task) => task.id != finsihedTask.id);
    let nextTask = null;
    this.getAndExecuteTasks();
    if (this.taskManager.size() === 0 && !this.ongoingTasks.length) {
      this.finish();
    }
  };

  private finish = () => {
    this.stopWatch.end();
    console.log('All tasks finished! Execution time(s): %f', this.stopWatch.elapsedSecondsFixed(3));
  };
}
