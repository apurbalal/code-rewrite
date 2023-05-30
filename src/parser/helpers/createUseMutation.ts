import * as types from "@babel/types";

export const createUseMutation = (eachArgument: any) => {
  const mutationName = eachArgument.arguments[1].properties.find(
    (eachProperty: any) => {
      return eachProperty.key.name === "name";
    }
  ).value.value;
  const options = types.objectExpression(
    eachArgument.arguments[1].properties.filter(
      (eachProperty: any) => {
        return eachProperty.key.name !== "name";
      }
    )
  )
  const mutationOptions = options.properties.length > 0 ? [eachArgument.arguments[0], options] : [eachArgument.arguments[0]];
  const mutation = types.variableDeclaration("const", [
    types.variableDeclarator(
      types.arrayPattern([types.identifier(mutationName)]),
      types.callExpression(types.identifier("useMutation"), mutationOptions)
    ),
  ]);
  return { blockStatement: mutation, returnProperty: mutationName};
};