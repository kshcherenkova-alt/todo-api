import { useState, useEffect } from "react";

export function TaskForm({ onAdd, onUpdate, editingTask, onCancelEdit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(1);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setPriority(editingTask.priority);
    } else {
      setTitle("");
      setDescription("");
      setPriority(1);
    }
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Заголовок задачи обязателен");
      return;
    }

    if (editingTask) {
      onUpdate({
        ...editingTask,
        title: title.trim(),
        description: description.trim(),
        priority: Number(priority),
      });
    } else {
      onAdd({
        title: title.trim(),
        description: description.trim(),
        priority: Number(priority),
      });
    }

    ъ;
    setTitle("");
    setDescription("");
    setPriority(1);
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h3>{editingTask ? "✏️ Редактировать задачу" : "➕ Добавить задачу"}</h3>

      <div className="form-group">
        <label>Заголовок *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Например: Изучить React"
          maxLength={100}
        />
      </div>

      <div className="form-group">
        <label>Описание</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Подробное описание задачи"
          maxLength={500}
        />
      </div>

      <div className="form-group">
        <label>Приоритет (1-5)</label>
        <input
          type="number"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          min="1"
          max="5"
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {editingTask ? "Сохранить" : "Добавить"}
        </button>

        {editingTask && (
          <button type="button" onClick={onCancelEdit} className="btn-cancel">
            Отмена
          </button>
        )}
      </div>
    </form>
  );
}
