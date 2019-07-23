/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const SimpleIntentResolver = require('./simpleIntentResolver');
const IntentResolverManager = require('./intentResolverManager');
const IntentResolver = require('./intentResolver');

module.exports = {
  IntentResolverManager,
  IntentResolver,
  SimpleIntentResolver,
};
