import AppLayout from "./app-layout";
import Problem, { problemLoader } from "./problem";
import Home, { HomeLoader } from "./home/home";
import { createBrowserRouter } from "react-router-dom";
import NewProblem from "./new-problem/new-problem";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { element: <NewProblem />, path: "/problems/new" },
      { element: <Problem />, path: "/problems/:id", loader: problemLoader },
      { element: <Home />, path: "/", loader: HomeLoader },
    ],
  },
]);
