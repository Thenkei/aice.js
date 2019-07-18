/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

class IntentResolver {
  constructor({ name, settings }) {
    if (!name) {
      throw new Error('Invalid IntentsResolver constructor - Missing name');
    }
    this.settings = settings || {};
    this.name = name;
  }

  /**
   * Base train function - Can be redefine to better fit needs (ML)
   */
  train(inputs) {
    this.inputs = inputs || [];
  }

  /**
   * Base process function - Need to be redefine in sub-class
   * @returns {Inputs} Inputs filtered by lang
   */
  process(lang) {
    return this.inputs.filter(i => i.lang === lang);
  }

  /**
   * ProcessBest Intent
   * @returns {Intent} Intent with the best score
   */
  processBest(lang, sentence) {
    return this.process(lang, sentence)[0];
  }
}

module.exports = IntentResolver;
