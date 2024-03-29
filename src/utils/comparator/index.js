/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { Comparator } = require('./comparator');
const { UnorderComparator, LazzyUnorderComparator } = require('./unorderComparator');
const {
  StrategyWordComparator,
  ExactStrategy,
  LevenshteinStrategy,
  DamerauLevenshteinStrategy,
} = require('./wordsComparator');

module.exports = {
  Comparator,
  UnorderComparator,
  LazzyUnorderComparator,
  StrategyWordComparator,
  ExactStrategy,
  LevenshteinStrategy,
  DamerauLevenshteinStrategy,
};
