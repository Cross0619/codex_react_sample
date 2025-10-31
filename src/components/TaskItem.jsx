import { formatDateForDisplay, formatTimeForDisplay } from '../utils/dateTime';

export function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className={`task-item${task.completed ? ' task-item--completed' : ''}`}>
      <label className="task-item__label">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
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
      <button type="button" className="task-item__delete" onClick={() => onDelete(task.id)}>
        削除
      </button>
    </li>
  );
}
