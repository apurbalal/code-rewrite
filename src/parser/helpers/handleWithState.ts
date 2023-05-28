import * as types from "@babel/types";

export const handleWithState = (eachArgument: any) => {
  // replace with useState
  const stateName: string = eachArgument.arguments[0].value;
  const stateUpdate: string = eachArgument.arguments[1].value;
  const defaultValue = eachArgument.arguments[2];

  // create const [state, setState] = useState(defaultValue)
  const stateHook = types.variableDeclaration("const", [
    types.variableDeclarator(
      types.arrayPattern([
        types.identifier(stateName),
        types.identifier(stateUpdate),
      ]),
      types.callExpression(types.identifier("useState"), [defaultValue])
    ),
  ]);

  return { blockStatement: stateHook, returnProperty: [stateName,stateUpdate] };
};