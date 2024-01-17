import React from "react";
import { useLoaderData } from "react-router-dom";
import { Link } from "react-router-dom";

function Home() {
  const problems = useLoaderData();

  console.log({ problems });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Problems</h1>
      <div className=" flex flex-col gap-4 p-4">
        {problems.map((problem, index) => (
          <Link
            key={problem._id}
            to={`/problems/${problem._id}`}
            className="   p-2 bg-base-100 border-neutral-700 border-[1px] rounded-lg hover:bg-base-200 hover:border-neutral-800"
          >
            <div className="">
              <span className="">{index + 1}. </span>
              {problem.title}
              <div className=""></div>
            </div>
          </Link>
        ))}
      </div>
      <Link to={"/problems/new"} className="btn">
        Contribute a problem
      </Link>
    </div>
  );
}

export async function HomeLoader() {
  const res = await fetch("http://localhost:3000/problems");
  const problems = await res.json();
  console.log(problems);
  return problems;
}

export default Home;
