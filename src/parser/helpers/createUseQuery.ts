import * as types from "@babel/types";

export const createUseQuery = (eachArgument: any) => {
  const prefix = eachArgument.arguments[0].name.slice(
    0,
    eachArgument.arguments[0].name.length - 8
  );
  const dataName = `data${prefix}`;
  const loadingName = `loading${prefix}`;
  const errorName = `error${prefix}`;

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
        eachArgument.arguments[1],
      ])
    ),
  ]);
  return { bloackStatement: graphqlHook, returnProperty: [dataName, loadingName, errorName] };
};