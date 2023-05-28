import * as types from "@babel/types";

export const handleLifecycle = (eachArgument: types.CallExpression) => {
  const statements: types.Statement[] = [];
  if (eachArgument.arguments[0].type === "ObjectExpression") {
    eachArgument.arguments[0].properties.map((eachProperty: any) => {
      if (eachProperty.key.type === "Identifier" && eachProperty.key.name === "componentDidMount") {
        const callback = types.callExpression(
          types.identifier("useEffect"),
          [
            types.arrowFunctionExpression(
              [],
              eachProperty.body
            ),
            types.arrayExpression([]),
          ]
        );
        statements.push(types.expressionStatement(callback));
      }

      if (eachProperty.key.type === "Identifier" && eachProperty.key.name === "componentDidUpdate") {
        const callback = types.callExpression(
          types.identifier("useEffect"),
          [
            types.arrowFunctionExpression(
              [],
              eachProperty.body
            ),
          ]
        );
        statements.push(types.expressionStatement(callback));
      }

      if (eachProperty.key.type === "Identifier" && eachProperty.key.name === "componentWillUnmount") {
        const callback = types.callExpression(
          types.identifier("useEffect"),
          [
            types.arrowFunctionExpression(
              [],
              types.blockStatement([
                types.returnStatement(
                  types.arrowFunctionExpression(
                    [],
                    eachProperty.body
                  )
                )
              ]),
            ),
            types.arrayExpression([]),
          ]
        );
        statements.push(types.expressionStatement(callback));
      }
    });
  }

  return { blockStatement: statements }
}