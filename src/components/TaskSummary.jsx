export function TaskSummary({ activeCount, onClearCompleted }) {
  return (
    <div className="task-summary">
      {/* 残っている未完了タスク数を表示する */}
      <span>未完了: {activeCount} 件</span>
      {/* 完了済みタスクを全て削除するボタン */}
      <button type="button" className="task-summary__clear" onClick={onClearCompleted}>
        完了済みを削除
      </button>
    </div>
  );
}
