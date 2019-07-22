/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { SimpleOutputRenderer } = require('./outputRenderer');

class OutputRenderingManager {
  constructor({ settings }) {
    this.settings = settings || {};
    this.outputsRenderer = [];
    if (this.settings.outputsRenderer && this.settings.outputsRenderer.length > 1) {
      this.outputsRenderer = this.settings.outputsRenderer;
    } else {
      this.outputsRenderer = [new SimpleOutputRenderer({ settings: this.settings })];
    }
  }

  /**
   * Train all IntentsResolvers
   * @returns {Intents}
   */
  train(outputs) {
    this.outputsRenderer[0].train(outputs);
    // this.outputsRenderer.forEach(or => or.train(outputs));
  }

  process(lang, intents = [], context) {
    // Will need some more mechanics before using multiple OutputRenderer techniques
    return this.outputsRenderer[0].process(lang, intents, context);
  }
}

module.exports = OutputRenderingManager;
