import React, { useEffect } from "react";
import { Editor } from "@/component/Editor";
import { generateReWrittenCode } from "@/parser/rewriteCode";
import { useDebounce } from "usehooks-ts";
import { JSONTree } from "react-json-tree";
import { testCode } from "@/constant/testFile";

function HomePage() {
  const [code, setCode] = React.useState(testCode);
  const debouncedValue = useDebounce<string>(code, 500);
  const [result, setResult] = React.useState("");
  const [ast, setAst] = React.useState<any>(null);

  useEffect(() => {
    try {
      console.clear();
      const { code: resultCode, prevAST } =
        generateReWrittenCode(debouncedValue);

      setResult(resultCode ?? "");
      setAst(prevAST);
    } catch (error) {
      console.error(error);
      setResult("");
      setAst({});
    }
  }, [debouncedValue]);

  return (
    <div className="flex col vh100 vw100">
      <div className="divider" />
      <div className="flex row" style={{ margin: 8 }}>
        <p className="flex-1">Recompose code</p>
        <div className="flex flex-1" style={{ paddingLeft: 136 }}>
          <p className="flex-1">Hooks code(Generated)</p>
          <a href="https://github.com/apurbalal/code-rewrite">
            Repository link
          </a>
        </div>
      </div>
      <div className="divider" />
      <div className="flex row flex-1" style={{ flexGrow: 1 }}>
        <div className="flex flex-1 col">
          <div className="flex-1">
            <Editor
              defaultValue="// write code here"
              value={code}
              onChange={(v) => setCode(v ?? "")}
            />
          </div>
          <div
            style={{
              borderRight: "0.01px solid var(--divider-color)",
              marginRight: 13.5,
              padding: 16,
              paddingTop: 0,
            }}
          >
            <div
              style={{
                padding: 8,
                marginLeft: -16,
                marginRight: -14,
                position: "sticky",
                top: 16,
                background: "var(--background-color)",
                borderTop: "0.01px solid var(--divider-color)",
                borderBottom: "0.01px solid var(--divider-color)",
              }}
            >
              <p className="flex-1">AST Tree</p>
            </div>
            <div
              style={{
                overflow: "scroll",
                height: "30vh",
              }}
            >
              <JSONTree data={ast} theme={{ base00: "black" }} />
            </div>
          </div>
        </div>
        <div className="flex-1">
          <Editor defaultValue="// out will generate here" value={result} />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
