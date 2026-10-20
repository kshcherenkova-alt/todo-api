export function TaskItem({ task, onDelete, onEdit, onToggle }) {
  return (
    <div className={`task-item ${task.completed ? "completed" : ""}`}>
      <div className="task-content">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
        />

        <div className="task-text">
          <h4>{task.title}</h4>
          {task.description && <p>{task.description}</p>}
          <div className="task-meta">
            <span className={`priority priority-${task.priority}`}>
              Приоритет: {task.priority}
            </span>
            <span className="date">
              Создано: {new Date(task.createdAt).toLocaleString("ru-RU")}
            </span>
          </div>
        </div>
      </div>

      <div className="task-actions">
        <button
          onClick={() => onEdit(task)}
          className="btn-edit"
          title="Редактировать"
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="btn-delete"
          title="Удалить"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
