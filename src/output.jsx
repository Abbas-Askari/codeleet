import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { submitCodeAsync } from "./editorSlice";
import Result from "./result";

function Output({ className, problem }) {
  const { code } = useSelector((state) => state.editor);
  const [tab, setTab] = useState(2);
  const tabs = ["Test Cases", "Output", "Result"];
  const dispatch = useDispatch();

  function submitCode() {
    if (code === "") return;
    // console.log("Submit Code", code);
    dispatch(submitCodeAsync({ code, id: problem._id }));
    setTab(2);
  }

  return (
    <div
      className={`${className} p-4 rounded-lg border-neutral-100 border-[1px] flex flex-col`}
    >
      <div className=" flex items-center gap-3">
        <div role="tablist" className="tabs tabs-boxed w-fit">
          {tabs.map((tabName, index) => (
            <button
              key={index}
              onClick={() => {
                setTab(index);
              }}
              role="tab"
              className={`tab px-8 ${tab === index ? "tab-active" : ""}`}
            >
              {tabName}
            </button>
          ))}
        </div>
        <button
          className=" ml-auto btn"
          disabled={code === ""}
          onClick={submitCode}
        >
          Submit
        </button>
        <button className=" btn" title="Run on the provided Test Cases only">
          Run
        </button>
      </div>
      <div className="mt-4  rounded-lg overflow-hidden flex-1">
        {tab === 2 && <Result />}
      </div>
    </div>
  );
}

export default Output;
