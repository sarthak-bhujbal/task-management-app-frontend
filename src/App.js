import { useEffect, useState } from "react";
import AppNavbar from "./components/Navbar";
import TaskList from "./components/taskList";
import TaskForm from "./components/TaskForm";
import { Container, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
// import get post update delete functions
import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
} from "./services/taskService";
function App() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  // api calling

  useEffect(() => {
    fetchTasks();
  }, []);

  // Get Data
  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  // Delete Data
  const handleDelete = async (id) => {
    console.log(id);

    try {
      await deleteTask(id);
      fetchTasks(); // Refresh the list after deletion
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  // Create/Edit Data
  const handleSave = async (task) => {
    if (editTask) {
      try {
        const updatedTask = await updateTask(task._id, task); // ✅ FIXED
        setTasks((prev) =>
          prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
        );
      } catch (error) {
        console.error("Failed to update task:", error);
      }
    } else {
      try {
        const newTask = await addTask(task);
        setTasks((prev) => [...prev, newTask]);
      } catch (error) {
        console.error("Failed to add task:", error);
      }
    }
    setEditTask(null);
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setShowForm(true);
  };

  const handleToggleStatus = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              status: task.status === "Completed" ? "Pending" : "Completed",
            }
          : task
      )
    );
  };

  return (
    <>
      <AppNavbar />
      <Container className="my-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Your Tasks</h2>
          <Button variant="success" onClick={() => setShowForm(true)}>
            + Add Task
          </Button>
        </div>

        <TaskList
          tasks={tasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />
      </Container>

      <TaskForm
        show={showForm}
        handleClose={() => {
          setShowForm(false);
          setEditTask(null);
        }}
        handleSave={handleSave}
        editTask={editTask}
      />
    </>
  );
}

export default App;
