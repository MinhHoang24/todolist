import TodoList from "./components/TodoList";
import Textfield from "@atlaskit/textfield";
import Button from "@atlaskit/button";
import { useCallback, useEffect, useState } from "react";
import { v4 } from 'uuid';

const TODO_APP_STORAGE_KEY = "TODO_APP";

function App() {
  const [todoList, setTodoList] = useState([]);
  const [textInput, setTextInput] = useState("");

  const [isMounted, setIsMounted] = useState(false);

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
}, []);

useEffect(() => {
  if (isMounted) {
    localStorage.setItem(TODO_APP_STORAGE_KEY, JSON.stringify(todoList));
  }
}, [todoList, isMounted]);

  const onTextInputChange = useCallback((e) => {
    setTextInput(e.target.value);
  }, []);

  const onAddBtnClick= useCallback((e) => {
    // them textInput vao ds todoList
    setTodoList(prev => [
      { id: v4(), name: textInput, isCompleted: false },
      ...prev
    ]);

    setTextInput("");
  }, [textInput]);

  const onCheckBtnClick = useCallback((id) => {
    setTodoList(prevState => 
      prevState.map(todo => 
        todo.id === id ? {...todo, isCompleted: true} : todo
      )
    );
  }, []);

  return (
    <>
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
      ></Textfield>
      <TodoList todoList={todoList} onCheckBtnClick={onCheckBtnClick} />
    </>
  );
}

export default App;
