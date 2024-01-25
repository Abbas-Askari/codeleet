import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTestCase, deleteTestCase, setTestCase } from "./new-problem-slice";
import { EXECUTION_TIMEOUT, MAX_LOGS } from "../../constants";
import { isValidTestCaseArg } from "../utils";
import { set } from "mongoose";

export function TestCases({}) {
  const [tab, setTab] = useState(0);
  const { testCases, params, runningTestCases, results, logs, errors, times } =
    useSelector((state) => state.newProblem);
  const dispatch = useDispatch();

  console.error({ times });

  if (runningTestCases) {
    return (
      <div className="w-full h-full flex items-center justify-center gap-2">
        Running test cases. Please wait.
        <span className=" loading "></span>
      </div>
    );
  }

  return (
    <div className="overflow-hidden h-full flex flex-col ">
      <div className="bg-base-200 p-2 text-lg font-semibold flex justify-between items-center pr-0">
        Test Cases
        <button
          type="button"
          onClick={() => {
            console.log(document.getElementById("arg-help"));
            document.getElementById("arg-help")?.showModal();
          }}
          className="btn bg-warning btn-xs btn-circle  text-warning-content"
        >
          ?
        </button>
        <ArgHelp />
      </div>

      <div className="flex  items-center gap-1 ">
        <div
          role="tablist"
          className="tabs tabs-boxed flex-1 flex overflow-auto bg-base-300"
        >
          {testCases.map((c, i) => (
            <a
              key={i}
              role="tab"
              className={`tab relative flex-[1_0_fit-content] ${
                tab === i ? "tab-active " : ""
              }`}
              onClick={() => setTab(i)}
            >
              {/* <span className="badge badge-error">1</span> */}
              {(errors[i] || times[i] >= EXECUTION_TIMEOUT) && (
                <div className="pointer-events-none badge badge-error mr-2">
                  1
                </div>
              )}
              Test Case {i + 1}
              {testCases.length > 3 && (
                <div
                  className=" rounded-full bg-neutral-700 text-neutral-300 flex items-center justify-center absolute right-0 top-0 text-[8px]   w-3 h-3 "
                  onClick={() => {
                    dispatch(deleteTestCase(i));
                  }}
                >
                  x
                </div>
              )}
            </a>
          ))}
        </div>
        <span
          className=" h-full btn btn-xs btn-primary btn-square "
          onClick={() => dispatch(addTestCase())}
        >
          +
        </span>
      </div>
      {params.length > 0 && testCases[tab] && (
        <Case
          {...{
            params,
            testCase: testCases[tab],
            setTestCase: (testCase) => {
              dispatch(setTestCase({ testCase, index: tab }));
            },
            recived: results[tab],
            error: errors[tab],
            logs: logs[tab],
            time: times[tab],
          }}
        />
      )}
    </div>
  );
}

export function Case({
  testCase,
  params,
  setTestCase,
  recived,
  error,
  time,
  logs,
}) {
  let message, stack;
  const timedOut = time >= EXECUTION_TIMEOUT;
  if (timedOut) {
    error = "Execution timed out \n Too much time taken";
  }

  console.log({ error, recived, time });

  if (error) [message, stack] = error.split("\n");

  return (
    <div className=" bg-base-200 p-4 rounded-lg mt-1">
      <div className="text-lg font-semibold">Arguments:</div>
      {params.length > 0 &&
        params.map((param, i) => (
          <div key={i} className=" mb-2">
            <div className="lable flex justify-start gap-1">
              <code>{param}</code>
              <>
                <span
                  className={`ml-auto text-error text-xs opacity-0 transition-opacity ${
                    !isValidTestCaseArg(testCase[i]) ? "opacity-100" : ""
                  }`}
                >
                  Invalid Argument, See{" "}
                  <button
                    type="button"
                    className="link text-xs link-error"
                    href="#arg-help-checkbox"
                    onClick={() => {
                      document.getElementById("arg-help")?.showModal();
                    }}
                  >
                    help
                  </button>
                </span>
              </>
            </div>
            <code>
              <input
                required
                className={`input transition-all input-bordered input-sm w-full bg-base-100 ${
                  isValidTestCaseArg(testCase[i])
                    ? " "
                    : "text-error input-error"
                }`}
                placeholder={`value for ${param}`}
                value={testCase[i]}
                onChange={(e) => {
                  setTestCase(
                    testCase.map((p, j) => (j === i ? e.target.value : p))
                  );
                }}
              />
            </code>
          </div>
        ))}

      {recived !== undefined && (
        <>
          <div className="text-lg font-semibold">Recived Output:</div>
          <div className={`bg-base-100 p-2 px-4 rounded-lg mb-2`}>
            <code>{JSON.stringify(recived)}</code>
          </div>
        </>
      )}

      {error && (
        <>
          <div className=" text-error font-semibold text-lg">Error: </div>
          <div className=" text-error-content bg-error p-2 rounded-lg">
            <div>{message}</div>
            <div className=" text-balance">{stack}</div>
          </div>
        </>
      )}

      {time !== undefined && (
        <>
          <div className="text-lg font-semibold">Runtime:</div>
          <div className="bg-base-100 p-2 px-4 rounded-lg mb-2">
            <code className={timedOut ? "text-error" : "text-success"}>
              {time}ms
            </code>
          </div>
        </>
      )}

      {logs?.length > 0 && (
        <>
          <div className="font-semibold text-lg">Logs: </div>
          <div className=" bg-base-100 max-h-48 overflow-auto p-2 px-4 rounded-lg">
            {logs.length >= MAX_LOGS && (
              <div className="  text-warning">
                <code className="">
                  <div>Warning: number of logs exceeded limit ({MAX_LOGS})</div>
                  Showing first {MAX_LOGS} logs
                </code>
              </div>
            )}
            {logs.map((log, index) => (
              <div key={index} className="">
                <code>{log}</code>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ArgHelp() {
  return (
    <dialog id="arg-help" className="modal">
      <div className="modal-box w-fit">
        <h3 className="font-bold text-lg flex items-center justify-between text-info">
          Test Case Arguments Help
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-circle btn-xs">x</button>
          </form>
        </h3>

        <div className="">
          <div className="font-normal text-sm text-pretty">
            <p className=" mt-1">
              The arguments are the values that are passed to the function when
              it is called. The function should return the expected output for
              the given arguments.
            </p>
            <p className=" mt-1">
              The arguments are passed to the function in the same order as they
              are listed in the test cases.
            </p>
            <p className=" mt-1">
              Any valid JSON is allowed as an argument. This includes numbers,
              strings, arrays, objects, and <code>null</code>.
            </p>
            <div className=" ">
              <div className="font-semibold">Examples: </div>
              <div className="ml-2 mt-1 flex flex-col gap-2">
                <code className="flex items-center gap-2 p-2  bg-base-300 rounded-lg">
                  Number: 1
                </code>

                <code className="flex flex-col items-start justify-center gap-2 p-2  bg-base-300 rounded-lg">
                  <div>
                    Object:
                    {" {"}"a": "23", "b": {"{"}"a": "23"{"}"}, "c": null{"}"}
                  </div>

                  <div className=" text-warning">
                    Remember! Object keys must be enclosed in qoutation marks
                  </div>
                </code>

                <code className="flex items-center gap-2 p-2  bg-base-300 rounded-lg">
                  Array:
                  {" ["}1, "23", {"{"}"a": "23"{"}"}, null{"]"}
                </code>

                <code className="flex items-center gap-2 p-2  bg-base-300 rounded-lg">
                  String: "Hello, World!"
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
