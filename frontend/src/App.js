
import React, { useEffect, useState } from "react";

function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);

  // Get Todos
  const getTodos = async () => {
    try {
      const response = await fetch("http://localhost:5000/get");
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.log(error);
    }
  };

  // Add Todo
  const addTodo = async (e) => {
    e.preventDefault();

    if (task.trim() === "") {
      alert("Please enter a task");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task }),
      });

      const data = await res.json();

      alert(data.message);

      if (res.status === 201) {
        setTask("");
        getTodos();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Clear All Todos
  const clearTodos = async () => {
    try {
      const res = await fetch("http://localhost:5000/clear", {
        method: "DELETE",
      });

      const data = await res.json();
      alert(data.message);

      getTodos();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #141e30, #243b55)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          width: "400px",
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0px 0px 20px rgba(0,0,0,0.3)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "25px",
            color: "#243b55",
          }}
        >
          Todo App
        </h1>

        {/* Input */}
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            placeholder="Enter your task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid gray",
              outline: "none",
              fontSize: "16px",
            }}
          />

          <button
            onClick={addTodo}
            style={{
              padding: "12px 20px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#243b55",
              color: "white",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Add
          </button>
        </div>

        {/* Todo List */}
        <div style={{ marginTop: "25px" }}>
          {todos.map((todo) => (
            <div
              key={todo._id}
              style={{
                backgroundColor: "#f1f5f9",
                padding: "15px",
                marginBottom: "12px",
                borderRadius: "10px",
                fontSize: "17px",
                color: "#243b55",
                fontWeight: "bold",
              }}
            >
              {todo.task}
            </div>
          ))}
        </div>

        {/* Clear Button */}
        <button
          onClick={clearTodos}
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "12px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: "red",
            color: "white",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Clear All
        </button>
      </div>
    </div>
  );
}

export default App;