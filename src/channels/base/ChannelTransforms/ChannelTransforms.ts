export interface Transforms<Input, Output, JsonInput, JsonOutput> {
  inputToJson: (input: Input) => JsonInput;
  jsonToInput: (json: JsonInput) => Input;
  outputToJson: (output: Output) => JsonOutput;
  jsonToOutput: (json: JsonOutput) => Output;
}

export function makeTransforms<Input, Output, JsonInput, JsonOutput>(
  transforms?: Partial<Transforms<Input, Output, JsonInput, JsonOutput>>,
): Transforms<Input, Output, JsonInput, JsonOutput> {
  return {
    inputToJson: (input) =>
      input as JsonInput extends Input ? JsonInput : never,
    jsonToInput: (json) => json as Input extends JsonInput ? Input : never,
    outputToJson: (output) =>
      output as JsonOutput extends Output ? JsonOutput : never,
    jsonToOutput: (json) => json as Output extends JsonOutput ? Output : never,
    ...transforms,
  };
}
