export type TaskName = 'clean_the_windows' | 'water_the_plants' | 'feed_the_cat';

export interface ITask {
  id: number;
  name: TaskName;
  robotName: string;
}
