import AppLayout from "./app-layout";
import Problem, { problemLoader } from "./problem/problem";
import Home, { HomeLoader } from "./home/home";
import { createBrowserRouter } from "react-router-dom";
import NewProblem from "./new-problem/new-problem";
import Login from "./auth/login";
import AuthRequired from "./auth/auth-required";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Signup from "./auth/signup";
import Page1 from "./new-problem/page1";
import Page2 from "./new-problem/page2";
import Error from "./error";

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
    errorElement: <Error />,
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
        element: <Signup />,
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
