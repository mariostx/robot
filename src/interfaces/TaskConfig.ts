import { TaskName } from './Task';

export type ITaskConfig = {
  [taskName in TaskName]: {
    rateLimit: number;
    executionTime: number;
  };
};
