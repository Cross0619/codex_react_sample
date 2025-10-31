import { getDueTimestamp } from './dateTime';

// localStorageに保存する際に用いるキー名
export const STORAGE_KEY = 'react-todo-app-tasks';

export const FILTERS = {
  // 全タスクを表示するフィルター
  all: {
    label: 'すべて',
    predicate: () => true,
  },
  // 未完了タスクのみを対象とするフィルター
  active: {
    label: '未完了',
    predicate: (task) => !task.completed,
  },
  // 完了済みタスクのみを対象とするフィルター
  completed: {
    label: '完了済み',
    predicate: (task) => task.completed,
  },
};

export const SORT_ORDERS = {
  // 期限が早い順に並べる設定
  asc: {
    label: '昇順',
  },
  // 期限が遅い順に並べる設定
  desc: {
    label: '降順',
  },
};

export function normalizeTask(task) {
  // 保存されている値が欠けていても扱えるよう、デフォルト値を補う
  const dueDate = task.dueDate ?? '';
  const dueTime = task.dueTime ?? '';
  const computedDueAt = getDueTimestamp(dueDate, dueTime);
  return {
    ...task,
    dueDate,
    dueTime,
    // dueAtがない場合でも比較できるように締め切り時刻を計算する
    dueAt:
      typeof task.dueAt === 'number' ? task.dueAt : computedDueAt ?? task.createdAt ?? Date.now(),
  };
}

export function createTask({ text, date, time }) {
  // 入力された日付と時刻をUnixタイムスタンプに変換する
  const dueAt = getDueTimestamp(date, time);
  return {
    // crypto.randomUUIDで衝突しにくいIDを採用
    id: crypto.randomUUID(),
    text,
    completed: false,
    createdAt: Date.now(),
    dueDate: date,
    dueTime: time,
    dueAt: dueAt ?? Date.now(),
  };
}
