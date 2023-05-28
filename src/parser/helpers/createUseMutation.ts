import * as types from "@babel/types";

export const createUseMutation = (eachArgument: any) => {
  const mutationName = eachArgument.arguments[1].properties.find(
    (eachProperty: any) => {
      return eachProperty.key.name === "name";
    }
  ).value.value;
  const mutation = types.variableDeclaration("const", [
    types.variableDeclarator(
      types.arrayPattern([types.identifier(mutationName)]),
      types.callExpression(types.identifier("useMutation"), [
        types.identifier(eachArgument.arguments[0].name),
        // TODO Think about how to handle this
        eachArgument.arguments[1],
      ])
    ),
  ]);
  return { blockStatement: mutation, returnProperty: mutationName};
};