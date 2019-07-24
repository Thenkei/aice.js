/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable no-param-reassign */
const { IntentResolverManager } = require('../intentsResolver');
const { OutputRenderingManager } = require('../outputRendering');
const { InputExpressionTokenizer, OutputExpressionTokenizer } = require('../streamTransformers/expression');
const { NERTokenizer } = require('../streamTransformers/tokenizer');

const { NERManager, SystemEntities } = require('../streamTransformers');

// TEST PURPOSE
const LANG = 'fr';

class AICE {
  constructor(settings) {
    this.settings = settings || {};
    this.inputs = [];
    this.outputs = [];
    // StreamsTransformers
    this.NERManager = new NERManager();
    this.NERTokenizer = new NERTokenizer(LANG, this.NERManager);
    this.InputExpressionTokenizer = new InputExpressionTokenizer();
    this.OutputExpressionTokenizer = new OutputExpressionTokenizer();

    this.IntentResolverManager = new IntentResolverManager(this.settings);
    this.OutputRenderingManager = new OutputRenderingManager(this.settings);

    SystemEntities.getSystemEntities().forEach(e => {
      this.NERManager.addNamedEntity(e);
    });
  }

  addEntity(namedEntity) {
    this.NERManager.addNamedEntity(namedEntity);
  }

  loadFromJSON(bot) {
    bot.intents.forEach(i => this.addIntent(i));
  }

  // eslint-disable-next-line no-unused-vars
  addIntent({ name, inputs, outputs, outputType, topic = '*', previous }, lang = 'fr') {
    // IntentsInputs
    inputs.forEach(i => this.addInput(lang, i.inputMessage, name));

    // IntentsOutputs
    const answers = outputs.map(o => {
      const tokenizedOutput = this.OutputExpressionTokenizer.tokenize(o.outputMessage);
      const answer = {
        lang,
        tokenizedOutput,
        preWSs: [],
        conditions: o.conditions,
        WSs: o.WSs,
      };

      return answer;
    });

    this.outputs.push({ intentid: name, outputType, answers });
  }

  // addIntent(lang, intentid, topic, previous, inputs, outputs, outputType) {
  //   // TODO tokenize inputs & outputs
  //   // Change intentResolvers & outputRenderers (intent based)
  //   // Handle botId
  //   const document = { lang, intentid, topic, previous, inputs, outputs, outputType };
  //   if (!this.inputs.includes(document)) {
  //     this.intents.push(document);
  //   }
  // }

  addInput(lang, input, intentid) {
    const tokenizedInput = this.InputExpressionTokenizer.tokenize(input);
    const document = { lang, input, tokenizedInput, intentid };
    if (!this.inputs.includes(document)) {
      this.inputs.push(document);
    }
  }

  addAnswer(lang, intentid, output, preWSs = [], conditions = [], WSs = []) {
    const tokenizedOutput = this.OutputExpressionTokenizer.tokenize(output);
    const answer = {
      lang,
      tokenizedOutput,
      preWSs,
      conditions,
      WSs,
    };

    const intentOutput = this.outputs.find(o => o.intentid === intentid);
    if (!intentOutput) {
      this.outputs.push({ intentid, outputType: 'random', answers: [answer] });
    } else if (!intentOutput.answers.includes(answer)) {
      intentOutput.answers.push(answer);
    }
  }

  train() {
    this.IntentResolverManager.train(this.inputs);
    this.OutputRenderingManager.train(this.outputs);
  }

  process(utterance, context) {
    // Streams Transformer
    // Tokenize the utterance and look for entities using NER
    const tokenizedUtterance = this.NERTokenizer.tokenize(utterance);

    // Intents Resolvers
    const result = this.IntentResolverManager.processBest(LANG, tokenizedUtterance);
    context = { ...context, ...result[0].context };

    // Output Rendering
    const answer = this.OutputRenderingManager.process(LANG, result, context);

    return {
      answer: (answer || {}).renderResponse,
      score: answer ? answer.score : 0,
      intent: (answer || {}).intentid,
      context,
    };
  }
}

module.exports = AICE;
