import ReactCodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import { TestCases } from "./test-cases";
import { useDispatch, useSelector } from "react-redux";
import {
  addParam,
  deleteParam,
  submitProblemAsync,
  testCodeAsync,
  updateCode,
  updateDescription,
  updateError,
  updateFunctionName,
  updateParam,
  updateTitle,
} from "./new-problem-slice";
import { Results } from "./result";
import { isValidIdentifier } from "../utils";
import Template from "./template";
import General from "./general";
import { Link, Outlet, useLocation } from "react-router-dom";
import Page2 from "./page2";

function NewProblem() {
  const { functionName, testCases, params, code, title, description, error } =
    useSelector((state) => state.newProblem);
  const dispatch = useDispatch();

  // check if we are on page1 or page2 then apply funcitonality for
  // back and next buttons
  const { pathname } = useLocation();
  const isPage1 = pathname === "/problems/new/page1";

  console.log({ error });

  if (error !== "") {
    document.getElementById("my_modal_1")?.showModal();
  }

  return (
    <form className="flex-1 max-w-[1400px] w-full mx-auto p-8 pt-0">
      <h1 className=" font-bold text-2xl text-center text-info">
        Contribute a problem
      </h1>

      <dialog open={error !== ""} id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-error flex mb-4 justify-between">
            Error!
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button
                onClick={() => {
                  setTimeout(() => {
                    dispatch(updateError(""));
                    console.log("nullifying error");
                  }, 20);
                }}
                className="btn btn-sm btn-circle"
              >
                x
              </button>
            </form>
          </h3>
          <p className="p-4 rounded-box bg-error text-error-content">{error}</p>
        </div>
      </dialog>

      <div className="flex overflow-hidden flex-1 flex-col gap-4">
        <div className="bg-base-200 rounded-lg p-4 mt-4 flex gap-4">
          <General />
          <div className=" flex-1 overflow-hidden">
            <Template />
          </div>
        </div>
        <div className="bg-base-200 rounded-lg p-4  flex gap-4">
          <div className=" flex-1">
            <TestCases />
          </div>
          <div className="flex gap-4 flex-1">
            <div className="form-control w-full">
              <div className="label">
                <span className="label-text font-semibold text-lg">
                  Solution
                </span>
              </div>
              <div className="min-h-96 text-lg  rounded-lg overflow-hidden">
                <ReactCodeMirror
                  value={code}
                  onChange={(value) => dispatch(updateCode(value))}
                  className=" flex-1 overflow-auto bg-red-300 focus-within:border-blue-400 border-2 rounded-lg "
                  theme={vscodeDark}
                  height="24rem"
                  extensions={[javascript()]}
                />
              </div>
              <button
                className=" btn btn-primary mt-2"
                type="button"
                onClick={() => {
                  dispatch(testCodeAsync());
                }}
              >
                Test All Cases
              </button>
            </div>
          </div>
        </div>
        <div className="buttons flex mt-4p gap-2">
          <button className=" btn btn-error mr-auto" type="button">
            Discard
          </button>

          <button
            className=" btn btn-primary"
            type="button"
            // onClick={() => dispatch(submitProblemAsync())}
            onClick={() => {
              document.getElementById("submit-help")?.showModal();
            }}
          >
            Submit
          </button>
          <SubmitHelp />
        </div>{" "}
      </div>
    </form>
  );
}

function SubmitHelp() {
  const dispatch = useDispatch();
  return (
    <dialog id="submit-help" className="modal">
      <div className="modal-box w-fit">
        <h3 className="font-bold text-lg flex items-center justify-between text-info">
          Problem SUbmission
          <form method="dialog">
            <button className="btn btn-circle btn-xs">x</button>
          </form>
        </h3>

        <div className="">
          <div id="submit-help">
            <div className="mt-2 mx-2 text-sm">
              <p className="ml-3 mt-1">
                Before submitting, make sure that you have run the code on the
                test cases and that the code runs successfully, without errors
                and timeouts, and gives the expected output for all the test
                cases.
              </p>
              <p className="ml-3 mt-1">
                Remove any <code>log()</code> calls from the Solution function.
              </p>
              <p className="ml-3 mt-1">
                Provide a detailed description of the problem and the required
                solution.
              </p>
              <p className="ml-3 mt-1">
                Provide enough test cases to test the solution thoroughly.
              </p>
            </div>
          </div>
          <div className=" flex flex-col mt-4">
            <button
              className=" ml-auto btn btn-primary"
              type="button"
              onClick={() => {
                document.getElementById("submit-help").close();
                dispatch(submitProblemAsync());
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export default NewProblem;
