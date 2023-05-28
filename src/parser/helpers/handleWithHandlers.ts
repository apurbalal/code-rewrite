import * as types from "@babel/types";

export const handleWithHandlers = (eachProperty: any) => {
  // Key Identifier Value Arrow function
  const methodName: string = eachProperty.key.name;
  const methodBody = eachProperty.value;
  const createCallback = types.callExpression(
    types.identifier("useCallback"),
    [methodBody.body, types.arrayExpression([])]
  );

  const useCallbackHook = types.variableDeclaration("const", [
    types.variableDeclarator(types.identifier(methodName), createCallback),
  ]);

  return { blockStatement: useCallbackHook, returnProperty: methodName};
};