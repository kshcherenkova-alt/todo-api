import { useState, useEffect, useCallback } from "react";
import { fetchTasks, addTask, updateTask, deleteTask } from "./api";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { Login } from "./components/Login";
import "./styles/App.css";

function App() {
  const [authed, setAuthed] = useState(!!localStorage.getItem("token"));
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // ошибка загрузки (экран с «Повторить»)
  const [notice, setNotice] = useState(null); // уведомление об ошибке операции
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");

  // Выход при истёкшем токене
  useEffect(() => {
    const onExpired = () => setAuthed(false);
    window.addEventListener("auth-expired", onExpired);
    return () => window.removeEventListener("auth-expired", onExpired);
  }, []);

  // Debounce ввода поиска (500 мс)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 500);
    return () => clearTimeout(t);
  }, [search]);

  const [reloadKey, setReloadKey] = useState(0);

  // Загрузка с сервера (поиск выполняется на сервере) + отмена запроса
  useEffect(() => {
    if (!authed) return;
    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchTasks(debounced, controller.signal);
        setTasks(res.data);
      } catch (err) {
        if (err.name === "CanceledError" || err.code === "ERR_CANCELED") return;
        if (err.response?.status === 401) return;
        setError("Не удалось загрузить задачи. Проверьте соединение с сервером.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [authed, debounced, reloadKey]);

  const loadTasks = useCallback(() => setReloadKey((k) => k + 1), []);

  const fail = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleAdd = async (data) => {
    const temp = { ...data, id: Date.now(), completed: false };
    setTasks((prev) => [...prev, temp]);
    try {
      const res = await addTask(data);
      setTasks((prev) => prev.map((t) => (t.id === temp.id ? res.data : t)));
    } catch {
      setTasks((prev) => prev.filter((t) => t.id !== temp.id));
      fail("Не удалось добавить задачу");
    }
  };

  const isTemp = (id) => id > 1e12;

  const handleDelete = async (id) => {
    if (isTemp(id)) return fail("Задача ещё сохраняется, подождите секунду");
    if (!window.confirm("Удалить задачу?")) return;
    const deleted = tasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await deleteTask(id);
    } catch {
      setTasks((prev) => [...prev, deleted]);
      fail("Не удалось удалить задачу");
    }
  };

  const handleUpdate = async (updatedTask) => {
    const old = tasks.find((t) => t.id === updatedTask.id);
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    setEditingTask(null);
    try {
      await updateTask(updatedTask.id, updatedTask);
    } catch {
      setTasks((prev) => prev.map((t) => (t.id === old.id ? old : t)));
      fail("Не удалось обновить задачу");
    }
  };

  const handleToggle = async (id) => {
    if (isTemp(id)) return fail("Задача ещё сохраняется, подождите секунду");
    const task = tasks.find((t) => t.id === id);
    const updated = { ...task, completed: !task.completed };
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    try {
      await updateTask(id, updated);
    } catch {
      setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
      fail("Не удалось обновить статус");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthed(false);
    setTasks([]);
  };

  if (!authed) {
    return <Login onSuccess={() => setAuthed(true)} />;
  }

  const done = tasks.filter((t) => t.completed).length;
  const total = tasks.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const R = 26;
  const C = 2 * Math.PI * R;

  return (
    <div className="shell">
      <header className="top">
        <div>
          <h1 className="brand">Задачи</h1>
          <p className="sub">
            {total === 0
              ? "Список пуст"
              : `Выполнено ${done} из ${total}`}
          </p>
        </div>

        <div className="top-right">
          <div className="ring" title={`${pct}% выполнено`}>
            <svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true">
              <circle cx="32" cy="32" r={R} className="ring-bg" />
              <circle
                cx="32"
                cy="32"
                r={R}
                className="ring-fg"
                strokeDasharray={C}
                strokeDashoffset={C * (1 - pct / 100)}
                transform="rotate(-90 32 32)"
              />
            </svg>
            <span>{pct}%</span>
          </div>
          <button className="btn btn-ghost" onClick={logout}>
            Выйти
          </button>
        </div>
      </header>

      <div className="layout">
        <aside className="side">
          <TaskForm
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            editingTask={editingTask}
            onCancelEdit={() => setEditingTask(null)}
          />
        </aside>

        <main className="main">
          <div className="search">
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <circle cx="9" cy="9" r="5.5" />
              <path d="M13.5 13.5L17 17" />
            </svg>
            <input
              type="search"
              placeholder="Поиск по названию"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Поиск задач"
            />
          </div>

          {loading ? (
            <div className="state" role="status">
              <div className="spinner" />
              <p>Загрузка данных…</p>
            </div>
          ) : error ? (
            <div className="state state-error" role="alert">
              <p>{error}</p>
              <button className="btn btn-primary" onClick={loadTasks}>
                Повторить
              </button>
            </div>
          ) : (
            <TaskList
              tasks={tasks}
              filter={filter}
              setFilter={setFilter}
              onDelete={handleDelete}
              onEdit={setEditingTask}
              onToggle={handleToggle}
              isSearch={!!debounced}
            />
          )}
        </main>
      </div>

      {notice && (
        <div className="toast" role="alert">
          {notice}
        </div>
      )}
    </div>
  );
}

export default App;
