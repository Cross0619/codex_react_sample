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

function createTask(text) {
  return {
    id: crypto.randomUUID(),
    text,
    completed: false,
    createdAt: Date.now(),
  };
}

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Failed to parse tasks from storage', error);
      return [];
    }
  });
  const [filterKey, setFilterKey] = useState('all');
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(FILTERS[filterKey].predicate)
      .filter((task) => task.text.toLowerCase().includes(keyword.toLowerCase()))
      .sort((a, b) => a.completed - b.completed || b.createdAt - a.createdAt);
  }, [tasks, filterKey, keyword]);

  const activeCount = useMemo(() => tasks.filter((task) => !task.completed).length, [tasks]);

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const text = (formData.get('task') ?? '').trim();
    if (!text) return;

    setTasks((prev) => [createTask(text), ...prev]);
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
            />
            <button type="submit" className="task-form__submit">
              追加
            </button>
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
                  <span className="task-item__text">{task.text}</span>
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
