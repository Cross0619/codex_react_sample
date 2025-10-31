import { useCallback, useEffect, useMemo, useState } from 'react';
import { FILTERS, SORT_ORDERS, STORAGE_KEY, createTask, normalizeTask } from '../utils/task';

export function useTaskManager() {
  const [tasks, setTasks] = useState(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      return parsed.map(normalizeTask);
    } catch (error) {
      console.error('Failed to parse tasks from storage', error);
      return [];
    }
  });
  const [filterKey, setFilterKey] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const defaultDate = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const defaultTime = useMemo(() => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const orderMultiplier = sortOrder === 'asc' ? 1 : -1;
    return tasks
      .filter(FILTERS[filterKey].predicate)
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

  const activeCount = useMemo(
    () => tasks.filter((task) => !task.completed).length,
    [tasks],
  );

  const addTask = useCallback(({ text, date, time }) => {
    setTasks((prev) => [createTask({ text, date, time }), ...prev]);
  }, []);

  const toggleTask = useCallback((id) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

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
