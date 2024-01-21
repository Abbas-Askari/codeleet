import { useDispatch, useSelector } from "react-redux";
import { isValidIdentifier } from "../utils";
import {
  addParam,
  deleteParam,
  updateDescription,
  updateFunctionName,
  updateParam,
  updateTitle,
} from "./new-problem-slice";

function General() {
  const { title, description, functionName, params } = useSelector(
    (state) => state.newProblem
  );
  const dispatch = useDispatch();

  return (
    <div className=" flex-1 flex flex-col items-stretch">
      <label className="form-control">
        <div className="label">
          <span className="label-text font-semibold text-lg">
            Enter a title for the problem
          </span>
        </div>
        <input
          type="text"
          value={title}
          placeholder="Type here"
          className="input input-bordered "
          onChange={(e) => dispatch(updateTitle(e.target.value))}
        />
      </label>

      <label className="form-control">
        <div className="label">
          <span className="label-text font-semibold text-lg">Description</span>
        </div>
        <textarea
          value={description}
          className="textarea textarea-bordered h-24 resize-none"
          placeholder="Bio"
          onChange={(e) => dispatch(updateDescription(e.target.value))}
        ></textarea>
      </label>

      <label className="form-control w-full" htmlFor="function-name">
        <div className="label">
          <span className="flex flex-1 items-center justify-between label-text font-semibold text-lg">
            <div className="">Function Name</div>
            <button
              type="button"
              onClick={() => {
                console.log(document.getElementById("arg-help"));
                document.getElementById("iden-help")?.showModal();
              }}
              className="btn bg-warning btn-xs btn-circle  text-warning-content"
            >
              ?
            </button>
          </span>
        </div>
        <code>
          <input
            id="function-name"
            type="text"
            name="functionName"
            placeholder="Type here"
            value={functionName}
            v
            onChange={(e) => {
              dispatch(updateFunctionName(e.target.value.trim()));
            }}
            className={`input input-bordered w-full ${
              isValidIdentifier(functionName) ? "" : "input-error"
            }`}
          />
        </code>
        <span
          className={` mt-2 text-error text-xs self-end opacity-0 ${
            !isValidIdentifier(functionName) ? "opacity-100" : ""
          } transition-opacity`}
        >
          Must be a valid identifier
        </span>
      </label>

      <label className="form-control w-full">
        <div className="label justify-start gap-2">
          <span className="label-text font-semibold text-lg">
            Function Parameters
          </span>
          <div
            className=" btn btn-xs btn-circle btn-primary"
            onClick={() => {
              dispatch(addParam());
            }}
          >
            +
          </div>
          <span
            className={` text-error text-xs self-end ml-auto opacity-0 ${
              params.some((param) => !isValidIdentifier(param))
                ? "opacity-100"
                : ""
            } transition-opacity`}
          >
            All params must be a valid identifiers
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {params.map((param, index) => (
            <div
              key={index}
              className="flex flex-row-reverse items-center gap-2 relative"
            >
              {params.length > 1 && (
                <div
                  className=" rounded-full bg-neutral-600 text-black flex items-center justify-center absolute right-0 top-0 text-[12px] translate-x-1/2 -translate-y-1/2 w-4 h-4"
                  onClick={() => {
                    dispatch(deleteParam(index));
                  }}
                >
                  x
                </div>
              )}
              <code className="w-full">
                <input
                  required
                  type="text"
                  placeholder="Type here"
                  className={`input input-bordered w-full  input-sm ${
                    isValidIdentifier(param) ? "" : "input-error"
                  }`}
                  value={param}
                  // check if the param is a valid variable name
                  // if not, add a class to the input to show an error

                  onChange={(e) => {
                    dispatch(updateParam({ index, param: e.target.value }));
                  }}
                />
              </code>
            </div>
          ))}
        </div>
      </label>
      <IdentifierHelp />
    </div>
  );
}

function IdentifierHelp() {
  return (
    <dialog id="iden-help" className="modal">
      <div className="modal-box w-fit">
        <h3 className="font-bold text-lg flex items-center justify-between text-info">
          Identifier
          <form method="dialog">
            <button className="btn btn-circle btn-xs">x</button>
          </form>
        </h3>

        <div className="">
          <div className="font-normal text-sm text-pretty">
            <p className=" mt-1">
              The function name and parameters must be valid identifiers.
              Following are the rules for identifiers:
              <ul>
                <li className=" list-item list-decimal list-inside">
                  The first character must be a letter, an underscore (_), or a
                  dollar sign ($).
                </li>
                <li className=" list-item list-decimal list-inside">
                  Subsequent characters may be letters, digits, underscores, or
                  dollar signs.
                </li>

                <li className=" list-item list-decimal list-inside">
                  Numbers are not allowed as the first character.
                </li>

                <li className=" list-item list-decimal list-inside">
                  The dollar sign and the underscore are considered to be
                  letters.
                </li>

                <li className=" list-item list-decimal list-inside">
                  Examples of valid identifiers are{" "}
                  <code className=" font-bold">Y</code>,{" "}
                  <code className=" font-bold">result</code>, and{" "}
                  <code className=" font-bold">_value</code>.
                </li>

                <li className=" list-item list-decimal list-inside">
                  Examples of invalid identifiers are{" "}
                  <code className=" font-bold">2abc</code>,{" "}
                  <code className=" font-bold">-value</code>, and{" "}
                  <code className=" font-bold">return</code>.
                </li>

                <li className=" list-item list-decimal list-inside">
                  Reserved words (like{" "}
                  <code className=" font-bold">return</code>,{" "}
                  <code className=" font-bold">case</code>, and{" "}
                  <code className=" font-bold">new</code>) cannot be used as
                  identifiers.
                </li>

                <li className=" list-item list-decimal list-inside">
                  Identifiers can be of any length, are case-sensitive and
                  cannot contain spaces.
                </li>
              </ul>
            </p>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export default General;
