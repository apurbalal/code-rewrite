import * as types from "@babel/types";

export const getObjectExpressionKeys = (objectExpression: types.ObjectExpression): string[] => {
  return objectExpression.properties.map((eachProperty) => {
    if (eachProperty.type === "ObjectProperty") {
      if (eachProperty.key.type === "Identifier") {
        return eachProperty.key.name;
      } else {
        return "";
      }
    } else if (eachProperty.type === "ObjectMethod") {
      return "";
    } else {
      return "";
    }
  }).filter((eachName) => eachName !== "");
}