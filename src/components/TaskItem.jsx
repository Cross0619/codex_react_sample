import { formatDateForDisplay, formatTimeForDisplay } from '../utils/dateTime';

export function TaskItem({ task, onToggle, onDelete, onEdit }) {
  return (
    <li className={`task-item${task.completed ? ' task-item--completed' : ''}`}>
      <label className="task-item__label">
        {/* チェック状態に応じて完了フラグを切り替えるチェックボックス */}
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="task-item__checkbox"
        />
        <div className="task-item__content">
          {/* タスクの内容テキスト */}
          <span className="task-item__text">{task.text}</span>
          <span className="task-item__datetime">
            {/* 締め切り日時が設定されていれば整形して表示する */}
            {task.dueDate || task.dueTime
              ? `${formatDateForDisplay(task.dueDate)} ${formatTimeForDisplay(task.dueTime)}`.trim()
              : '日時未設定'}
          </span>
        </div>
      </label>
      <div className="task-item__actions">
        {/* タスクを編集するボタン */}
        <button type="button" className="task-item__edit" onClick={() => onEdit?.(task.id)}>
          編集
        </button>
        {/* タスクを削除するボタン */}
        <button type="button" className="task-item__delete" onClick={() => onDelete(task.id)}>
          削除
        </button>
      </div>
    </li>
  );
}
