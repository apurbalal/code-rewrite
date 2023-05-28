import { createUseCallback } from "./helpers/createUseCallback";
import { createUseMutation } from "./helpers/createUseMutation";
import { createUseQuery } from "./helpers/createUseQuery";
import * as types from "@babel/types";
import { parse } from "@babel/parser";
import { createUseState } from "./helpers/createUseState";
import traverse from "@babel/traverse";
import { print } from "recast";

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
            if (eachArgument.callee.name === "withHandlers") {
              eachArgument.arguments[0].properties.map(
                (eachProperty: any) => {
                  const { blockStatement, returnProperty } = createUseCallback(eachProperty);
                  blockStatements.push(blockStatement);
                  returnProperties.push(returnProperty);
                }
              );
            }

            if (eachArgument.callee.name === "withState") {
              const { blockStatement, returnProperty } = createUseState(eachArgument);
              blockStatements.push(blockStatement);
              returnProperties.push(...returnProperty);
            }

            if (eachArgument.callee.name === "withGraphql") {
              const isMutationOperation =
                eachArgument.arguments[1].properties.find(
                  (eachProperty: any) => {
                    return eachProperty.key.name === "name";
                  }
                );
              if (isMutationOperation) {
                const { blockStatement, returnProperty } = createUseMutation(eachArgument);
                blockStatements.push(blockStatement);
                returnProperties.push(returnProperty);
              } else {
                const { bloackStatement, returnProperty }= createUseQuery(eachArgument);
                blockStatements.push(bloackStatement);
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