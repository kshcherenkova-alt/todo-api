import { TaskItem } from "./TaskItem";

const FILTERS = [
  ["all", "Все"],
  ["active", "В работе"],
  ["completed", "Готово"],
];

export function TaskList({
  tasks,
  filter,
  setFilter,
  onDelete,
  onEdit,
  onToggle,
  isSearch,
}) {
  const count = {
    all: tasks.length,
    active: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  };

  const visible = tasks
    .filter((t) =>
      filter === "active" ? !t.completed : filter === "completed" ? t.completed : true,
    )
    .sort((a, b) => Number(a.completed) - Number(b.completed) || (b.priority || 1) - (a.priority || 1));

  return (
    <section className="list-wrap">
      <div className="tabs" role="tablist">
        {FILTERS.map(([key, label]) => (
          <button
            key={key}
            role="tab"
            aria-selected={filter === key}
            className={filter === key ? "on" : ""}
            onClick={() => setFilter(key)}
          >
            {label} <b>{count[key]}</b>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="empty">
          <strong>
            {isSearch ? "Ничего не найдено" : filter === "completed" ? "Пока ничего не выполнено" : "Задач пока нет"}
          </strong>
          <span>
            {isSearch
              ? "Попробуйте изменить запрос."
              : filter === "completed"
                ? "Отметьте задачу галочкой, и она появится здесь."
                : "Добавьте первую задачу в форме."}
          </span>
        </div>
      ) : (
        <ul className="tasks">
          {visible.map((task) => (
            <TaskItem key={task.id} task={task} onDelete={onDelete} onEdit={onEdit} onToggle={onToggle} />
          ))}
        </ul>
      )}
    </section>
  );
}
