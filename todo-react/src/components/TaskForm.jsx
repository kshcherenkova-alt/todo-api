import { useState, useEffect } from "react";

const LEVELS = [
  { v: 1, label: "Низкий" },
  { v: 2, label: "Обычный" },
  { v: 3, label: "Средний" },
  { v: 4, label: "Высокий" },
  { v: 5, label: "Срочно" },
];

export function TaskForm({ onAdd, onUpdate, editingTask, onCancelEdit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || "");
      setPriority(editingTask.priority || 1);
    } else {
      setTitle("");
      setDescription("");
      setPriority(1);
    }
    setError(null);
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Введите название задачи");
      return;
    }
    const data = {
      title: title.trim(),
      description: description.trim(),
      priority: Number(priority),
    };
    if (editingTask) onUpdate({ ...editingTask, ...data });
    else onAdd(data);
    setTitle("");
    setDescription("");
    setPriority(1);
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="panel task-form">
      <h2>{editingTask ? "Редактирование" : "Новая задача"}</h2>

      <label className="field">
        <span>Название</span>
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError(null);
          }}
          placeholder="Например: сдать лабораторную"
          maxLength={100}
          aria-invalid={!!error}
        />
        {error && <small className="field-error">{error}</small>}
      </label>

      <label className="field">
        <span>Описание</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Детали, если нужны"
          maxLength={500}
          rows={3}
        />
      </label>

      <fieldset className="field">
        <legend>Приоритет</legend>
        <div className="levels">
          {LEVELS.map((l) => (
            <button
              key={l.v}
              type="button"
              className={`level p${l.v} ${priority === l.v ? "on" : ""}`}
              onClick={() => setPriority(l.v)}
              aria-pressed={priority === l.v}
              title={l.label}
            >
              {l.v}
            </button>
          ))}
        </div>
        <small>{LEVELS[priority - 1]?.label}</small>
      </fieldset>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {editingTask ? "Сохранить" : "Добавить задачу"}
        </button>
        {editingTask && (
          <button type="button" onClick={onCancelEdit} className="btn btn-ghost">
            Отмена
          </button>
        )}
      </div>
    </form>
  );
}
