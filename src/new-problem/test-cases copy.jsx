// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { addTestCase, deleteTestCase, setTestCase } from "./new-problem-slice";

// export function TestCases({}) {
//   const [tab, setTab] = useState(0);
//   const { testCases, params } = useSelector((state) => state.newProblem);
//   const dispatch = useDispatch();

//   return (
//     <div className="">
//       <label className="form-control w-full">
//         <div className="label">
//           <span className="label-text font-semibold text-lg">Test Cases</span>
//         </div>
//       </label>
//       <div className="flex  items-center gap-1">
//         <div
//           role="tablist"
//           className="tabs tabs-boxed flex-1 flex overflow-auto"
//         >
//           {testCases.map((c, i) => (
//             <a
//               key={i}
//               role="tab"
//               className={`tab flex-[1_0_fit-content] ${
//                 tab === i ? "tab-active " : ""
//               }`}
//               onClick={() => setTab(i)}
//             >
//               Test Case {i + 1}
//               {testCases.length > 3 && (
//                 <span
//                   className="btn btn-circle btn-xs scale-60"
//                   onClick={() => {
//                     dispatch(deleteTestCase(i));
//                   }}
//                 >
//                   x
//                 </span>
//               )}
//             </a>
//           ))}
//         </div>
//         <span
//           className=" h-full btn btn-xs btn-primary btn-square "
//           onClick={() => dispatch(addTestCase())}
//         >
//           +
//         </span>
//       </div>
//       {params.length > 0 && testCases[tab] && (
//         <Case
//           {...{
//             params,
//             testCase: testCases[tab],
//             setTestCase: (testCase) => {
//               dispatch(setTestCase({ testCase, index: tab }));
//             },
//           }}
//         />
//       )}
//     </div>
//   );
// }

// export function Case({ testCase, params, setTestCase }) {
//   return (
//     <div className=" bg-base-200 p-4 rounded-lg mt-1">
//       {params.length > 0 &&
//         params.map((param, i) => (
//           <div key={i} className="">
//             <div className="lable">{param}</div>
//             <input
//               required
//               className="input input-bordered input-sm w-full "
//               placeholder={`value for ${param}`}
//               value={testCase[i]}
//               onChange={(e) => {
//                 setTestCase(
//                   testCase.map((p, j) => (j === i ? e.target.value : p))
//                 );
//               }}
//             />
//           </div>
//         ))}
//     </div>
//   );
// }
