import { getDueTimestamp } from './dateTime';

export const STORAGE_KEY = 'react-todo-app-tasks';

export const FILTERS = {
  all: {
    label: 'すべて',
    predicate: () => true,
  },
  active: {
    label: '未完了',
    predicate: (task) => !task.completed,
  },
  completed: {
    label: '完了済み',
    predicate: (task) => task.completed,
  },
};

export const SORT_ORDERS = {
  asc: {
    label: '昇順',
  },
  desc: {
    label: '降順',
  },
};

export function normalizeTask(task) {
  const dueDate = task.dueDate ?? '';
  const dueTime = task.dueTime ?? '';
  const computedDueAt = getDueTimestamp(dueDate, dueTime);
  return {
    ...task,
    dueDate,
    dueTime,
    dueAt:
      typeof task.dueAt === 'number' ? task.dueAt : computedDueAt ?? task.createdAt ?? Date.now(),
  };
}

export function createTask({ text, date, time }) {
  const dueAt = getDueTimestamp(date, time);
  return {
    id: crypto.randomUUID(),
    text,
    completed: false,
    createdAt: Date.now(),
    dueDate: date,
    dueTime: time,
    dueAt: dueAt ?? Date.now(),
  };
}
