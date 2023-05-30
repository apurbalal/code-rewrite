import { handleCustomEnhance } from "./helpers/handleCustomEnhance";
import { handleRecomposeMethods } from "./helpers/handleRecomposeMethod";
import * as types from "@babel/types";

export const convertComposeToHook = (path: any) => {
  const blockStatements: (types.BlockStatement | types.VariableDeclaration | types.Statement)[] = [];
  const returnProperties: string[] = [];

  path.node.arguments.forEach((eachArgument: any) => {
    if (eachArgument.type === "Identifier") {
      if (eachArgument.name.slice(0, 4) === "with") {
        const { blockStatement, returnProperty } = handleCustomEnhance(eachArgument.name.slice(4));
        blockStatements.push(blockStatement);
        returnProperties.push(returnProperty);
      }
    }

    if (eachArgument.type === "CallExpression") {
      // handle recompose methods
      // Move withGraphql to 
      // @ts-expect-error Fix returnProperty
      const { blockStatement, returnProperty = [] } = handleRecomposeMethods(eachArgument) || {};
      if (blockStatement) {
        if (Array.isArray(blockStatement)) {
          blockStatements.push(...blockStatement);
        } else {
          blockStatements.push(blockStatement);
        }
      }
      if (returnProperty) {
        returnProperties.push(...returnProperty);
      }
    }
  });

  return { blockStatements, returnProperties };
}