import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./AuthService";

const RequireAuth = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default RequireAuth;
