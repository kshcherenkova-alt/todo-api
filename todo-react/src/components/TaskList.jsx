import { TaskItem } from "./TaskItem";

export function TaskList({
  tasks,
  filter,
  setFilter,
  onDelete,
  onEdit,
  onToggle,
}) {
  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort(
    (a, b) => b.priority - a.priority,
  );

  return (
    <div className="task-list">
      <div className="filters">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          Все ({tasks.length})
        </button>
        <button
          className={filter === "active" ? "active" : ""}
          onClick={() => setFilter("active")}
        >
          Активные ({tasks.filter((t) => !t.completed).length})
        </button>
        <button
          className={filter === "completed" ? "active" : ""}
          onClick={() => setFilter("completed")}
        >
          Выполненные ({tasks.filter((t) => t.completed).length})
        </button>
      </div>

      {sortedTasks.length === 0 ? (
        <p className="empty">Задач нет</p>
      ) : (
        sortedTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onDelete={onDelete}
            onEdit={onEdit}
            onToggle={onToggle}
          />
        ))
      )}
    </div>
  );
}
