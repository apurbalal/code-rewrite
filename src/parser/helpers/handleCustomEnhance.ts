import * as types from '@babel/types';

export const handleCustomEnhance = (name: string) => {
  const parentHookName = `use${name.charAt(0).toUpperCase()}${name.slice(1)}`;

  const blockStatement = types.variableDeclaration('const', [
    types.variableDeclarator(
      types.identifier(name),
      types.callExpression(
        types.identifier(parentHookName),
        []
      )
    )
  ]);

  return { blockStatement, returnProperty: name };
}