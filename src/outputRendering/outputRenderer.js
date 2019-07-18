/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { ValueEvaluator, ConditionEvaluator, ContextMutator } = require('../utils/');

class OutputRenderer {
  constructor({ name, settings, answers }) {
    if (!name) {
      throw new Error('Invalid OutputRendering constructor - Missing name');
    }
    this.settings = settings || {};
    this.name = name;
    this.answers = answers || [];
  }

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
            ContextMutator.addToContext(context, {
              name: expression.contextName,
              value: variableEvaluated,
            });

            outputMesssage += variableEvaluated;
          } else {
            outputMesssage += ValueEvaluator.evaluateContext(expression.contextName, context);
          }

          // TYPE CODE
        } else if (expression.type === 'CODE') {
          ContextMutator.addToContext(context, {
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

  train(answers) {
    this.answers = answers || [];
  }

  // eslint-disable-next-line class-methods-use-this
  process() {
    throw new Error('Invalid OutputRendering - process() should be implemented in child class');
  }
}

class SimpleOutputRenderer extends OutputRenderer {
  constructor({ settings, answers }) {
    super({ settings, answers, name: 'simple-output-rendering' });
  }

  process(lang, intents = [], context) {
    const { intentid, score } = intents[0] || {}; // Best match for now
    const filtredAnswers = this.answers.filter(a => a.lang === lang && a.intentid === intentid);
    const res = filtredAnswers.filter(ans => {
      // Call pre-WSs
      // await ans.preWSs.forEach(ws => ws.call(context));

      // Check Conditions
      const conditionChecked = ans.conditions.reduce(
        (accumulator, condition) => accumulator && ConditionEvaluator.evaluateCondition(condition, context),
        true,
      );

      if (!conditionChecked) {
        return false;
      }

      // Call WSs
      // await ans.WSs.forEach(ws => ws.call(context));

      return true;
    });

    if (res && res.length > 0) {
      const rand = Math.floor(Math.random() * Math.floor(res.length));
      return { intentid, score, renderResponse: OutputRenderer.render(res[rand].tokenizedOutput, context) };
    }
    return filtredAnswers[0]; // NOT SURE ABOUT THAT
  }
}

module.exports = { SimpleOutputRenderer, OutputRenderer };
