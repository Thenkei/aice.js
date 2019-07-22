/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const ValueEvaluator = require('../evaluator/valueEvaluator');

const ContextMutator = require('../contextMutator');

class Renderer {
  static render(tokenizedOutput, context) {
    let outputMesssage = '';
    for (const {
      value: { text, expression },
    } of tokenizedOutput) {
      if (expression) {
        // TYPE OUTPUT
        if (expression.type === 'OUTPUT') {
          if (expression.value) {
            const variableEvaluated = ValueEvaluator.evaluateValue(expression.value, context);
            ContextMutator.setToContext(context, {
              name: expression.contextName,
              value: variableEvaluated,
            });

            outputMesssage += variableEvaluated;
          } else {
            outputMesssage += ValueEvaluator.evaluateContext(expression.contextName, context);
          }

          // TYPE CODE
        } else if (expression.type === 'CODE') {
          ContextMutator.setToContext(context, {
            name: expression.contextName,
            value: ValueEvaluator.evaluateValue(expression.value, context),
          });

          // ERROR
        } else {
          throw new Error('Invalid OutputRendering Render - Unknown expression');
        }
      } else {
        outputMesssage += text;
      }
    }
    return outputMesssage;
  }
}

module.exports = Renderer;
