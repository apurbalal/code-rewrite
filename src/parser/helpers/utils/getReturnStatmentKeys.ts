import * as types from "@babel/types";

export const getReturnStatmentKeys = (body: types.Node): string[] => {
  if (body.type === "ReturnStatement") {
    if (body.argument?.type === "ObjectExpression") {
      return body.argument.properties.map((eachProperty) => {
        if (eachProperty.type === "ObjectProperty") {
          if (eachProperty.key.type === "Identifier") {
            return eachProperty.key.name;
          } else {
            return "";
          }
        } else {
          return "";
        }
      }).filter((eachName) => eachName !== "");
    } else if (body.argument?.type === "Identifier") {
      return [body.argument.name];
    } else {
      return [];
    }
  }
  return [];
}