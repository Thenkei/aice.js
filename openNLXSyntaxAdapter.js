/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 * Authors: Morgan Perre, Arnaud Moncel
 */

//----- Inline Syntax Adapter (Callable)
const callableRegex = new RegExp(/{{(.+?)\((.+?)\)}}|<<(.+?)\((.+?)\)>>/, 'g');
const paramsRegex = new RegExp(/ *`(.+?)` *,| *(.+?) *,| *(.+) */, 'g');
const variableRegex = new RegExp(/{\$(.+?)}| *\$(\w+) */, 'g');

const parseAdaptInlineSyntax = (text) => {
  const callables = [];
  let newInlineText = "";
  let indexInlineBuilder = 0;
  let matchCallable = callableRegex.exec(text);
  while (matchCallable) {
    const [, gService, gCallableParams, sService, sCallableParams ] = matchCallable;
    const callable = {
      service: gService || sService,
      parameters: [],
    };
    const callableParams = gCallableParams || sCallableParams;
    const callableIsOutput = !!gCallableParams;
    let matchParam = paramsRegex.exec(callableParams);

    while (matchParam) {
      matchParam.shift();
      const params = matchParam.find(m => m);
      let parameters = '';
      let matchVariable = variableRegex.exec(params);

      let index = 0;
      while (matchVariable) {
        const text = params.slice(index, matchVariable.index);
        parameters += text;

        matchVariable.shift();
        const variable = matchVariable.find(mp => mp);
        parameters += `{{${variable}}}`;

        index = variableRegex.lastIndex;
        matchVariable = variableRegex.exec(params);
      }

      const text = params.slice(index, params.length);
      parameters += text;

      callable.parameters.push(parameters);
      matchParam = paramsRegex.exec(callableParams);
    }

    // Rebuild InlineText - Text & WS variable
    newInlineText += text.slice(indexInlineBuilder, matchCallable.index);
    if (callableIsOutput) {
      newInlineText += `{{${callable.service}}}`;
    }
    indexInlineBuilder = matchCallable.index + matchCallable[0].length;

    callables.push(callable);
    matchCallable = callableRegex.exec(text);
  }
  // Rebuild InlineText - End of the text
  newInlineText += text.slice(indexInlineBuilder, text.length);

  return { callables, newInlineText };
}

//----- Outputs Adapter
const parseAdaptOutputsSyntax = (oldOutputs) => {
  const outputs = [];
  for (oldOutput of oldOutputs) {
    if (typeof oldOutput === "string") {
      // Without Condition
      const output = { conditions: [], WSs: [] };

      const parsed = parseAdaptInlineSyntax(oldOutput);
      output.outputMessage = parsed.newInlineText;
      output.WSs = parsed.callables;

      outputs.push(output);
    } else {
      // Conditions
      for (conditionOutput of oldOutput.children) {
        const output = { conditions: [], WSs: [] };
        const condition = { operande: 'eq', Lvalue: `{{${conditionOutput.name}}}`, Rvalue: conditionOutput.value };

        const parsed = parseAdaptInlineSyntax(conditionOutput.text);
        output.outputMessage = parsed.newInlineText;
        output.WSs = parsed.callables;
        output.conditions.push(condition);

        outputs.push(output);
      }
    }
  }
  return outputs;
}

//----- Inputs Adapter
const parseAdaptInputsSyntax = (oldInputs) => {
  const inputs = [];
  for (oldInput of oldInputs) {
    const input = { inputMessage: oldInput };

    inputs.push(input);
  }
  return inputs;
}

//----- Intent Adapter
const parseAdaptIntentSyntax = (oldIntents) => {
  const intents = [];
  for (oldIntent of oldIntents) {
    const { id, name, topic, previous, input, output, order } = oldIntent;

    const intent = { id, name, topic, previous, order, outputType: 'multiple' };
    intent.inputs = parseAdaptInputsSyntax(input);
    intent.outputs = parseAdaptOutputsSyntax(output);

    intents.push(intent);
  }
  return intents;
}

//----- Document OpenNLXSyntax Adapter
const parseAdaptOpenNLXSyntax = (oldBotDocument) => {
  const { name } = oldBotDocument;
  const botId = (oldBotDocument.intents[0] || {}).botId;
  const intents = parseAdaptIntentSyntax(oldBotDocument.intents);

  const document = { name, botId, timestamp: new Date(), intents };

  return document;
}

module.exports = parseAdaptOpenNLXSyntax;
