import React, { useEffect, useRef, useState } from "react";
import ProblemInfo from "./problem-info";
import Editor from "../editor";
import Output from "./output";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteProblemAsync, updateCode, updateProblem } from "../editorSlice";
import { resetLocalEditorSlice, updateLocalProblem } from "./localEditorSlice";
import { BACKEND_URL } from "../../constants";
function Problem() {
  const problem = useLoaderData();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const [flexHorizontal, setFlexHorizontal] = useState(3);
  const { user } = useSelector((state) => state.auth);
  const isProblemOwner = user?._id === problem?.contributor?._id;

  const [flexVertical, setFlexVertical] = useState(3);
  const f = 10 - flexHorizontal;

  if (leftRef.current && rightRef.current) {
    leftRef.current.style.width = `${flexHorizontal * 10}%`;
    rightRef.current.style.width = `${f * 10}%`;
  }

  useEffect(() => {
    const localCode = localStorage.getItem(`code-${problem._id}`);
    if (localCode)
      dispatch(updateCode({ code: localCode, problemId: problem._id }));
    else
      dispatch(updateCode({ code: problem.template, problemId: problem._id }));

    dispatch(updateProblem(problem));
    dispatch(resetLocalEditorSlice());
    dispatch(updateLocalProblem(problem));
  }, [problem]);

  function deleteProblem() {
    dispatch(deleteProblemAsync({ id: problem._id }));
    navigate("/");
  }

  return (
    <div className=" flex gap-4 flex-1 overflow-auto p-4 relative">
      <input
        type="range"
        name=""
        id=""
        // className=" outline-none w-[calc(100%-2rem)] h-[calc(100%-2rem)] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]  absolute z-10 appearance-none bg-transparent  [&::-webkit-slider-runnable-track]:transparent [&::-webkit-slider-thumb]:bg-neutral-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:rounded-box cursor-ew-resize [&::-webkit-slider-thumb:hover]:bg-neutral-600 [&::-webkit-slider-thumb]:w-[3px] "
        className=" peer absolute w-[calc(100%-2rem)] h-[calc(100%-2rem)] z-10  opacity-0 cursor-ew-resize"
        min="0"
        max="10"
        step={0.1}
        value={flexHorizontal}
        onChange={(e) => {
          const clamped = Math.min(Math.max(e.target.value, 2), 6);
          setFlexHorizontal(clamped);
        }}
      />

      <div
        ref={leftRef}
        className={`flex z-20 flex-col w-[${
          flexHorizontal * 10
        }%] gap-2 items-stretch min-w-min relative after:block after:absolute after:top-0 after:bottom-0 after:pointer-events-none after:-right-2.5 after:w-1 after:bg-blue-400 after:rounded-box after:z-10 after:peer-hover:opacity-80 after:opacity-5 after:transition-color after:cursor-ew-resize`}
      >
        <span
          className={`absolute z-20 h-8 top-[50%] translate-y-[-50%] -right-2.5 pointer-events-none bottom-4 w-1 rounded-box bg-neutral-400  opacity-30 peer-hover:opacity-60 transition-color`}
        ></span>
        <div className="bg-base-200 p-4 rounded-lg">
          <h1 className="text-2xl font-semibold">{problem.title}</h1>
          <h3 className=" ">
            Contributed By:{" "}
            <span className=" link-primary link">
              {problem.contributor?.username}
            </span>
            {" | "}
            <span>
              {problem.createdAt && new Date(problem.createdAt).toDateString()}
            </span>
          </h3>
        </div>
        <ProblemInfo {...{ problem }} className=" flex-1  " />
        {isProblemOwner && (
          <div className="buttons flex gap-2">
            <button onClick={deleteProblem} className="btn flex-1 ">
              Delete
            </button>
            <button className="btn flex-1 ">Edit</button>
          </div>
        )}
      </div>
      <div
        ref={rightRef}
        className={` z-20 flex flex-col gap-4  w-[${f * 10}%] min-w-[10%] `}
      >
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
  const res = await fetch(BACKEND_URL + `problems/${id}`);
  const problem = await res.json();
  console.log({ problem });
  return problem;
}

export default Problem;
