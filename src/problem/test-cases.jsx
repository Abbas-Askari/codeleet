import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EXECUTION_TIMEOUT, MAX_LOGS } from "../../constants";
import isEqual from "lodash.isequal";
import { addTestCase, updateTestCase } from "./localEditorSlice";
import { isValidTestCaseArg } from "../utils";

export function TestCases() {
  const [tab, setTab] = useState(0);
  // console.log({ problem });
  const {
    times,
    expecteds,
    results,
    errors,
    logs,
    loading,
    problem,
    testCases,
  } = useSelector((state) => state.localEditor);
  const dispatch = useDispatch();
  console.log({ testCases });
  if (!problem) return null;

  const { inputs, params } = problem;

  // console.log("Submit Code", code);
  console.log({ testCases, expecteds, results, inputs, params });

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center gap-2">
        Running test cases. Please wait.
        <span className=" loading "></span>
      </div>
    );
  }

  return (
    <div className="overflow-hidden h-full flex flex-col ">
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
              {(errors[i] ||
                times[i] >= EXECUTION_TIMEOUT ||
                c.some((arg) => !isValidTestCaseArg(arg))) && (
                <div className="pointer-events-none badge badge-error mr-2">
                  1
                </div>
              )}
              Test Case {i + 1}
              {testCases.length > 3 && (
                <span
                  className=" rounded-full bg-neutral-700 text-neutral-300 flex items-center justify-center absolute right-0 top-0 text-[8px]   w-3 h-3 "
                  onClick={() => {
                    dispatch(deleteTestCase(i));
                  }}
                >
                  x
                </span>
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
              dispatch(updateTestCase({ result: testCase, index: tab }));
            },
            expected: expecteds[tab],
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

function Case({
  testCase,
  params,
  setTestCase,
  expected,
  recived,
  logs,
  error,
  time,
}) {
  console.log({ testCase });

  let message, stack;

  const timedOut = time >= EXECUTION_TIMEOUT;
  if (timedOut) {
    error = "Execution timed out";
  }

  const passed = isEqual(expected, recived) && !error;
  const ran = expected !== undefined || error;

  if (error) [message, stack] = error.split("\n");

  return (
    <div className=" bg-base-300 p-4 rounded-lg mt-1 overflow-auto flex-1">
      {ran ? (
        passed ? (
          <div className=" font-bold text-xl text-success">
            <span className="">Passed</span>
          </div>
        ) : (
          <div className=" font-bold text-xl text-error">
            <span className="">Failed</span>
          </div>
        )
      ) : (
        <div className=" font-bold  text-info">
          <span className="">Click run to execute these test cases.</span>
        </div>
      )}

      {params.length > 0 && !error && (
        <>
          <div className=" text-lg font-semibold">Arguments:</div>
          {params.map((param, i) => (
            <div key={i} className="">
              <div className="lable flex justify-center gap-1">
                <code>{param}</code>
                <>
                  <span
                    className={`ml-auto text-error text-xs opacity-0 transition-opacity ${
                      !isValidTestCaseArg(testCase[i]) ? "opacity-100" : ""
                    }`}
                  >
                    Invalid Argument, See help
                  </span>
                </>
              </div>
              <code>
                <input
                  required
                  className={`input input-bordered transition-all w-full bg-base-100 ${
                    isValidTestCaseArg(testCase[i])
                      ? " "
                      : "text-error input-error"
                  }`}
                  placeholder={`value for ${param}`}
                  // defaultValue={JSON.stringify(testCase[i])}
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
        </>
      )}

      {expected !== undefined && (
        <>
          <div className="text-lg font-semibold">Expected Output:</div>
          <div className="bg-base-100 p-2 px-4 rounded-lg mb-2">
            <code>{JSON.stringify(expected)}</code>
          </div>
          <div className="text-lg font-semibold">Recived Output:</div>
          <div
            className={`bg-base-100 p-2 px-4 rounded-lg mb-2 text-error ${
              passed ? "text-success" : "text-error"
            }`}
          >
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
          <div className=" bg-base-100 p-2 px-4 rounded-lg">
            {logs.length >= MAX_LOGS && (
              <div className="  text-warning">
                <code className="">
                  Warning: number of logs exceeded limit ({MAX_LOGS})
                </code>
              </div>
            )}
            {logs.map((log, index) => (
              <div key={index} className="">
                {log}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
