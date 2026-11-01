import { useState } from "react";
import { login, register } from "../api";

export function Login({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (isRegister) await register(email, password);
      const res = await login(email, password);
      localStorage.setItem("token", res.data.token);
      onSuccess();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          (err.request
            ? "Сервер не отвечает. Проверьте, что он запущен на порту 3000."
            : "Не удалось выполнить вход"),
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth">
      <form onSubmit={handleSubmit} className="auth-card">
        <h1 className="brand">Задачи</h1>
        <p className="auth-lead">
          {isRegister
            ? "Создайте аккаунт, чтобы хранить задачи на сервере."
            : "Войдите, чтобы увидеть свои задачи."}
        </p>

        <label className="field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>

        <label className="field">
          <span>Пароль</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isRegister ? "new-password" : "current-password"}
            minLength={6}
            required
          />
          {isRegister && <small>Минимум 6 символов</small>}
        </label>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
          {busy ? "Подождите…" : isRegister ? "Создать аккаунт" : "Войти"}
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-block"
          onClick={() => {
            setIsRegister(!isRegister);
            setError(null);
          }}
        >
          {isRegister ? "У меня уже есть аккаунт" : "Нет аккаунта? Зарегистрироваться"}
        </button>
      </form>
    </main>
  );
}
