import * as types from "@babel/types";

export const handleWithProps = (eachArgument: any) => {
  if (eachArgument.arguments[0].type === "ArrowFunctionExpression") {
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

    return { blockStatement: useMemoHook, returnProperty: ["properties"] };
  } else {
    const createCallback = types.callExpression(
      types.identifier("useMemo"),
      [
        types.arrowFunctionExpression(
          [],
          types.blockStatement([
            types.returnStatement(eachArgument.arguments[0]),
          ])
        ),
        types.arrayExpression([]),
      ]
    );

    const returnProperties: string[] = [];
    const useMemoHook = types.variableDeclaration("const", [
      types.variableDeclarator(
        types.objectPattern(
          eachArgument.arguments[0].properties.map((property: types.ObjectTypeProperty) => {
            if (property.key.type === "Identifier") {
              returnProperties.push(property.key.name);
              return types.objectProperty(
                types.identifier(property.key.name),
                types.identifier(property.key.name)
              );
            } else {
              returnProperties.push(property.key.value);
              return types.objectProperty(
                types.identifier(property.key.value),
                types.identifier(property.key.value)
              );
            }
          })
        ),
        createCallback
      ),
    ]);
    
    return { blockStatement: useMemoHook, returnProperty: returnProperties };
  }
}