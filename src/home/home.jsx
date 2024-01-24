import React from "react";
import { useLoaderData } from "react-router-dom";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../../constants";

function Home() {
  const problems = useLoaderData();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Problems</h1>
      <div className=" flex flex-col gap-4 p-4">
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>Status</th>
                <th>Title</th>
                <th>Difficulty</th>
                <th>Acceptance</th>
                <th>Submissions</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {problems.map((problem, index) => (
                <tr className=" transition-colors even:bg-base-200">
                  <th>1</th>
                  <td>
                    <Link
                      key={problem._id}
                      to={`/problems/${problem._id}`}
                      className=" hover:text-blue-700 font-bold transition-colors"
                    >
                      <span className="">{index + 1}. </span>
                      {problem.title}
                    </Link>
                  </td>
                  <td
                    className={
                      problem.difficulty === "Easy"
                        ? "text-success"
                        : problem.difficulty === "Medium"
                        ? "text-warning"
                        : "text-error"
                    }
                  >
                    {problem.difficulty}
                  </td>
                  <td>
                    {(problem.submissions.accpetanceRate * 100).toFixed(0)}%
                  </td>
                  <td>{problem.submissions.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Link to={"/problems/new"} className="btn btn-primary">
        Contribute a problem
      </Link>
    </div>
  );
}

export async function HomeLoader({ request: { url } }) {
  const q = new URL(url).searchParams.get("q")?.trim() || "";
  const res = await fetch(BACKEND_URL + "problems");
  const problems = await res.json();
  return problems.filter((problem) =>
    problem.title.toLowerCase().includes(q.toLowerCase())
  );
}

export default Home;
