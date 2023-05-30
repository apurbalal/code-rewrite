import * as types from "@babel/types";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import { print } from "recast";
import { convertComposeToHook } from "./convertComposeToHook";

export const generateReWrittenCode = (code: string) => {

  const ast = parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });
  const unmodifiedAst = JSON.parse(JSON.stringify(ast));

  traverse(ast, {
    enter(path: any) {
      if (
        path.type === "CallExpression" &&
        path.node?.callee?.name === "compose" && 
        path.parent.type === "VariableDeclarator"
      ) {
        // replace all child with hooks
        const parentName = path.parent.id.name.slice(0,4) === "with" ? path.parent.id.name.slice(4) : path.parent.id.name;
        const parentNameHook = `use${parentName
          .charAt(0)
          .toUpperCase()}${parentName.slice(1)}`;

        path.parent.id.name = parentNameHook;

        const { blockStatements, returnProperties } = convertComposeToHook(path);
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
          types.blockStatement([
            ...blockStatements,
            returnStatement,
          ])
        );

        path.replaceWith(arrowFunction);
      } else if (
        path.type === "CallExpression" &&
        path.node?.callee?.name === "compose" &&
        path.parent.type === "CallExpression"
      ) {
        const { blockStatements, returnProperties } = convertComposeToHook(path);

        const jsxElement = types.jsxElement(
          types.jsxOpeningElement(
            types.jsxIdentifier(path.parent.arguments[0].name),
            returnProperties.map(
              (eachName) => {
                return types.jsxAttribute(
                  types.jsxIdentifier(eachName),
                  types.jsxExpressionContainer(types.identifier(eachName))
                );
              }
            ),
          ),
          types.jsxClosingElement(
            types.jsxIdentifier(path.parent.arguments[0].name)
          ),
          [],
          true
        )

        const returnStatement = types.returnStatement(jsxElement);
        const arrowFunction = types.arrowFunctionExpression(
          [],
          types.blockStatement([
          ...blockStatements,
           returnStatement
          ])
        );

        path.parentPath.replaceWith(arrowFunction);
      }
    },
  });

  return { code: print(ast)?.code, prevAST:unmodifiedAst, newAST:ast };
};