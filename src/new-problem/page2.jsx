import React from "react";
import General from "./general";
import Template from "./template";
import ReactCodeMirror from "@uiw/react-codemirror";
import { TestCases } from "./test-cases";
import {
  submitProblemAsync,
  testCodeAsync,
  updateCode,
} from "./new-problem-slice";
import { javascript } from "@codemirror/lang-javascript";
import { Results } from "./result";
import { useDispatch, useSelector } from "react-redux";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

function Page2() {
  const dispatch = useDispatch();

  const { testCases, code } = useSelector((s) => s.newProblem);

  return (
    <>
      <TestCases />
      <div className="flex gap-4">
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text font-semibold text-lg">Solution</span>
          </div>
          <div className="min-h-96 text-lg  rounded-lg overflow-hidden">
            <ReactCodeMirror
              value={code}
              onChange={(value) => dispatch(updateCode(value))}
              className=" "
              theme={vscodeDark}
              height="24rem"
              extensions={[javascript()]}
            />
          </div>
        </label>

        <Results {...{ cases: testCases }} />
      </div>
      <div className="buttons flex mt-4p gap-2">
        <button className=" btn btn-error mr-auto" type="button">
          Discard
        </button>
        <button
          className=" btn btn-secondary"
          type="button"
          onClick={() => {
            dispatch(testCodeAsync());
          }}
        >
          Test All Cases
        </button>
        <button
          className=" btn btn-primary"
          type="button"
          onClick={() => dispatch(submitProblemAsync())}
        >
          Submit
        </button>
      </div>
    </>
  );
}

export default Page2;
