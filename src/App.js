import TodoList from "./components/TodoList";
import Textfield from "@atlaskit/textfield";
import Button from "@atlaskit/button";
import { useCallback, useEffect, useState } from "react";
import { v4 } from 'uuid';
import useTodoStorage from './hooks/useTodoStorage';
import './App.css';

const TODO_APP_STORAGE_KEY = "TODO_APP";

function App() {
  const [todoList, setTodoList] = useTodoStorage(TODO_APP_STORAGE_KEY);
  const [textInput, setTextInput] = useState("");

  const [isMounted, setIsMounted] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    try {
      const storaged = localStorage.getItem(TODO_APP_STORAGE_KEY);
      const parsed = JSON.parse(storaged);
      console.log("🟡 Dữ liệu lấy từ localStorage:", parsed);
      if (Array.isArray(parsed)) {
        setTodoList(parsed);
      }
    } catch (e) {
      console.error("Lỗi khi load localStorage:", e);
    }
    // đánh dấu đã load xong lần đầu
    setIsMounted(true);
  }, [setTodoList]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(TODO_APP_STORAGE_KEY, JSON.stringify(todoList));
    }
  }, [todoList, isMounted]);

  const onDeleteBtnClick = useCallback((id) => {
    setTodoList(prev => prev.filter(todo => todo.id !== id));
  }, [setTodoList]);

  const onTextInputChange = useCallback((e) => {
    setTextInput(e.target.value);
  }, []);

  const onAddBtnClick = useCallback(() => {
    const trimmedInput = textInput.trim().toLowerCase();

    const isDuplicate = todoList.some(
      (todo) => todo.name.trim().toLowerCase() === trimmedInput
    );

    if (isDuplicate) {
      alert("❌ Công việc này đã tồn tại!");
      return;
    }

    setTodoList(prev => [
      { id: v4(), name: textInput.trim(), isCompleted: false },
      ...prev
    ]);
    setTextInput("");
  }, [textInput, todoList, setTodoList]);


  const onCheckBtnClick = useCallback((id) => {
    setTodoList(prev => {
      const updatedList = prev.map(todo =>
        todo.id === id ? { ...todo, isCompleted: true } : todo
      );

      // 🔽 Tách và sắp xếp lại:
      const incomplete = updatedList.filter(todo => !todo.isCompleted);
      const completed = updatedList.filter(todo => todo.isCompleted);

      return [...incomplete, ...completed]; // ⬅ incomplete lên trước, completed xuống dưới
    });
    }, [setTodoList]);

  return (
    <div className="app-container">
      <Button
        appearance={darkMode ? "default" : "primary"}
        onClick={() => setDarkMode(!darkMode)}
        style={{ marginBottom: "12px" }}
      >
        {darkMode ? "☀️ Chế độ sáng" : "🌙 Chế độ tối"}
      </Button>

      <h3>danh sach can lam</h3>

      <Textfield 
        name="add-todo" 
        placeholder="them viec can lam..." 
        elemAfterInput={
          <Button isDisabled={!textInput} appearance="primary" onClick={onAddBtnClick}>
            them
          </Button>
        }
        css={{ padding: '2px 4px 2px' }}
        value={textInput}
        onChange={onTextInputChange}
        onKeyDown={(e) => {
          if(e.key === 'Enter' && textInput.trim() && !e.shiftKey) {
            e.preventDefault();
            onAddBtnClick();
          }
        }}
      ></Textfield>
      
      <TodoList
        todoList={todoList}
        onCheckBtnClick={onCheckBtnClick}
        onDeleteBtnClick={onDeleteBtnClick}
      />
    </div>
  );
}

export default App;
