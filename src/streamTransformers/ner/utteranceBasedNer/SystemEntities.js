/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const RegExpEntity = require('./RegExpEntity');

const SYSTEM_SCOPE = 'system';

const EmailRegExpEntity = new RegExpEntity({
  id: '@email',
  scope: SYSTEM_SCOPE,
  name: 'email',
  regex: /\b(\w[-._\w]*\w@\w[-._\w]*\w\.\w{2,3})\b/gi,
});
const UrlRegExpEntity = new RegExpEntity({
  id: '@url',
  scope: SYSTEM_SCOPE,
  name: 'url',
  regex: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi,
});
const EmojiRegExpEntity = new RegExpEntity({
  id: '@emoji',
  scope: SYSTEM_SCOPE,
  name: 'emoji',
  regex: /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi,
});

const PhoneNumberRegExpEntity = new RegExpEntity({
  id: '@phonenumber',
  scope: SYSTEM_SCOPE,
  name: 'phonenumber',
  regex: /([0-9]{10})/gi,
});

const getSystemEntities = () => [EmailRegExpEntity, UrlRegExpEntity, EmojiRegExpEntity, PhoneNumberRegExpEntity];

module.exports = {
  EmailRegExpEntity,
  UrlRegExpEntity,
  EmojiRegExpEntity,
  PhoneNumberRegExpEntity,
  getSystemEntities,
};
