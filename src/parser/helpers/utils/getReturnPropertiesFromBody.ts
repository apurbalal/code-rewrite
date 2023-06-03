import * as types from "@babel/types";
import { getReturnStatmentKeys } from "./getReturnStatmentKeys";
import { getObjectExpressionKeys } from "./getObjectExpressionKeys";

export const getReturnPropertiesFromBody = (body: types.Node): string[] => {
  if (body.type === "BlockStatement") {
    const returnStatement = body.body.find((eachBody) => eachBody.type === "ReturnStatement");
    if (returnStatement) {
      return getReturnStatmentKeys(returnStatement);
    }
  } else if (body.type === "ObjectExpression") {
    return getObjectExpressionKeys(body);
  }

  return [];
}