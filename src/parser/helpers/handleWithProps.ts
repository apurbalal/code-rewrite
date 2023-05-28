import * as types from "@babel/types";

export const handleWithProps = (eachArgument: any) => {
  const createCallback = types.callExpression(
    types.identifier("useMemo"),
    [
      types.arrowFunctionExpression(
        [],
        eachArgument.arguments[0].body
      ),
      types.arrayExpression([]),
    ]
  );

  const useMemoHook = types.variableDeclaration("const", [
    types.variableDeclarator(
      types.identifier("properties"),
      createCallback
    ),
  ]);

  return { blockStatement: useMemoHook, returnProperty: ["properties"]};
}