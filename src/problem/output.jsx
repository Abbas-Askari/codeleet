import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { submitCodeAsync } from "../editorSlice";
import Result from "./result";
import { TestCases } from "./test-cases";
import { testLocalCasesAsync } from "./localEditorSlice";

function Output({ className, problem }) {
  const { code } = useSelector((state) => state.editor);
  const [tab, setTab] = useState(0);
  const tabs = ["Test Cases", "Submission Result"];
  const dispatch = useDispatch();

  function submitCode() {
    if (code === "") return;
    dispatch(submitCodeAsync({ code, id: problem._id }));
    setTab(1);
  }

  return (
    <div
      className={`${className} p-4 rounded-lg  flex flex-col  overflow-auto bg-base-200`}
    >
      <div className=" flex items-center gap-3">
        <div role="tablist" className="tabs tabs-boxed  p-0 ">
          {tabs.map((tabName, index) => (
            <button
              key={index}
              onClick={() => {
                setTab(index);
              }}
              role="tab"
              className={`tab px-8 ${tab === index ? "tab-active " : ""}`}
            >
              {tabName}
            </button>
          ))}
        </div>
        <button
          className=" ml-auto btn btn-outline h-full btn-sm"
          disabled={code === ""}
          onClick={submitCode}
        >
          Submit
        </button>
        <button
          className=" btn btn-outline h-full btn-sm"
          title="Run on the provided Test Cases only"
          disabled={code === ""}
          onClick={() => {
            dispatch(testLocalCasesAsync({ code, problem }));
            setTab(0);
          }}
        >
          Run
        </button>
      </div>
      <div className="mt-4  rounded-lg overflow-hidden flex-1 ">
        {tab === 0 && <TestCases {...{ problem }} />}
        {tab === 1 && <Result />}
      </div>
    </div>
  );
}

export default Output;
