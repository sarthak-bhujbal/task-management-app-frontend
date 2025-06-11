import TaskItem from "./TaskItem";
import { Card, ListGroup } from "react-bootstrap";

const TaskList = ({ tasks, onEdit, onDelete, onToggleStatus }) => {
  return (
    <Card>
      <Card.Header>All Tasks</Card.Header>
      <ListGroup variant="flush">
        {tasks.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            onEdit={onEdit}
            onDelete={() => onDelete(task._id)}
            onToggleStatus={onToggleStatus}
          />
        ))}
      </ListGroup>
    </Card>
  );
};

export default TaskList;
