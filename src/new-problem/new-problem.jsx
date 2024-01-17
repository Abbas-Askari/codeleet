import ReactCodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import { TestCases } from "./test-cases";
import { useDispatch, useSelector } from "react-redux";
import {
  addParam,
  deleteParam,
  testCodeAsync,
  updateCode,
  updateFunctionName,
} from "./new-problem-slice";
import { Results } from "./result";

function NewProblem() {
  const {
    testCases: cases,
    params,
    code,
  } = useSelector((state) => state.newProblem);
  const dispatch = useDispatch();

  return (
    <form className="flex-1  p-8">
      <h1 className=" font-bold text-2xl text-center">Contribute a problem</h1>

      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text font-semibold text-lg">
            Enter a title for the problem
          </span>
        </div>
        <input
          type="text"
          placeholder="Type here"
          defaultValue="Greatest of three numbers"
          className="input input-bordered w-full max-w-xs"
        />
      </label>

      <label className="form-control">
        <div className="label">
          <span className="label-text font-semibold text-lg">Description</span>
        </div>
        <textarea
          className="textarea textarea-bordered h-24 resize-none"
          placeholder="Bio"
          defaultValue={`Write a function that takes three numbers as input and returns the greatest of the three numbers`}
        ></textarea>
      </label>

      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text font-semibold text-lg">
            Function Name
          </span>
        </div>
        <input
          type="text"
          name="functionName"
          placeholder="Type here"
          onChange={(e) => dispatch(updateFunctionName(e.target.value.trim()))}
          className="input input-bordered w-full max-w-xs"
          defaultValue={"greatestOfThreeNumbers"}
        />
      </label>

      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text font-semibold text-lg">
            Function Parameters
          </span>
          <div
            className=" btn btn-xs btn-circle btn-primary"
            onClick={() => {
              dispatch(addParam());
            }}
          >
            +
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {params.map((param, index) => (
            <div
              key={index}
              className="flex flex-row-reverse items-center gap-2"
            >
              <div
                className=" btn btn-xs btn-circle btn-error"
                onClick={() => {
                  dispatch(deleteParam(index));
                }}
              >
                x
              </div>
              <input
                required
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full max-w-xs input-sm"
                value={param}
                onChange={(e) => {
                  setParams(
                    params.map((p, i) => (i === index ? e.target.value : p))
                  );
                }}
              />
            </div>
          ))}
        </div>
      </label>

      <TestCases />
      <div className="flex gap-4">
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text font-semibold text-lg">Solution</span>
          </div>
          <div className="min-h-96 text-lg bg-red-100">
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

        <Results {...{ cases }} />
      </div>
      <div className="buttons flex mt-4 gap-2">
        <button className=" btn btn-error mr-auto" type="button">
          Discard
        </button>
        <button
          className=" btn btn-secondary"
          type="button"
          onClick={() => {
            console.log("will dispatch testCodeAsync");
            dispatch(testCodeAsync());
          }}
        >
          Test All Cases
        </button>
        <button className=" btn btn-primary">Submit</button>
      </div>
    </form>
  );
}

export default NewProblem;
