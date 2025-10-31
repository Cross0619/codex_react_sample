import './App.css';
import { TaskForm } from './components/TaskForm';
import { TaskFilters } from './components/TaskFilters';
import { SortControls } from './components/SortControls';
import { TaskSummary } from './components/TaskSummary';
import { TaskList } from './components/TaskList';
import { useTaskManager } from './hooks/useTaskManager';

function App() {
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
        <TaskForm defaultDate={defaultDate} defaultTime={defaultTime} onSubmit={addTask} />

        <TaskFilters
          filters={FILTERS}
          activeFilter={filterKey}
          onFilterChange={setFilterKey}
          keyword={keyword}
          onKeywordChange={setKeyword}
        />

        <SortControls sortOrders={SORT_ORDERS} activeOrder={sortOrder} onChange={setSortOrder} />

        <TaskSummary activeCount={activeCount} onClearCompleted={clearCompleted} />

        <TaskList tasks={filteredTasks} onToggleTask={toggleTask} onDeleteTask={deleteTask} />
      </section>
    </div>
  );
}

export default App;
