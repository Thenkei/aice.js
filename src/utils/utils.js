/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

class Utils {
  static flatten(array) {
    return array.reduce((x, y) => x.concat(Array.isArray(y) ? Utils.flatten(y) : y), []);
  }
}

module.exports = Utils;
