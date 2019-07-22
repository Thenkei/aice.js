/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { Comparator } = require('./comparator');
const { StrategyComparator, ExactStrategy, LevenshteinStrategy, DamerauLevenshteinStrategy } = require('./strategies');

module.exports = {
  Comparator,
  StrategyComparator,
  ExactStrategy,
  LevenshteinStrategy,
  DamerauLevenshteinStrategy,
};
