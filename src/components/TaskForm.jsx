export function TaskForm({ defaultDate, defaultTime, onSubmit }) {
  function handleSubmit(event) {
    event.preventDefault();
    // フォームから値を取り出し、余計な空白を除去する
    const formData = new FormData(event.target);
    const text = (formData.get('task') ?? '').trim();
    const date = formData.get('date');
    const time = formData.get('time');
    // 入力が揃っていない場合は何もしない
    if (!text || !date || !time) return;

    // 親コンポーネントに入力内容を渡してタスクを追加してもらう
    onSubmit({ text, date, time });
    event.target.reset();
  }

  return (
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
  );
}
