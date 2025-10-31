import { useEffect, useMemo, useState } from 'react';
import './App.css';

const FILTERS = {
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

const STORAGE_KEY = 'react-todo-app-tasks';

const SORT_ORDERS = {
  asc: {
    label: '昇順',
  },
  desc: {
    label: '降順',
  },
};

function getDueTimestamp(date, time) {
  if (!date) return null;
  const safeTime = time && typeof time === 'string' && time.length > 0 ? time : '00:00';
  const timestamp = new Date(`${date}T${safeTime}`);
  const value = timestamp.getTime();
  return Number.isNaN(value) ? null : value;
}

function formatDateForDisplay(date) {
  if (!date) return '';
  const [year, month, day] = date.split('-');
  if (!year || !month || !day) {
    return date;
  }
  return `${year}/${month}/${day}`;
}

function formatTimeForDisplay(time) {
  if (!time) return '';
  return time.slice(0, 5);
}

function normalizeTask(task) {
  const dueDate = task.dueDate ?? '';
  const dueTime = task.dueTime ?? '';
  const computedDueAt = getDueTimestamp(dueDate, dueTime);
  return {
    ...task,
    dueDate,
    dueTime,
    dueAt: typeof task.dueAt === 'number' ? task.dueAt : computedDueAt ?? task.createdAt ?? Date.now(),
  };
}

function createTask({ text, date, time }) {
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

function App() {
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

  const activeCount = useMemo(() => tasks.filter((task) => !task.completed).length, [tasks]);

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const text = (formData.get('task') ?? '').trim();
    const date = formData.get('date');
    const time = formData.get('time');
    if (!text || !date || !time) return;

    setTasks((prev) => [createTask({ text, date, time }), ...prev]);
    event.target.reset();
  }

  function handleToggle(id) {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)),
    );
  }

  function handleDelete(id) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  function handleClearCompleted() {
    setTasks((prev) => prev.filter((task) => !task.completed));
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">TODOリスト</h1>
        <p className="app__subtitle">毎日のタスクをシンプルに管理しましょう</p>
      </header>

      <section className="card">
        <form className="task-form" onSubmit={handleSubmit}>
          <label className="task-form__label" htmlFor="task">
            新しいタスク
          </label>
          <div className="task-form__controls">
            <input
              id="task"
              name="task"
              type="text"
              placeholder="例: 牛乳を買う"
              className="task-form__input"
              autoComplete="off"
              required
            />
            <button type="submit" className="task-form__submit">
              追加
            </button>
          </div>
          <div className="task-form__datetime">
            <label className="task-form__field">
              <span className="task-form__field-label">日付</span>
              <input
                type="date"
                name="date"
                className="task-form__input task-form__input--date"
                defaultValue={defaultDate}
                required
              />
            </label>
            <label className="task-form__field">
              <span className="task-form__field-label">時刻</span>
              <input
                type="time"
                name="time"
                className="task-form__input task-form__input--time"
                defaultValue={defaultTime}
                required
              />
            </label>
          </div>
        </form>

        <div className="filters">
          <div className="filters__group">
            {Object.entries(FILTERS).map(([key, { label }]) => (
              <button
                key={key}
                type="button"
                className={`filters__button${filterKey === key ? ' filters__button--active' : ''}`}
                onClick={() => setFilterKey(key)}
              >
                {label}
              </button>
            ))}
          </div>
          <input
            type="search"
            placeholder="タスクを検索"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            className="filters__search"
            aria-label="タスクを検索"
          />
        </div>

        <div className="sort-controls" role="group" aria-label="時刻の並び替え">
          <span className="sort-controls__label">日時</span>
          <div className="sort-controls__buttons">
            {Object.entries(SORT_ORDERS).map(([key, { label }]) => (
              <button
                key={key}
                type="button"
                className={`sort-controls__button${sortOrder === key ? ' sort-controls__button--active' : ''}`}
                onClick={() => setSortOrder(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="task-summary">
          <span>未完了: {activeCount} 件</span>
          <button type="button" className="task-summary__clear" onClick={handleClearCompleted}>
            完了済みを削除
          </button>
        </div>

        <ul className="task-list" aria-live="polite">
          {filteredTasks.length === 0 ? (
            <li className="task-list__empty">タスクがありません。追加してみましょう！</li>
          ) : (
            filteredTasks.map((task) => (
              <li key={task.id} className={`task-item${task.completed ? ' task-item--completed' : ''}`}>
                <label className="task-item__label">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggle(task.id)}
                    className="task-item__checkbox"
                  />
                  <div className="task-item__content">
                    <span className="task-item__text">{task.text}</span>
                    <span className="task-item__datetime">
                      {task.dueDate || task.dueTime
                        ? `${formatDateForDisplay(task.dueDate)} ${formatTimeForDisplay(task.dueTime)}`.trim()
                        : '日時未設定'}
                    </span>
                  </div>
                </label>
                <button type="button" className="task-item__delete" onClick={() => handleDelete(task.id)}>
                  削除
                </button>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}

export default App;
