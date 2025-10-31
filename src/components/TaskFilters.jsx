export function TaskFilters({ filters, activeFilter, onFilterChange, keyword, onKeywordChange }) {
  return (
    <div className="filters">
      <div className="filters__group">
        {Object.entries(filters).map(([key, { label }]) => (
          <button
            key={key}
            type="button"
            className={`filters__button${activeFilter === key ? ' filters__button--active' : ''}`}
            onClick={() => onFilterChange(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <input
        type="search"
        placeholder="タスクを検索"
        value={keyword}
        onChange={(event) => onKeywordChange(event.target.value)}
        className="filters__search"
        aria-label="タスクを検索"
      />
    </div>
  );
}
