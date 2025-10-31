export function TaskSummary({ activeCount, onClearCompleted }) {
  return (
    <div className="task-summary">
      <span>未完了: {activeCount} 件</span>
      <button type="button" className="task-summary__clear" onClick={onClearCompleted}>
        完了済みを削除
      </button>
    </div>
  );
}
