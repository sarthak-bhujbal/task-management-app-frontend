import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const TaskForm = ({ show, handleClose, handleSave, editTask }) => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "Pending",
    dueDate: "",
  });

  useEffect(() => {
    if (editTask) setTask(editTask);
  }, [editTask]);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const onSubmit = () => {
    if (!task.title.trim()) return alert("Title is required");
    handleSave(task);
    setTask({ title: "", description: "", status: "Pending", dueDate: "" }); // Reset form
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{editTask ? "Edit Task" : "Add Task"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              name="title"
              value={task.title}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              name="description"
              value={task.description}
              onChange={handleChange}
              as="textarea"
              rows={2}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={task.status}
              onChange={handleChange}
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Due Date</Form.Label>
            <Form.Control
              name="dueDate"
              type="date"
              value={task.dueDate}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onSubmit}>
          {editTask ? "Update" : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TaskForm;
