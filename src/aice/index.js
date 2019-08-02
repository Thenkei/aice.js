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

  getAllEntities() {
    return this.NERManager.entities;
  }

  normalizeInputEntities(lang, inputText) {
    return this.NERManager.normalizeEntityUtterance(lang, inputText);
  }

  addEntity(namedEntity) {
    if (this.NERManager.entities.filter(e => e.name === namedEntity.name).length === 0)
      this.NERManager.addNamedEntity(namedEntity);
  }

  addInput(lang, intentid, input) {
    if (!lang || !input || !intentid) {
      throw new Error('AICE addInput - Has some missing mandatory parameters');
    }
    const tokenizedInput = this.InputExpressionTokenizer.tokenize(input);
    const document = { lang, input, tokenizedInput, intentid };

    if (this.inputs.filter(i => i.lang === lang && i.input === input && i.intentid === intentid).length === 0) {
      this.inputs.push(document);
    }
  }

  addOutput(lang, intentid, output, preConditionsCallable = () => {}, conditions = [], preRenderCallable = () => {}) {
    if (!lang || !output || !intentid) {
      throw new Error('AICE addOutput - Has some missing mandatory parameters');
    }
    const tokenizedOutput = this.OutputExpressionTokenizer.tokenize(output);
    const answer = {
      lang,
      output,
      tokenizedOutput,
      preConditionsCallable,
      conditions,
      preRenderCallable,
    };

    const intentOutput = this.outputs.find(o => o.intentid === intentid);
    if (!intentOutput) {
      this.outputs.push({ intentid, outputType: 'random', answers: [answer] });
    } else if (intentOutput.answers.filter(a => a.lang === lang && a.output === output).length === 0) {
      intentOutput.answers.push(answer);
    }
  }

  clear() {
    this.inputs = [];
    this.outputs = [];
  }

  train() {
    this.IntentResolverManager.train(this.inputs);
    this.OutputRenderingManager.train(this.outputs);
  }

  /**
   * Process an utterance to fully andersand it.
   * The process is:
   * - Streams Transformer: Tokenize the utterance and look for entities using NER
   * - Intents Resolvers: Look for the user intention
   * - Output Rendering: Handles callables, conditions and the rendering/generation of the answer.
   * @param {String} utterance Text writen by the user
   * @param {Object} context The context object
   * @param {String} lang Default lang is french.
   * @returns {reponse} An object containing: answer, score, intent, context
   */
  async process(utterance, context = {}, lang = LANG) {
    // Streams Transformer
    // Tokenize the utterance and look for entities using NER
    const tokenizedUtterance = this.NERTokenizer.tokenize(utterance);

    // Intents Resolvers
    const result = this.IntentResolverManager.processBest(lang, tokenizedUtterance);
    context = { ...context, ...result[0].context };

    // Output Rendering
    const answer = await this.OutputRenderingManager.process(lang, result, context);

    return {
      answer: (answer || {}).renderResponse,
      score: answer ? answer.score : 0,
      intent: (answer || {}).intentid,
      context: (answer && answer.context) || context,
    };
  }
}

module.exports = AICE;
