import { Navigate } from "react-router-dom";
import useAuth from "../useAuth";
import Spinner from "./common/Spinner";

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <Spinner fullPage />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}