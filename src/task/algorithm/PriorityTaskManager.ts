import { tasks } from './../../data/Tasks';
import { TaskName, ITaskPriority, ITaskManager, TaskNameEnum } from './../../interfaces/Task';
import { ITask } from '../../interfaces/Task';
import { ITaskConfig } from '../../interfaces/TaskConfig';

export class PriorityTaskManager implements ITaskManager {

  private tasks: Map<string, ITask[]> = new Map();
  private taskConfig: ITaskConfig;
  private taskPriority: ITaskPriority;

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
    this.taskPriority = this.calculateTasksPriority();
  }

  private calculateTasksPriority(): ITaskPriority {
    let tasksPriority: any = {};
    let taskName: TaskName;
    for (taskName in TaskNameEnum) {
      tasksPriority[taskName] = this.calculateIdleTime(taskName);
    }
    return tasksPriority as ITaskPriority;
  }

  private calculateIdleTime(taskName: TaskName): number {
    const taskConfig = this.taskConfig[taskName];
    return taskConfig.rateLimit - taskConfig.executionTime;
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
                    if (robotTasks.length > (this.tasks.get(task.robotName)?.length ?? 0)) {
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

  size(): number {
    let size = 0;
    this.tasks.forEach((robotTasks) => size += robotTasks.length);
    return size;
  }
}
