import { useEffect, useState } from "react";
import AppNavbar from "../components/Navbar";
import TaskList from "../components/taskList";
import TaskForm from "../components/TaskForm";
import { Container, Button } from "react-bootstrap";
import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
} from "../services/taskService";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      fetchTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleSave = async (task) => {
    if (editTask) {
      try {
        const updatedTask = await updateTask(task._id, task);
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
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>
            {error} <Button onClick={fetchTasks}>Retry</Button>
          </div>
        ) : tasks.length === 0 ? (
          <p>No tasks available.</p>
        ) : (
          <TaskList
            tasks={tasks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        )}
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
};

export default Dashboard;
