import * as types from "@babel/types";

export const handleRenameProps = (eachArgument: any) => {
  const returnProperties: string[] = [];
  // const {} = props;
  const blockStatement = types.variableDeclaration("const", [
    types.variableDeclarator(
      types.objectPattern(
        eachArgument.arguments[0].properties.map((property: types.ObjectProperty) => {
          if (property.value.type === "StringLiteral") {
            returnProperties.push(property.value.value);
            return types.objectProperty(
              // @ts-ignore
              types.identifier(property.key.name),
              types.identifier(property.value.value),
            );
          }
        })
      ),
      types.identifier("props")
    ),
  ]);
  
  return { blockStatement, returnProperty: returnProperties };
}