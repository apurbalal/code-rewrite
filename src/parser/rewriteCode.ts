import { handleWithHandlers } from "./helpers/handleWithHandlers";
import * as types from "@babel/types";
import { parse } from "@babel/parser";
import { handleWithState } from "./helpers/handleWithState";
import traverse from "@babel/traverse";
import { print } from "recast";
import { handleWithProps } from "./helpers/handleWithProps";
import { handleCustomEnhance } from "./helpers/handleCustomEnhance";
import { handleWithGraphql } from "./helpers/handleWithGraphql";

export const generateReWrittenCode = (code: string) => {
  try {
    const ast = parse(code, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    });

    traverse(ast, {
      enter(path: any) {
        if (
          path.type === "CallExpression" &&
          path.node?.callee?.name === "compose"
        ) {
          // replace all child with hooks
          const parentName = path.parent.id.name;
          const parentNameHook = `use${parentName
            .charAt(0)
            .toUpperCase()}${parentName.slice(1)}`;

          path.parent.id.name = parentNameHook;

          const blockStatements: (types.BlockStatement | types.VariableDeclaration)[] = [];
          const returnProperties: string[] = [];

          path.node.arguments.forEach((eachArgument: any) => {
            if (eachArgument.type === "Identifier") {
              if (eachArgument.name.slice(0, 4) === "with") {
                const { blockStatement, returnProperty } = handleCustomEnhance(eachArgument.name);
                blockStatements.push(blockStatement);
                returnProperties.push(returnProperty);
              }
            }
            if (eachArgument.type === "CallExpression") {
              if (eachArgument.callee.name === "withHandlers") {
                eachArgument.arguments[0].properties.map(
                  (eachProperty: any) => {
                    const { blockStatement, returnProperty } = handleWithHandlers(eachProperty);
                    blockStatements.push(blockStatement);
                    returnProperties.push(returnProperty);
                  }
                );
              } else if (eachArgument.callee.name === "withState") {
                const { blockStatement, returnProperty } = handleWithState(eachArgument);
                blockStatements.push(blockStatement);
                returnProperties.push(...returnProperty);
              } else if (eachArgument.callee.name === "withGraphql") {
                const { blockStatement, returnProperty } = handleWithGraphql(eachArgument);
                blockStatements.push(blockStatement);
                returnProperties.push(...returnProperty);
              } else if (eachArgument.callee.name === "withProps" || eachArgument.callee.name === "mapProps") {
                const { blockStatement, returnProperty } = handleWithProps(eachArgument);
                blockStatements.push(blockStatement);
                returnProperties.push(...returnProperty);
              }
            }
          });

          const objectProperties = returnProperties.map(
            (eachName) => {
              return types.objectProperty(
                types.identifier(eachName),
                types.identifier(eachName)
              );
            }
          );
          const objectExpression = types.objectExpression(objectProperties);
          const returnStatement = types.returnStatement(objectExpression);

          const arrowFunction = types.arrowFunctionExpression(
            [],
            // replace
            types.blockStatement([
              ...blockStatements,
              returnStatement,
            ])
          );

          // replace current node with arrow function
          path.replaceWith(arrowFunction);
        }
      },
    });
    return print(ast);
  } catch (err) {
    console.log(err);
  }
};