# todo-api — Лабораторная работа №5 (React + Express + PostgreSQL + JWT)

## Запуск

### 1. Сервер (папка проекта)
```
npm install
```
Создайте `.env` рядом с `server.js`:
```
JWT_SECRET=любая_длинная_строка
JWT_EXPIRES_IN=1h
```
Убедитесь, что PostgreSQL запущен и есть база `todo_db` (настройки в `config/config.json`), затем:
```
npx sequelize-cli db:migrate
npm run dev
```
Сервер: http://localhost:3000, API: http://localhost:3000/api

### 2. Клиент (папка `todo-react`)
Создайте `todo-react/.env`:
```
VITE_API_URL=http://localhost:3000/api
```
```
cd todo-react
npm install
npm run dev
```
Откройте адрес, который напечатает Vite (обычно http://localhost:5173), зарегистрируйтесь и войдите.

## Что реализовано
- GET / POST / PUT / DELETE задач через axios (`src/api.js`), JWT подставляется interceptor-ом
- состояния загрузки (спиннер) и ошибки (кнопка «Повторить»)
- оптимистичное добавление, удаление, редактирование и переключение с откатом при ошибке
- улучшение: серверный поиск `GET /api/tasks?search=...` с debounce 500 мс и отменой запроса (AbortController)
