<div align="center">
  <a href="https://opla.ai" target="_blank">
    <img src="https://raw.githubusercontent.com/Opla/opla/master/front/src/public/images/opla-avatar.png" alt="Opla" width="64">
  </a>
</div>
<h1 align="center">
  AIce.js
</h1>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#how-to-install">How To install</a> •
  <a href="#contributing">Contributing</a>
</p>

Artificial Intelligence Conversational Engine (AICE)

AIce is an opensource Javascript natural language processing (NLP) and conversational framework without any dependencies.

## Vision
We want to build a sustainable solution able to guess several languages, to understand the intention of the user, to give the best response in order to satisfy the user's intent. Also, we hope for providing both text-based conversational interface as well as form-based conversational interface. We desire to give a flexible NLP API to better fit various use case.

## Features
 - NLX syntax based
 - **Streams transformers** Tokens based architecture, so it can handle input streams
 - **Intents resolvers** For the moment, we only have kind of ExactScoring methods to detect the intent match.
 - **Outputs renderers** For the moment, we only have SimpleRenderer that handle callables, conditions and the rendering/generation of the answer.
 - Many comparators with a varieties of strategies (hamming, levenshtein, damerau-levenshtein...)
 - **Named Entity Recognition**, accepting similar strings for Enum Entities.
 - Rule based Named Entities. _Conception WIP_
 - And more !

## How to install
It can be installed directly from NPM to be integrated in node.js application.
```bash
    npm install aice.js
```

## NLX syntax (draft)
**INPUT**
```
TEXT            I'm a text
INLINE_CODE     {{ }}

SET             namevar='value'
SET             namevar=varName
SET             namevar=@entityName
SET             namevar=*
GET             namevar

ANY             *
ANYORNOTHING    ^
ENTITY          @name // modify currentContext as entityName=@entityName
```

**OUTPUT**
```
INLINE_CODE     {{ }} // rendered
CODE            << >> // not rendered
```

## Contributing
Please, see the [CONTRIBUTING.md](CONTRIBUTING.md) file.

### Contributor Code of Conduct
Please note that this project is released with a [Contributor Code of
Conduct](http://contributor-covenant.org/). By participating in this project you
agree to abide by its terms. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) file.

## More
This project is developed by Opla.

It is still a WIP, but you could contribute, test, report bugs.

How to pronounce it ?
"A-Ice" /eɪ/ /ʌɪs/
