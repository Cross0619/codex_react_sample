import './App.css';
import { TaskForm } from './components/TaskForm';
import { TaskFilters } from './components/TaskFilters';
import { SortControls } from './components/SortControls';
import { TaskSummary } from './components/TaskSummary';
import { TaskList } from './components/TaskList';
import { useTaskManager } from './hooks/useTaskManager';

function App() {
  // useTaskManagerフックからタスク管理に必要な状態と操作関数をまとめて受け取る
  const {
    FILTERS,
    SORT_ORDERS,
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
  } = useTaskManager();

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">TODOリスト</h1>
        <p className="app__subtitle">毎日のタスクをシンプルに管理しましょう</p>
      </header>

      <section className="card">
        {/* タスク追加フォーム。新しいタスクを作成しuseTaskManagerに渡す */}
        <TaskForm defaultDate={defaultDate} defaultTime={defaultTime} onSubmit={addTask} />

        {/* 状態に応じてタスクの絞り込みと検索キーワードを変更する */}
        <TaskFilters
          filters={FILTERS}
          activeFilter={filterKey}
          onFilterChange={setFilterKey}
          keyword={keyword}
          onKeywordChange={setKeyword}
        />

        {/* タスク一覧の並び順を昇順・降順で切り替える */}
        <SortControls sortOrders={SORT_ORDERS} activeOrder={sortOrder} onChange={setSortOrder} />

        {/* 未完了タスク数の表示と完了済みタスクの一括削除 */}
        <TaskSummary activeCount={activeCount} onClearCompleted={clearCompleted} />

        {/* 条件に一致したタスクをリスト表示する */}
        <TaskList tasks={filteredTasks} onToggleTask={toggleTask} onDeleteTask={deleteTask} />
      </section>
    </div>
  );
}

export default App;
