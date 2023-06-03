import * as types from "@babel/types";
import { getReturnPropertiesFromBody } from "./utils/getReturnPropertiesFromBody";

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

    const returnProperties = getReturnPropertiesFromBody(eachArgument.arguments[0].body);

    const blockStatement = types.variableDeclaration("const", [
      types.variableDeclarator(
        types.objectPattern(
          returnProperties.map((eachName) => {
            return types.objectProperty(
              types.identifier(eachName),
              types.identifier(eachName)
            );
          })
        ),
        createCallback
      ),
    ]);

    return { blockStatement, returnProperty: returnProperties, dependency: eachArgument.arguments[0].params.properties };
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
    const blockStatement = types.variableDeclaration("const", [
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
    
    return { blockStatement, returnProperty: returnProperties };
  }
}