import { useEffect, useState } from "react";
import "./App.css";
import {
  deleteStudy,
  fetchStudyIdFromTitle,
  fetchStudyRecord,
  insertStudy,
} from "./service/studyRecordService";
import type { StudyRecordType } from "./types/studyRecordType";

function App() {
  const [content, setContent] = useState("");
  const [time, setTime] = useState(0);
  const [todos, setTodos] = useState<StudyRecordType[]>([]);
  const [error, setError] = useState(false);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchStudy = async () => {
    try {
      const getTodos = await fetchStudyRecord();
      setTodos(getTodos);
      const totalTime = getTodos.reduce((sum, todo) => sum + todo.time, 0);
      setTotal(totalTime);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudy();
  }, []);

  const onChangeContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };
  const onChangeTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.valueAsNumber);
  };

  const subscribe = async () => {
    if (content == "" || time == 0 || time == null) {
      setError(true);
      return;
    }

    try {
      const newTodo: StudyRecordType = { title: content, time: time };
      setLoading(true);
      await insertStudy(newTodo);
      fetchStudy();
    } catch (err) {
      console.error(err);
    }
    setContent("");
    setTime(0);
    setError(false);
  };

  const deleteTodo = async (v: string) => {
    try {
      setLoading(true);
      const id = await fetchStudyIdFromTitle(v);
      await deleteStudy(id);
      fetchStudy();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }
  return (
    <>
      <h1>学習記録一覧</h1>
      <ul>
        {todos.map((data) => {
          return (
            <li key={data.id}>
              <p>
                {data.title} : {data.time}時間 :
                <button onClick={() => deleteTodo(data.title)}>削除</button>
              </p>
            </li>
          );
        })}
      </ul>
      <div>
        学習内容 :{" "}
        <input
          type="text"
          placeholder="学習内容"
          value={content}
          onChange={onChangeContent}
        />
      </div>
      <div>
        学習時間 :{" "}
        <input
          type="number"
          placeholder="学習時間"
          value={time}
          onChange={onChangeTime}
        />
        時間
      </div>
      <div>
        <button type="button" onClick={subscribe}>
          登録
        </button>
      </div>
      {error && <div>入力されていない項目があります。</div>}
      <div>合計時間 : {total}/1000 (h)</div>
    </>
  );
}

export default App;
