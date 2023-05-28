import { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import dracula from "monaco-themes/themes/Dracula.json";

export const Editor = ({
  defaultValue,
  value,
  onChange,
  readOnly = false,
}: {
  defaultValue: string;
  value?: string;
  onChange?: (v?: string) => void;
  readOnly?: boolean;
}) => (
  <MonacoEditor
    width="100%"
    height={"100%"}
    defaultLanguage="javascript"
    theme="vs-dark"
    defaultValue={defaultValue}
    options={{
      fontSize: 16,
      minimap: { enabled: false },
      readOnly,
    }}
    onMount={(_, monaco) => {
      monaco.editor.defineTheme("dark-background", {
        base: "vs-dark",
        inherit: true,
        rules: dracula.rules,
        colors: {
          ...dracula.colors,
          "editor.background": "#000000",
          "editor.lineHighlightBackground": "#000000",
        },
      });
      monaco.editor.setTheme("dark-background");
    }}
    value={value}
    onChange={onChange}
  />
);
