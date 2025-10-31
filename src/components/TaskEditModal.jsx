import { useEffect, useRef, useState } from 'react';

export function TaskEditModal({ task, onClose, onSubmit }) {
  const [text, setText] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const textFieldRef = useRef(null);

  useEffect(() => {
    if (task) {
      setText(task.text);
      setDate(task.dueDate);
      setTime(task.dueTime);
    }
  }, [task]);

  useEffect(() => {
    if (!task) return;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [task, onClose]);

  useEffect(() => {
    if (task) {
      textFieldRef.current?.focus();
    }
  }, [task]);

  if (!task) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedText = text.trim();
    if (!trimmedText || !date || !time) {
      return;
    }

    onSubmit({ text: trimmedText, date, time });
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`edit-task-${task.id}-title`}
      onClick={handleBackdropClick}
    >
      <div className="modal__dialog">
        <h2 className="modal__title" id={`edit-task-${task.id}-title`}>
          タスクを編集
        </h2>
        <form className="modal__form" onSubmit={handleSubmit}>
          <label className="modal__field">
            <span className="modal__label">タスク名</span>
            <input
              ref={textFieldRef}
              type="text"
              className="modal__input"
              value={text}
              onChange={(event) => setText(event.target.value)}
              required
            />
          </label>
          <div className="modal__row">
            <label className="modal__field">
              <span className="modal__label">日付</span>
              <input
                type="date"
                className="modal__input"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
              />
            </label>
            <label className="modal__field">
              <span className="modal__label">時刻</span>
              <input
                type="time"
                className="modal__input"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                required
              />
            </label>
          </div>
          <div className="modal__actions">
            <button type="button" className="modal__cancel" onClick={onClose}>
              キャンセル
            </button>
            <button type="submit" className="modal__submit">
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
