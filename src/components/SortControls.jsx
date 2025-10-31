export function SortControls({ sortOrders, activeOrder, onChange }) {
  return (
    <div className="sort-controls" role="group" aria-label="時刻の並び替え">
      <span className="sort-controls__label">日時</span>
      <div className="sort-controls__buttons">
        {/* 並び順の候補を回しながら、選択中のボタンには強調クラスを付与する */}
        {Object.entries(sortOrders).map(([key, { label }]) => (
          <button
            key={key}
            type="button"
            className={`sort-controls__button${activeOrder === key ? ' sort-controls__button--active' : ''}`}
            onClick={() => onChange(key)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
