import { useState } from "react";

function ProblemInfo({ className, problem }) {
  const [tab, setTab] = useState(0);

  const tabContents = [
    problem.description,
    "Information about attempts goes here!",
    "Disscussion about the problem goes here!",
  ];

  return (
    <>
      <div role="tablist" className={`tabs tabs-lifted ${className}`}>
        <div role="tablist" className="tabs tabs-boxed">
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
          className="bg-base-200 border-base-300 rounded-lg p-6 mt-2"
        >
          {tabContents[tab]}
        </div>
      </div>
    </>
  );
}

export default ProblemInfo;
