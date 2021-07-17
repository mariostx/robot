export type TaskName = 'clean_the_windows' | 'water_the_plants' | 'feed_the_cat';
export enum TaskNameEnum {
  'clean_the_windows' = 'clean_the_windows',
  'water_the_plants' = 'water_the_plants',
  'feed_the_cat' = 'feed_the_cat',
}

export type ITaskPriority = {
  [taskName in TaskName]: number;
};

export interface ITask {
  id: number;
  name: TaskName;
  robotName: string;
}

export interface ITaskManager {
  getTask(ongoingTasks: ITask[], blockedTasks: string[]): ITask | null;
  size(): number;
}
