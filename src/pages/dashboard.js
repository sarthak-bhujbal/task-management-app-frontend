import { useEffect, useState } from "react";
import AppNavbar from "../components/Navbar";
import TaskList from "../components/taskList";
import TaskForm from "../components/TaskForm";
import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
} from "../services/taskService";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col, Button, Form, Container } from "react-bootstrap";
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

  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOption, setSortOption] = useState("Newest");
  const getFilteredSortedTasks = () => {
    let filtered =
      filterStatus === "All"
        ? tasks
        : tasks.filter((task) => task.status === filterStatus);

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    let sorted = [...filtered];

    if (sortOption === "Newest") {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOption === "Oldest") {
      sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortOption === "DueDate") {
      sorted.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }

    return sorted;
  };

  const [searchQuery, setSearchQuery] = useState("");

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
        {/* filter */}
        {/* <div className="mb-3 d-flex">
          <Button
            variant={filterStatus === "All" ? "primary" : "outline-primary"}
            onClick={() => setFilterStatus("All")}
            className="me-2"
          >
            All
          </Button>
          <Button
            variant={filterStatus === "Pending" ? "primary" : "outline-primary"}
            onClick={() => setFilterStatus("Pending")}
            className="me-2"
          >
            Pending
          </Button>
          <Button
            variant={
              filterStatus === "In Progress" ? "primary" : "outline-primary"
            }
            onClick={() => setFilterStatus("In Progress")}
            className="me-2"
          >
            In Progress
          </Button>
          <Button
            variant={
              filterStatus === "Completed" ? "primary" : "outline-primary"
            }
            onClick={() => setFilterStatus("Completed")}
          >
            Completed
          </Button>
          <Form.Select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-auto ms-2"
          >
            <option value="Newest">Newest First</option>
            <option value="Oldest">Oldest First</option>
            <option value="DueDate">Due Date (Closest First)</option>
          </Form.Select>
          <Form.Control
            type="text"
            placeholder="Search tasks by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-3"
          />
        </div> */}

        <div className="mb-3">
          <Row className="gy-2 gx-2 align-items-center">
            {/* Filter Buttons */}
            <Col xs={12} md="auto">
              <div className="d-flex flex-wrap gap-2">
                {["All", "Pending", "In Progress", "Completed"].map(
                  (status) => (
                    <Button
                      key={status}
                      variant={
                        filterStatus === status ? "primary" : "outline-primary"
                      }
                      onClick={() => setFilterStatus(status)}
                    >
                      {status}
                    </Button>
                  )
                )}
              </div>
            </Col>

            {/* Sort Dropdown */}
            <Col xs={12} md="auto">
              <Form.Select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-100"
              >
                <option value="Newest">Newest First</option>
                <option value="Oldest">Oldest First</option>
                <option value="DueDate">Due Date (Closest First)</option>
              </Form.Select>
            </Col>

            {/* Search Input */}
            <Col xs={12} md>
              <Form.Control
                type="text"
                placeholder="Search tasks by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Col>
          </Row>
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
            tasks={getFilteredSortedTasks()}
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
