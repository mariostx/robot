import { tasks } from './../../data/Tasks';
import { TaskName, TaskNameEnum, TaskPriority } from './../../interfaces/Task';
import { ITask } from '../../interfaces/Task';
import { ITaskConfig } from '../../interfaces/TaskConfig';

export class PriorityTaskManager {
  private tasks: Map<string, ITask[]> = new Map();
  private taskConfig: ITaskConfig;
  private taskPriority: TaskPriority;

  constructor(robotTasks: ITask[], taskConfig: ITaskConfig) {
    this.taskConfig = taskConfig;
    robotTasks.forEach((task, index) => {
      const robotName = task.robotName;
      if (this.tasks.has(robotName)) {
        this.tasks.get(robotName)?.push(task);
      } else {
        this.tasks.set(robotName, [task]);
      }
    });
    this.taskPriority = {
      clean_the_windows: taskConfig.clean_the_windows.rateLimit,
      water_the_plants: taskConfig.water_the_plants.rateLimit,
      feed_the_cat: taskConfig.feed_the_cat.rateLimit,
    };
  }

  getTask(ongoingTasks: ITask[], blockedTasks: string[]): ITask | null {
    let task: ITask | null = null;
    const busyRobots: string[] = ongoingTasks.map((task) => task.robotName);
    const unaviableTasks: string[] = ongoingTasks.map((task) => task.name.toString()).concat(blockedTasks);
    for (const [robotName, robotTasks] of this.tasks.entries()) {
      if (!busyRobots.includes(robotName)) {
        let robotTask = robotTasks[0];
        if (!unaviableTasks.includes(robotTask.name)) {
            if (!task) {
                task = robotTask;
            } else {
                const robotTaskPriority = this.taskPriority[robotTask.name];
                const taskPriority = this.taskPriority[task.name];
                if (robotTaskPriority > taskPriority) {
                    task = robotTask;
                } else if (robotTaskPriority === taskPriority) {
                    if (robotTasks.length > (this.tasks.get(task.name)?.length ?? 0)) {
                        task = robotTask;
                    }
                }
            }
        }
      }
    }
    if (task) {
        const robotTasks = this.tasks.get(task.robotName);
        robotTasks?.shift();
        if (robotTasks?.length === 0) {
            this.tasks.delete(task.robotName);
        }
    }
    return task;
  }

  size() {
    let size = 0;
    Object.values(this.tasks).forEach((robotTasks) => size += robotTasks.length);
    return size;
  }

//   private getPriority(taskName: TaskName) {
//     switch (taskName) {
//       case 'clean_the_windows':
//         return this.taskPriority.clean_the_windows;
//         break;
//       case 'water_the_plants':
//         return this.taskPriority.water_the_plants;
//         break;
//       case 'feed_the_cat':
//         return this.taskPriority.feed_the_cat;
//         break;
//     }
//   }
}