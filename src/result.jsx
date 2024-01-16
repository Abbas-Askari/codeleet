import React from "react";
import { useSelector } from "react-redux";

function Result() {
  const { error, logs, failed, time } = useSelector((state) => state.editor);

  let message, stack;
  if (error !== "") {
    [message, stack] = error.split(" \n ");
  }

  console.log({ logs, failed, error, time });

  if (!failed && !error) {
    return (
      <>
        <div className=" text-success font-bold text-lg my-2">
          All test cases passed!
        </div>
        <div className="ml-4">Took {time}ms to run all cases.</div>
      </>
    );
  }

  return (
    <div className="h-full">
      {failed && !error && (
        <>
          <div className="font-semibold text-lg mb-2">
            Failed test case: {failed.testCase}
          </div>
          <div className="">Input:</div>
          <div className="bg-base-200 p-2 px-4 rounded-lg mb-2">
            {JSON.stringify(failed.input)}
          </div>
          <div className="">Expected Output:</div>
          <div className="bg-base-200 p-2 px-4 rounded-lg mb-2">
            {JSON.stringify(failed.expected)}
          </div>
          <div className="">Recived Output:</div>
          <div className="bg-base-200 p-2 px-4 rounded-lg mb-2">
            {JSON.stringify(failed.recived)}
          </div>
        </>
      )}

      {error !== "" && (
        <div className=" text-error-content bg-error p-2">
          <div>{message}</div>
          <div className=" text-balance">{stack}</div>
        </div>
      )}

      {logs?.length > 0 && (
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
      )}
    </div>
  );
}

export default Result;
