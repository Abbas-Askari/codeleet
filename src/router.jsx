import AppLayout from "./app-layout";
import Problem, { problemLoader } from "./problem";
import Home, { HomeLoader } from "./home/home";
import { createBrowserRouter } from "react-router-dom";
import NewProblem from "./new-problem/new-problem";
import Login from "./auth/login";
import AuthRequired from "./auth/auth-required";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Protected = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  if (!user) {
    return <Navigate to="/auth-required" replace />;
  }
  return children;
};

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        element: (
          <Protected>
            <NewProblem />
          </Protected>
        ),
        path: "/problems/new",
      },
      {
        element: <Problem />,
        path: "/problems/:id",
        loader: problemLoader,
      },
      { element: <Home />, path: "/", loader: HomeLoader },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <div>Signup</div>,
      },
      {
        path: "/auth-required",
        element: <AuthRequired />,
      },
    ],
  },
  {
    path: "*",
    element: <div>Not Found</div>,
  },
]);
