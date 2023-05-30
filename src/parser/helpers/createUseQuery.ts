import * as types from "@babel/types";

export const createUseQuery = (eachArgument: any) => {
  const prefix = eachArgument.arguments[0].name.slice(
    0,
    eachArgument.arguments[0].name.length - 8
  );
  const dataName = `data${prefix}`;
  const loadingName = `loading${prefix}`;
  const errorName = `error${prefix}`;

  // @ts-expect-error Fix Type
  const objectProperties = [];
  eachArgument.arguments[1].properties.forEach((each: any) => {
    const arrowFunction: types.ArrowFunctionExpression = each.value;

    if (arrowFunction.body.type === "BlockStatement") {
      const returnStatement = arrowFunction.body.body.find(each => {
        return (each.type === "ReturnStatement");
      });

      // @ts-expect-error Fix type
      const returnStatementArgument = returnStatement?.argument;
      if (returnStatementArgument.type === "ObjectExpression") {
        /*
          return { Object } => { Object }
        */
        objectProperties.push(
          ...returnStatementArgument.properties
        );
      } else if (returnStatementArgument.type === "ConditionalExpression") {
        /*
          return condition ? Object : Object => ...(condition ? Object : Object)
        */
        objectProperties.push(
          types.spreadElement(returnStatementArgument)
        );
      }
    } else if (arrowFunction.body.type === "ObjectExpression") {
      objectProperties.push(
        ...arrowFunction.body.properties
      )
    } else if (arrowFunction.body.type === "LogicalExpression") {
      objectProperties.push(types.objectProperty(
        types.identifier(each.key.name),
        arrowFunction.body
      ));
    } else if (arrowFunction.body.type === "Identifier") {
      objectProperties.push(types.objectProperty(
        types.identifier(each.key.name),
        types.identifier(arrowFunction.body.name)
      ));
    }
  });

  const graphqlHook = types.variableDeclaration("const", [
    types.variableDeclarator(
      types.objectPattern([
        types.objectProperty(
          types.identifier("data"),
          types.identifier(dataName)
        ),
        types.objectProperty(
          types.identifier("loading"),
          types.identifier(loadingName)
        ),
        types.objectProperty(
          types.identifier("error"),
          types.identifier(errorName)
        ),
      ]),
      types.callExpression(types.identifier("useQuery"), [
        types.identifier(eachArgument.arguments[0].name),
        types.objectExpression(
          // @ts-expect-error Fix type
          objectProperties
        ),
      ])
    ),
  ]);
  return { bloackStatement: graphqlHook, returnProperty: [dataName, loadingName, errorName] };
};