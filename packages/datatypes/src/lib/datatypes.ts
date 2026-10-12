export type User = {
  id: number;
  name: string;
  email: string;
};

export interface TaskEvent {
  data: TaskData;
}

export interface TaskData {
  progress: number;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  message?: string;
}
