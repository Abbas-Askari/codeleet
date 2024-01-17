import React, { useEffect } from "react";
import ProblemInfo from "./problem-info";
import Editor from "./editor";
import Output from "./output";
import { useLoaderData } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateCode } from "./editorSlice";
function Problem() {
  const problem = useLoaderData();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateCode(problem.template));
  }, [problem]);

  return (
    <div className=" flex gap-4 flex-1 p-4">
      <ProblemInfo {...{ problem }} className=" flex-1 self-start " />
      <div className="flex flex-[2_2_0] flex-col gap-4">
        <Editor
          {...{ problem }}
          className="flex-1 rounded-xl overflow-hidden "
        />
        <Output {...{ problem }} className="flex-1" />
      </div>
    </div>
  );
}

export async function problemLoader({ params }) {
  const { id } = params;
  const res = await fetch(`http://localhost:3000/problems/${id}`);
  const problem = await res.json();

  console.log(problem);
  return problem;
}

export default Problem;
