/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {
  Comparator,
  StrategyComparator,
  ExactStrategy,
  LevenshteinStrategy,
  DamerauLevenshteinStrategy,
} = require('./comparator');

const Utils = require('./utils');

const ContextMutator = require('./contextMutator');

const { ConditionEvaluator, ValueEvaluator } = require('./evaluator');

const Renderer = require('./rendering/renderer');

const openNLXSyntaxAdapter = require('./openNLXSyntaxAdapter');

module.exports = {
  Comparator,
  ContextMutator,
  ConditionEvaluator,
  StrategyComparator,
  ExactStrategy,
  LevenshteinStrategy,
  DamerauLevenshteinStrategy,
  Renderer,
  Utils,
  ValueEvaluator,
  openNLXSyntaxAdapter,
};
