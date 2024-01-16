import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Editor from "./editor";
import Nav from "./nav";
import ProblemInfo from "./problem-info";
import Output from "./output";

// import "codemirror/theme/vscode.css";

function App() {
  return (
    <>
      <Nav />
      <div className=" flex gap-4 flex-1 p-4">
        <ProblemInfo className=" flex-1 self-start " />
        <div className="flex flex-[2_2_0] flex-col gap-4">
          <Editor className="flex-1 rounded-xl overflow-hidden " />
          <Output className="flex-1" />
        </div>
      </div>
    </>
  );
}

export default App;
