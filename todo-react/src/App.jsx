import { useState, useEffect } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import "./styles/App.css";

function App() {
  const [tasks, setTasks] = useLocalStorage("todo-tasks", [
    {
      id: 1,
      title: "Изучить React",
      description: "Прочитать документацию",
      priority: 2,
      completed: false,
      createdAt: Date.now(),
    },
    {
      id: 2,
      title: "Сделать лабу №4",
      description: "React + localStorage",
      priority: 3,
      completed: false,
      createdAt: Date.now(),
    },
  ]);

  const [filter, setFilter] = useState("all");

  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const activeCount = tasks.filter((t) => !t.completed).length;
    document.title = `Задачи (${activeCount} активных) — TODO App`;
  }, [tasks]);

  useEffect(() => {
    console.log(" Загрузка данных с сервера (имитация)...");
    const timer = setTimeout(() => {
      console.log(" Данные загружены");
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleAdd = (newTask) => {
    const task = {
      ...newTask,
      id: Date.now(),
      completed: false,
      createdAt: Date.now(),
    };
    setTasks([...tasks, task]);
  };

  const handleDelete = (id) => {
    if (window.confirm("Удалить задачу?")) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  const handleToggle = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const handleUpdate = (updatedTask) => {
    setTasks(
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
    );
    setEditingTask(null);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const active = total - completed;

  return (
    <div className="app">
      <header>
        <h1>📝 TODO App</h1>
        <p className="stats">
          Всего: {total} | Активных: {active} | Выполнено: {completed}
        </p>
      </header>

      <main>
        <TaskForm
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          editingTask={editingTask}
          onCancelEdit={handleCancelEdit}
        />

        <TaskList
          tasks={tasks}
          filter={filter}
          setFilter={setFilter}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onToggle={handleToggle}
        />
      </main>
    </div>
  );
}

export default App;
