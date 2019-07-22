/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { ConditionEvaluator, Renderer } = require('../utils');

class OutputRenderer {
  constructor({ name, settings, answers }) {
    if (!name) {
      throw new Error('Invalid OutputRendering constructor - Missing name');
    }
    this.settings = settings || {};
    this.name = name;
    this.answers = answers || [];
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
      // const renderedParameter = ws.parameters.map(p => OutputRenderer.render(p, context);
      // await ans.preWSs.forEach(ws => WebServiceHandler.handle(ws, renderedParameter, context);

      // Check Conditions
      const conditionChecked = ans.conditions.reduce(
        (accumulator, condition) => accumulator && ConditionEvaluator.evaluate(condition, context),
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
      return { intentid, score, renderResponse: Renderer.render(res[rand].tokenizedOutput, context) };
    }
    return filtredAnswers[0]; // NOT SURE ABOUT THAT
  }
}

module.exports = { SimpleOutputRenderer, OutputRenderer };
