import { useEffect, useRef, useState } from "react";
import { getLocalStorage } from "./modules/storage";
import { generateIdentity } from "./modules/genereateIdentity";
import { TodoType } from "./types";
import TrashIcon from "./assets/trash.svg";
import TrashIconSm from "./assets/trash-sm.svg";
import "./App.css";

const KEY_TODOS = "todos";

const todosLocalStorage = (getLocalStorage("todos") as TodoType[]) || [];

function App() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [filterType, setFilterType] = useState<"all" | "active" | "completed">(
    "all"
  );

  const [todos, setTodos] = useState<TodoType[]>(todosLocalStorage);

  useEffect(() => {
    localStorage.setItem(KEY_TODOS, JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = () => {
    const value = inputRef.current?.value || "";

    if (value) {
      setTodos([
        ...todos,
        { id: generateIdentity(), name: value, isChecked: 0 },
      ]);
    }

    return null;
  };

  const handleCheckTodo = (item: TodoType) => {
    const checkTodo = todos.findIndex((todo) => todo.id === item.id);
    const updatedTodo = [...todos];

    if (updatedTodo[checkTodo].isChecked === 1) {
      updatedTodo[checkTodo].isChecked = 0;
      return setTodos(updatedTodo);
    }

    updatedTodo[checkTodo].isChecked = 1;
    return setTodos(updatedTodo);
  };

  const handleDeleteTodo = (item: TodoType) => {
    const filterTodo = todos.filter((todo) => todo.id !== item.id);
    return setTodos(filterTodo);
  };

  const handleDeleteAllTodo = () => {
    const filterTodo = todos.filter((todo) => todo.isChecked === 0) || [];

    return setTodos(filterTodo);
  };

  const filterTodo = (): TodoType[] => {
    if (filterType === "active") {
      const filterTodos = todos.filter((item) => item.isChecked === 0);
      return filterTodos;
    }
    if (filterType === "completed") {
      const filterTodos = todos.filter((item) => item.isChecked === 1);
      return filterTodos;
    }
    return todos;
  };

  return (
    <div className="app-container">
      <h1 className="title-text">#todos</h1>
      <div className="container">
        <div className="selection-container">
          <div
            className="filter-container"
            onClick={() => setFilterType("all")}
          >
            <p className="filter-text">All</p>
            <span
              className="border-active"
              data-type-active={Boolean(filterType === "all")}
            ></span>
          </div>
          <div
            className="filter-container"
            onClick={() => setFilterType("active")}
          >
            <p className="filter-text">Active</p>
            <span
              className="border-active"
              data-type-active={Boolean(filterType === "active")}
            ></span>
          </div>
          <div
            className="filter-container"
            onClick={() => setFilterType("completed")}
          >
            <p className="filter-text">Completed</p>
            <span
              className="border-active"
              data-type-active={Boolean(filterType === "completed")}
            ></span>
          </div>
        </div>
        <div className="input-container">
          <input
            ref={inputRef}
            type="text"
            name="todos-name"
            id="todos-name"
            placeholder="add details"
          />
          <button
            type="button"
            className="button-container"
            onClick={handleAddTodo}
          >
            Add
          </button>
        </div>
        <div className="list-todos-container">
          {filterTodo()?.map((item) => (
            <div className="flex-between" key={item.id}>
              <div
                className="checkbox-container"
                onClick={() => handleCheckTodo(item)}
              >
                <input
                  type="checkbox"
                  id="todos"
                  name="todos"
                  value="todos"
                  checked={Boolean(item.isChecked)}
                  readOnly
                />
                <label data-type-checked={Boolean(item.isChecked)}>
                  {item.name}
                </label>
              </div>
              {filterType === "completed" && (
                <div
                  className="delete-todo-container"
                  onClick={() => handleDeleteTodo(item)}
                >
                  <img src={TrashIcon} alt="trash-icon" />
                </div>
              )}
            </div>
          ))}
          {filterType === "completed" && filterTodo().length > 0 && (
            <div
              className="button-delete-todo-container"
              onClick={handleDeleteAllTodo}
            >
              <button>
                <img src={TrashIconSm} alt="trash-icon" />
                <p>Delete All</p>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
