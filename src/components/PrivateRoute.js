import { Navigate } from "react-router-dom";
import { getToken } from "../services/authService";

const PrivateRoute = ({ children }) => {
  const token = getToken();
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
