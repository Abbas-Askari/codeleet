import { useState } from "react";
import { useSelector } from "react-redux";

export function Results({}) {
  const { error, logs, results, time, params, testCases } = useSelector(
    (state) => state.newProblem
  );

  const [tab, setTab] = useState(0);

  console.log({ results, error });

  let message, stack;
  if (error !== "") {
    [message, stack] = error.split(" \n ");
  }

  return (
    <label className="form-control w-full">
      <div className="label">
        <span className="label-text font-semibold text-lg">Results</span>
      </div>
      <div className="bg-base-200 h-full rounded-lg p-4">
        {!error && (
          <>
            <div role="tablist" className="tabs tabs-boxed flex-1 bg-base-300">
              {testCases.map((c, i) => (
                <a
                  key={i}
                  role="tab"
                  className={`tab ${tab === i ? "tab-active" : ""}`}
                  onClick={() => setTab(i)}
                >
                  Test Case {i + 1}
                  {testCases.length > 3 && (
                    <span
                      className="btn btn-circle btn-xs scale-60"
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
            <div className=" text-lg font-semibold">Arguments:</div>
            {params.map((param, i) => (
              <>
                <div key={i} className="">
                  {param}
                </div>
                <div
                  key={i + 0.5}
                  className="bg-base-300 p-2 px-4 rounded-lg mb-2"
                >
                  {testCases[tab][i] || "null"}
                </div>
              </>
            ))}
            <div className="text-lg font-semibold">Recived Output:</div>
            <div className="bg-base-300 p-2 px-4 rounded-lg mb-2">
              {JSON.stringify(results[tab]) || (
                <span className=" text-info text-sm italic">
                  Submit to see results
                </span>
              )}
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
            <div className=" bg-base-300 p-2 px-4 rounded-lg">
              {logs.length >= MAX_LOGS && (
                <div className=" bg-warning text-warning-content">
                  <code className="">
                    Warning: number of logs exceeded limit ({MAX_LOGS})
                  </code>
                </div>
              )}
              {logs.map((log, index) => (
                <div key={index} className="">
                  {JSON.stringify(log)}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </label>
  );
}
