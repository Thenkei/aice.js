/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Entity class
 * All NamedEntity extracted should extends this class
 */

class Entity {
  constructor({ match, confidence, type, name, resolution, start, end }) {
    this.match = match;
    this.confidence = confidence;
    this.type = type;
    this.name = name;
    this.resolution = resolution;
    this.start = start;
    this.end = end;
  }
}

module.exports = Entity;
