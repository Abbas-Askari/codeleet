import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { outputLocal } from "../utils";

function ProblemInfo({ className, problem }) {
  const [tab, setTab] = useState(0);
  const { loading } = useSelector((state) => state.editor);

  if (loading && tab !== 1) {
    setTab(1);
  }

  // useEffect() => {

  // }, [loading]);

  const tabContents = [
    <Description {...{ problem }} />,
    <Attempts {...{ problem }} />,
    "Disscussion about the problem goes here!",
  ];

  return (
    <>
      <div
        role="tablist"
        className={`tabs tabs-lifted ${className} flex flex-col items-stretch overflow-auto`}
      >
        <div role="tablist" className="tabs tabs-boxed ">
          <button
            role="tab"
            className={`tab ${tab === 0 ? "tab-active" : ""}`}
            onClick={() => setTab(0)}
          >
            Description
          </button>
          <button
            role="tab"
            className={`tab ${tab === 1 ? "tab-active" : ""}`}
            onClick={() => setTab(1)}
          >
            Attempts
          </button>
          <button
            role="tab"
            className={`tab ${tab === 2 ? "tab-active" : ""}`}
            onClick={() => setTab(2)}
          >
            Discussions
          </button>
        </div>
        <div
          role="tabpanel"
          className="bg-base-200 border-base-300 rounded-lg mt-2 flex-1 overflow-hidden"
        >
          {tabContents[tab]}
        </div>
      </div>
    </>
  );
}

function Discussion() {
  return <div></div>;
}

function Description({ problem }) {
  const testCases = JSON.parse(problem.inputs).slice(0, 3);

  console.log({ problem });
  return (
    <div className="p-6 flex flex-col gap-4 overflow-auto h-full">
      <div className="">
        <div className="text-xl font-bold">Description</div>
        <div className="">{problem.description}</div>
      </div>
      <div className="">
        <div className="text-xl font-bold">Examples</div>
        <div className="flex flex-col gap-2">
          {/* {testCases.map((input, index) => (
            <div key={index} className=" bg-base-300 p-4 rounded-lg">
              <div className="text-lg font-semibold">Example: {index + 1}</div>
              <div className="">
                <div className="font-semibold">Inputs: </div>
                {testCases[index].map((arg, i) => (
                  <div key={i} className="">
                    <code>
                      {<span className="">{problem.params[i]}</span>}:{" "}
                      {JSON.stringify(arg)}
                    </code>
                  </div>
                ))}
              </div>
              <div className="font-semibold">Required Result: </div>
              <code className="">
                Output: {JSON.stringify(output(problem, testCases[index]))}
              </code>
            </div>
          ))} */}

          {testCases.map((input, index) => (
            <div className="collapse collapse-arrow rounded-lg bg-base-300">
              <input type="checkbox" name="my-accordion-2" />
              <div className="collapse-title">Example: {index + 1}</div>
              <div className="collapse-content">
                <div className="p-4 bg-base-200">
                  <div className=" ">
                    <div className="font-semibold">Inputs: </div>
                    {testCases[index].map((arg, i) => (
                      <div key={i} className="">
                        <code>
                          {<span className="">{problem.params[i]}</span>}:{" "}
                          {JSON.stringify(arg)}
                        </code>
                      </div>
                    ))}
                  </div>
                  <div className="font-semibold">Required Result: </div>
                  <code className="">
                    Output:{" "}
                    {JSON.stringify(outputLocal(problem, testCases[index]))}
                  </code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Attempts({ problem }) {
  const [submissions, setSubmissions] = useState([]);
  const { loading } = useSelector((state) => state.editor);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) return;
    fetch(`http://localhost:3000/submissions/${problem._id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log({ data });
        setStatus("success");

        setSubmissions(data.submissions);
      })
      .catch((err) => {
        setError(err.message);
        setStatus("error");
      });
  }, [loading]);

  console.log({ submissions, status, error });

  if (status === "error") return <div className=" text-error">{error}</div>;

  if (status === "loading" || loading)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <span className=" loading loading-lg"></span>
      </div>
    );

  return (
    <div className="overflow-auto h-full">
      <table className="table table-pin-rows overflow-auto table-pin-cols table-xs lg:table-md">
        {/* head */}
        <thead>
          <tr className=" *:bg-base-200">
            <th></th>
            <th>Status</th>
            <th>Runtime</th>
            <th>Date</th>
            <th>Solution Length</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission, index) => (
            <tr key={index}>
              <th className=" bg-base-200">{index + 1}</th>
              <td
                className={`font-semibold md:text-sm ${
                  submission.status === "Accepted"
                    ? " text-success"
                    : "text-error"
                }`}
              >
                {submission.status}
              </td>
              <td>{submission.time}ms</td>
              <td>
                {new Date(submission.createdAt)
                  .toDateString()
                  .split(" ")
                  .slice(1)
                  .join(" ")}
              </td>
              <td>{submission.code.length} Characters</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProblemInfo;
