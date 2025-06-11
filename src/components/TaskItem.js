import { ListGroup, Button, Badge } from 'react-bootstrap';

const TaskItem = ({ task, onEdit, onDelete, onToggleStatus }) => {
  return (
    <ListGroup.Item className="d-flex justify-content-between align-items-center">
      <div>
        <h5>{task.title}</h5>
        <p className="mb-1 text-muted">{task.description}</p>
        <Badge bg={
          task.status === 'Completed' ? 'success' :
          task.status === 'In Progress' ? 'warning' : 'secondary'
        }>
          {task.status}
        </Badge>
      </div>
      <div>
        <Button size="sm" variant="primary" onClick={() => onEdit(task)}>Edit</Button>{' '}
        <Button size="sm" variant="danger" onClick={() => onDelete(task.id)}>Delete</Button>{' '}
        <Button size="sm" variant="success" onClick={() => onToggleStatus(task.id)}>Complete</Button>
      </div>
    </ListGroup.Item>
  );
};

export default TaskItem;
