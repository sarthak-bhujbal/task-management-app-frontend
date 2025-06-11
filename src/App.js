import { useState } from 'react';
import AppNavbar from './components/Navbar';
import TaskList from './components/taskList';
import TaskForm from './components/TaskForm';
import { Container, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const handleSave = (task) => {
    if (editTask) {
      // Update existing task
      setTasks(prev =>
        prev.map(t => (t.id === task.id ? { ...task } : t))
      );
    } else {
      // Add new task
      setTasks(prev => [
        ...prev,
        { ...task, id: Date.now().toString() }
      ]);
    }
    setEditTask(null);
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(prev => prev.filter(task => task.id !== id));
    }
  };

  const handleToggleStatus = (id) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? {
              ...task,
              status:
                task.status === 'Completed' ? 'Pending' : 'Completed',
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
