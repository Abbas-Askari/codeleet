import React from "react";
import General from "./general";
import Template from "./template";
import Page2 from "./page2";

function Page1() {
  return (
    <>
      <div className="flex overflow-hidden flex-1 flex-col gap-4">
        <div className="bg-base-200 rounded-lg p-4 mt-4 flex gap-4">
          <General />
          <div className=" flex-1 overflow-hidden">
            <Template />
          </div>
        </div>
        <Help />
        <Page2 />
      </div>
    </>
  );
}

function Help() {
  return (
    <div className="collapse  collapse-arrow bg-base-200 rounded-lgs">
      <input type="checkbox" name="my-accordion-2" />
      <div className="collapse-title text-xl font-medium">Help</div>
      <div className="collapse-content overflow-auto">
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
            cases will be rejected. Submission will be rejected if it takes more
            than 1 second to run on the submission test cases. Submission test
            cases include the provided test cases and some additional test
            cases.
          </p>
          <p className="ml-3 mt-2">
            After submitting, you can view the results of the submission here.
            You can also view your submission history for this problem on the{" "}
            <code>"Attempts"</code> tab.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Page1;
