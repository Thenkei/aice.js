/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { ConditionEvaluator, Renderer } = require('../utils');

class OutputRenderer {
  constructor({ name, settings, outputs }) {
    if (!name) {
      throw new Error('Invalid OutputRenderer constructor - Missing name');
    }
    this.settings = settings || {};
    this.name = name;
    this.outputs = outputs || [];
  }

  train(outputs) {
    this.outputs = outputs || [];
  }

  // eslint-disable-next-line class-methods-use-this
  process() {
    throw new Error('Invalid OutputRenderer - process() should be implemented in child class');
  }
}

class SimpleOutputRenderer extends OutputRenderer {
  constructor({ settings, outputs }) {
    super({ settings, outputs, name: 'simple-output-rendering' });
  }

  process(lang, intents, context) {
    const { intentid, score } = intents[0] || {}; // Best match for now

    // Retrieve output object for this intentid
    const output = this.outputs.find(o => o.intentid === intentid);
    if (!output) {
      return undefined;
    }

    // Retrieve all answers for this lang
    const filtredAnswers = output.answers.filter(a => a.lang === lang);
    const res = filtredAnswers.filter(ans => {
      const { preConditionsCallable, preRenderCallable } = ans;
      // Call pre-conditions callables
      const preCondCallableContext = typeof preConditionsCallable === 'function' ? preConditionsCallable(context) : {};
      // eslint-disable-next-line no-param-reassign
      context = { ...context, ...preCondCallableContext };

      // Check Conditions
      const conditionChecked = ans.conditions.reduce(
        (accumulator, condition) => accumulator && ConditionEvaluator.evaluate(condition, context),
        true,
      );

      if (!conditionChecked) {
        return false;
      }

      // Call pre-render callables
      const preRenderContext = typeof preRenderCallable === 'function' ? preRenderCallable(context) : {};
      // eslint-disable-next-line no-param-reassign
      context = { ...context, ...preRenderContext };

      // Final Check Context Evaluation
      return Renderer.isRenderable(ans.tokenizedOutput, context);
    });

    if (res && res.length > 0) {
      let renderResponse;
      switch (output.outputType) {
        case 'single':
          renderResponse = Renderer.render(res[0].tokenizedOutput, context);
          break;

        case 'multiple':
          renderResponse = res.reduce((acc, r) => acc + Renderer.render(r.tokenizedOutput, context), '');
          break;

        case 'random':
        default:
          renderResponse = Renderer.render(
            res[Math.floor(Math.random() * Math.floor(res.length))].tokenizedOutput,
            context,
          );
          break;
      }
      return { intentid, score, renderResponse };
    }
    return undefined;
  }
}

module.exports = { SimpleOutputRenderer, OutputRenderer };
