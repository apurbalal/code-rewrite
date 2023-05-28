import { createUseMutation } from "./createUseMutation";
import { createUseQuery } from "./createUseQuery";

export const handleWithGraphql = (eachArgument: any) => {
  const isMutationOperation =
    eachArgument.arguments[1].properties.find(
      (eachProperty: any) => {
        return eachProperty.key.name === "name";
      }
    );
  if (isMutationOperation) {
    const { blockStatement, returnProperty } = createUseMutation(eachArgument);
    return { blockStatement, returnProperty: [returnProperty] };
  } else {
    const { bloackStatement, returnProperty } = createUseQuery(eachArgument);
    return { blockStatement: bloackStatement, returnProperty: returnProperty };
  }
}