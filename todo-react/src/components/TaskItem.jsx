const fmt = (d) =>
  d
    ? new Date(d).toLocaleDateString("ru-RU", { day: "numeric", month: "short" })
    : "";

export function TaskItem({ task, onDelete, onEdit, onToggle }) {
  const p = task.priority || 1;
  return (
    <li className={`task p${p} ${task.completed ? "done" : ""}`}>
      <label className="check">
        <input
          type="checkbox"
          checked={!!task.completed}
          onChange={() => onToggle(task.id)}
          aria-label={`Выполнено: ${task.title}`}
        />
        <span className="box" aria-hidden="true">
          <svg viewBox="0 0 16 16" width="14" height="14">
            <path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </label>

      <div className="task-body">
        <h3>{task.title}</h3>
        {task.description && <p>{task.description}</p>}
        <div className="meta">
          <span className="meter" title={`Приоритет ${p} из 5`}>
            {[1, 2, 3, 4, 5].map((i) => (
              <i key={i} className={i <= p ? "lit" : ""} />
            ))}
          </span>
          {task.createdAt && <span>{fmt(task.createdAt)}</span>}
        </div>
      </div>

      <div className="task-actions">
        <button className="icon-btn" onClick={() => onEdit(task)} aria-label="Изменить" title="Изменить">
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 17l3.5-.8L16 6.7a1.8 1.8 0 000-2.5l-.2-.2a1.8 1.8 0 00-2.5 0L3.8 13.5 3 17z" />
          </svg>
        </button>
        <button className="icon-btn danger" onClick={() => onDelete(task.id)} aria-label="Удалить" title="Удалить">
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6h12M8 6V4h4v2M6 6l.7 10h6.6L14 6" />
          </svg>
        </button>
      </div>
    </li>
  );
}
