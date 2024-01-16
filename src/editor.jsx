import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { useSelector, useDispatch } from "react-redux";
import { updateCode } from "./editorSlice";

function Editor({ className }) {
  const { code } = useSelector((state) => state.editor);
  const dispatch = useDispatch();

  return (
    <CodeMirror
      className={`${className} text-lg`}
      value={code}
      theme={vscodeDark}
      onChange={(code) => dispatch(updateCode(code))}
      height="100%"
      extensions={[javascript()]}
    />
  );
}

export default Editor;
