import { TaskItem } from './TaskItem';

export function TaskList({ tasks, onToggleTask, onDeleteTask }) {
  return (
    <ul className="task-list" aria-live="polite">
      {tasks.length === 0 ? (
        /* タスクが無い場合の案内メッセージ */
        <li className="task-list__empty">タスクがありません。追加してみましょう！</li>
      ) : (
        /* タスクごとにTaskItemコンポーネントを生成する */
        tasks.map((task) => (
          <TaskItem key={task.id} task={task} onToggle={onToggleTask} onDelete={onDeleteTask} />
        ))
      )}
    </ul>
  );
}
