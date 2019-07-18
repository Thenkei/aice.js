/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable no-param-reassign */
const { IntentResolverManager } = require('../intentsResolver');
const { SimpleOutputRenderer } = require('../outputRendering');
const { InputExpressionTokenizer, OutputExpressionTokenizer } = require('../streamTransformers/expression');
const { NERTokenizer } = require('../streamTransformers/tokenizer');

const { NERManager, SystemEntities } = require('../streamTransformers');

// TEST PURPOSE
const LANG = 'fr';

class AICE {
  constructor(settings) {
    this.settings = settings || {};
    this.inputs = [];
    this.answers = [];
    // StreamsTransformers
    this.NERManager = new NERManager();
    this.NERTokenizer = new NERTokenizer(LANG, this.NERManager);
    this.InputExpressionTokenizer = new InputExpressionTokenizer();
    this.OutputExpressionTokenizer = new OutputExpressionTokenizer();

    this.IntentResolverManager = new IntentResolverManager(this.settings);
    this.OutputRenderingManager = new SimpleOutputRenderer(this.settings);

    SystemEntities.getSystemEntities().forEach(e => {
      this.NERManager.addNamedEntity(e);
    });
  }

  addEntity(namedEntity) {
    this.NERManager.addNamedEntity(namedEntity);
  }

  addIntent(lang, intentid, topic, previous, inputs, outputs, outputType) {
    // TODO tokenize inputs & outputs
    // Change intentResolvers & outputRenderers (intent based)
    // Handle botId
    const document = { lang, intentid, topic, previous, inputs, outputs, outputType };
    if (!this.inputs.includes(document)) {
      this.intents.push(document);
    }
  }

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
      intentid,
      preWSs,
      conditions,
      WSs,
    };
    if (!this.answers.includes(answer)) {
      this.answers.push(answer);
    }
  }

  train() {
    this.IntentResolverManager.train(this.inputs);
    this.OutputRenderingManager.train(this.answers);
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
    };
  }
}

module.exports = AICE;
