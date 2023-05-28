import React, { useCallback, useEffect } from "react";
import { Editor } from "@/component/Editor";
import { generateReWrittenCode } from "@/parser/rewriteCode";
import { useDebounce } from "usehooks-ts";

function HomePage() {
  const [code, setCode] = React.useState(
    `function add(a, b) {\n  return a + b;\n}`
  );
  const debouncedValue = useDebounce<string>(code, 500);
  const [result, setResult] = React.useState("");

  useEffect(() => {
    try {
      const resp = generateReWrittenCode(debouncedValue);
      setResult(resp?.code ?? "");
    } catch (error) {
      console.error(error);
    }
  }, [debouncedValue]);

  return (
    <div className="flex col vh100 vw100">
      <div className="divider" />
      <div className="flex row" style={{ margin: 16 }}>
        <p className="flex-1">Original code</p>
        <p className="flex-1">Re-written code</p>
      </div>
      <div className="divider" />
      <div className="flex row flex-1" style={{ flexGrow: 1 }}>
        <div className="flex-1">
          <Editor
            defaultValue="// write code here"
            value={code}
            onChange={(v) => setCode(v ?? "")}
          />
        </div>
        <div className="flex-1">
          <Editor defaultValue="// out will generate here" value={result} />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
