import * as types from '@babel/types';

export const handleCustomEnhance = (name: string) => {
  const formattedName = name.charAt(0).toLowerCase() + name.slice(1);
  const parentHookName = `use${formattedName.charAt(0).toUpperCase()}${formattedName.slice(1)}`;

  const blockStatement = types.variableDeclaration('const', [
    types.variableDeclarator(
      types.identifier(formattedName),
      types.callExpression(
        types.identifier(parentHookName),
        []
      )
    )
  ]);

  return { blockStatement, returnProperty: formattedName };
}