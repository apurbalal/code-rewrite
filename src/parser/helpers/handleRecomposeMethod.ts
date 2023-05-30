import { handleLifecycle } from "./handleLifecycle";
import { handleRenameProps } from "./handleRenameProps";
import { handleWithGraphql } from "./handleWithGraphql";
import { handleWithHandlers } from "./handleWithHandlers";
import { handleWithProps } from "./handleWithProps";
import { handleWithState } from "./handleWithState";
import * as types from "@babel/types";

type HandleRecomposeMethods = (eachArgument: any) => {
  blockStatement: types.VariableDeclaration;
  returnProperty: any[];
} | {
  blockStatement: types.Statement[];
} | undefined;

const handlersMap = new Map<string, HandleRecomposeMethods>([
  ["withState", handleWithState],
  ["withGraphql", handleWithGraphql],
  ["withProps", handleWithProps],
  ["mapProps", handleWithProps],
  ["renameProps", handleRenameProps],
  ["lifecycle", handleLifecycle],
  ["withHandlers", handleWithHandlers],
]);

export const handleRecomposeMethods = (eachArgument: any) => {
  const method = handlersMap.get(eachArgument.callee.name);
  if (!method) {
    return;
  }

  return method(eachArgument);
}