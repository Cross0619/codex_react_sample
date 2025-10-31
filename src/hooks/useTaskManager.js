import { useCallback, useEffect, useMemo, useState } from 'react';
import { FILTERS, SORT_ORDERS, STORAGE_KEY, createTask, normalizeTask } from '../utils/task';

export function useTaskManager() {
  // localStorageに保存したタスク一覧を初期値として読み込む
  const [tasks, setTasks] = useState(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    try {
      // JSONをパースして配列であることを確認する
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      // 保存時との互換性を保つためタスクの形を正規化する
      return parsed.map(normalizeTask);
    } catch (error) {
      console.error('Failed to parse tasks from storage', error);
      return [];
    }
  });
  // フィルター種別・検索キーワード・並び順の状態を個別に保持する
  const [filterKey, setFilterKey] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  // 今日の日付と現在時刻を計算し、フォームの初期値として使う
  const defaultDate = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const defaultTime = useMemo(() => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  }, []);

  // タスクの状態が変わるたびにlocalStorageへ保存する
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // 現在の絞り込み条件に基づいて表示用のタスクリストを作成する
  const filteredTasks = useMemo(() => {
    const orderMultiplier = sortOrder === 'asc' ? 1 : -1;
    return tasks
      // 表示するタスクの条件（全て／未完了／完了）で絞り込む
      .filter(FILTERS[filterKey].predicate)
      // キーワードが含まれるタスクだけを残す
      .filter((task) => task.text.toLowerCase().includes(keyword.toLowerCase()))
      .slice()
      .sort((a, b) => {
        const aDue = a.dueAt ?? a.createdAt ?? 0;
        const bDue = b.dueAt ?? b.createdAt ?? 0;
        if (aDue !== bDue) {
          return (aDue - bDue) * orderMultiplier;
        }
        const aCreated = a.createdAt ?? 0;
        const bCreated = b.createdAt ?? 0;
        if (aCreated !== bCreated) {
          return (aCreated - bCreated) * orderMultiplier;
        }
        return a.text.localeCompare(b.text, 'ja');
      });
  }, [tasks, filterKey, keyword, sortOrder]);

  // 未完了タスクの数を計算してヘッダーに表示する
  const activeCount = useMemo(
    () => tasks.filter((task) => !task.completed).length,
    [tasks],
  );

  // 新しいタスクを先頭に追加する
  const addTask = useCallback(({ text, date, time }) => {
    setTasks((prev) => [createTask({ text, date, time }), ...prev]);
  }, []);

  // チェックボックス操作で完了状態を反転する
  const toggleTask = useCallback((id) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  }, []);

  // 指定IDのタスクを一覧から取り除く
  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  // 完了済みタスクのみを削除し未完了タスクを残す
  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((task) => !task.completed));
  }, []);

  return {
    FILTERS,
    SORT_ORDERS,
    tasks,
    filteredTasks,
    filterKey,
    keyword,
    sortOrder,
    activeCount,
    defaultDate,
    defaultTime,
    setFilterKey,
    setKeyword,
    setSortOrder,
    addTask,
    toggleTask,
    deleteTask,
    clearCompleted,
  };
}
