import React from "react";
import { useSelector } from "react-redux";
import { MAX_LOGS } from "../../constants";

function Result() {
  const { loading, error, logs, failed, time, comparision } = useSelector(
    (state) => state.editor
  );
  const { problem } = useSelector((state) => state.editor);
  const { params } = problem;

  let message, stack, testCase;
  if (error !== "") {
    [message, stack] = error.split(" \n ");
  }

  if (failed) {
    testCase = JSON.parse(failed.testCase);
  }

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center gap-2">
        Running test cases. Please wait.
        <span className=" loading "></span>
      </div>
    );
  }

  if (!failed && !error) {
    if (time > 1000) {
      return (
        <>
          <div className=" text-error font-bold text-lg my-2">
            Failed:
            <span className="ml-4 font-medium">Time Limit Exceeded.</span>
          </div>
        </>
      );
    } else if (time >= 0) {
      return (
        <>
          <div className=" text-success font-bold text-lg my-2">
            All test cases passed!
          </div>
          <div className="text-lg font-semibold">Time:</div>
          <div className="bg-base-300 p-2 px-4 rounded-lg mb-2">
            <code>{time} ms</code>
          </div>
          <div className="text-lg font-semibold">
            Your submission is better than:
          </div>
          <div className="bg-base-300 p-2 px-4 rounded-lg mb-2">
            <code>
              {((comparision[0].beats * 100) / comparision[0].total).toFixed(1)}
              %
            </code>
          </div>
          <div className="text-lg font-semibold">
            Total Correct Submission for this problem:
          </div>
          <div className="bg-base-300 p-2 px-4 rounded-lg mb-2">
            <code>{comparision[0].total}</code>
          </div>
          <div className="text-lg font-semibold">Average time:</div>
          <div className="bg-base-300 p-2 px-4 rounded-lg mb-2">
            <code>{comparision[0].time?.toFixed(1)} ms</code>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="mt-4 mx-4">
            <div className=" font-bold text-xl text-info">
              Click submit to submit this code.
            </div>
            <p className="ml-3 mt-1">
              You can run the code on the provided test cases only by clicking{" "}
              <code>"Run"</code> .
            </p>
            <p className="ml-3 mt-2">
              Make sure that you have run the code on the provided test cases
              before submitting. Any code that fails to run on the provided test
              cases will be rejected. Submission will be rejected if it takes
              more than 1 second to run on the submission test cases. Submission
              test cases include the provided test cases and some additional
              test cases.
            </p>
            <p className="ml-3 mt-2">
              After submitting, you can view the results of the submission here.
              You can also view your submission history for this problem on the{" "}
              <code>"Attempts"</code> tab.
            </p>
          </div>
        </>
      );
    }
  }

  return (
    <div className="h-full overflow-auto">
      {failed && !error && (
        <>
          <div className="font-bold text-lg mb-2  text-error">
            Failed test case: {failed.testCase}
          </div>

          <div className=" text-lg font-semibold">Arguments:</div>
          {params.map((param, i) => (
            <>
              <code key={i} className="">
                {param}
              </code>
              <div
                key={i + 0.5}
                className="bg-base-300 p-2 px-4 rounded-lg mb-2"
              >
                <code>{JSON.stringify(failed.input[i]) || "null"}</code>
              </div>
            </>
          ))}

          <div className="text-lg font-semibold">Expected Output:</div>
          <div className="bg-base-300 p-2 px-4 rounded-lg mb-2">
            <code>{JSON.stringify(failed.expected)}</code>
          </div>
          <div className="text-lg font-semibold">Recived Output:</div>
          <div className="bg-base-300 p-2 px-4 rounded-lg mb-2 text-error">
            <code>{JSON.stringify(failed.recived)}</code>
          </div>
          {/* <div className="">Recived Output:</div>
          <div className="bg-base-200 p-2 px-4 rounded-lg mb-2">
            {JSON.stringify(failed.recived)}
          </div> */}
        </>
      )}

      {error !== "" && (
        <div className=" text-error-content bg-error p-2">
          <div>{message}</div>
          <div className=" text-balance">{stack}</div>
        </div>
      )}

      {/* {logs?.length > 0 && (
        <>
          <div className="font-semibold text-lg">Logs: </div>
          <div className=" bg-base-200 p-2 px-4 rounded-lg">
            {logs.map((log, index) => (
              <div key={index} className="">
                {log}
              </div>
            ))}
          </div>
        </>
      )} */}

      {logs?.length > 0 && (
        <>
          <div className="font-semibold text-lg">Logs: </div>
          <div className=" bg-base-300 p-2 px-4 rounded-lg overflow-auto">
            {logs.length >= MAX_LOGS && (
              <div className=" bg-warning text-warning-content">
                <code className="">
                  Warning: number of logs exceeded limit ({MAX_LOGS})
                </code>
              </div>
            )}
            {logs.map((log, index) => (
              <div key={index} className="">
                <code className="">{log}</code>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Result;
