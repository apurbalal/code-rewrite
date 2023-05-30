import * as types from "@babel/types";

const handleEachProperty = (eachProperty: any) => {
  const dependencies: types.ObjectPattern[] = eachProperty.value.params;

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

  return { blockStatement: useCallbackHook, returnProperty: methodName, dependencyProperties: dependencies };
}

export const handleWithHandlers = (eachArgument: any) => {
  const blockStatements: (types.BlockStatement | types.VariableDeclaration | types.Statement)[] = [];
  const returnProperties: string[] = [];
  eachArgument.arguments[0].properties.map(
    (eachProperty: any) => {
      const { blockStatement, returnProperty} = handleEachProperty(eachProperty);
      blockStatements.push(blockStatement);
      returnProperties.push(returnProperty);
    }
  );

  return { blockStatement: blockStatements, returnProperty: returnProperties };
};