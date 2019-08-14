/*
 *   stemming of French words, based off this algorithm
 *   http://snowball.tartarus.org/algorithms/french/stemmer.html
 */

const caseAnce = ['ance', 'iqUe', 'isme', 'able', 'iste', 'eux', 'ances', 'iqUes', 'ismes', 'ables', 'istes'];
const caseAtrice = ['atrice', 'ateur', 'ation', 'atrices', 'ateurs', 'ations'];
const caseLogie = ['logie', 'logies'];
const caseUsion = ['usion', 'ution', 'usions', 'utions'];
const caseEnce = ['ence', 'ences'];
const caseEment = ['ement', 'ements'];
const caseIte = ['ité', 'ités'];
const caseIf = ['if', 'ive', 'ifs', 'ives'];
const caseEaux = ['eaux'];
const caseAux = ['aux'];
const caseEuse = ['euse', 'euses'];
const caseIssement = ['issement', 'issements'];
const caseAmment = ['amment'];
const caseEmment = ['emment'];
const caseMent = ['ment', 'ments'];

const suffixes = [
  ...caseAnce,
  ...caseAtrice,
  ...caseLogie,
  ...caseUsion,
  ...caseEnce,
  ...caseEment,
  ...caseIte,
  ...caseIf,
  ...caseEaux,
  ...caseAux,
  ...caseEuse,
  ...caseIssement,
  ...caseAmment,
  ...caseEmment,
  ...caseMent,
];

const iVerbes = [
  'îmes',
  'ît',
  'îtes',
  'i',
  'ie',
  'ies',
  'ir',
  'ira',
  'irai',
  'iraIent',
  'irais',
  'irait',
  'iras',
  'irent',
  'irez',
  'iriez',
  'irions',
  'irions',
  'iront',
  'is',
  'issaIent',
  'issais',
  'issait',
  'issant',
  'issante',
  'issantes',
  'issants',
  'isse',
  'issent',
  'isses',
  'issez',
  'issiez',
  'issions',
  'issons',
  'it',
];

const verbeCaseIons = ['ions'];
const verbCaseE = [
  'é',
  'ée',
  'ées',
  'és',
  'èrent',
  'er',
  'era',
  'erai',
  'eraIent',
  'erais',
  'erait',
  'eras',
  'erez',
  'eriez',
  'erions',
  'erons',
  'eront',
  'ez',
  'iez',
];
const verbcaseAmes = [
  'âmes',
  'ât',
  'âtes',
  'a',
  'ai',
  'aIent',
  'ais',
  'ait',
  'ant',
  'ante',
  'antes',
  'ants',
  'as',
  'asse',
  'assent',
  'asses',
  'assiez',
  'assions',
];
const verbes = [...verbeCaseIons, ...verbCaseE, ...verbcaseAmes];

const residueIon = ['ion'];
const residueIer = ['ier', 'ière', 'Ier', 'Ière'];
const residueE = ['e'];
const residueGue = ['ë'];
const residues = [...residueIon, ...residueIer, ...residueE, ...residueGue];

const vowels = ['a', 'e', 'i', 'o', 'u', 'y', 'â', 'à', 'ë', 'é', 'ê', 'è', 'ï', 'î', 'ô', 'û', 'ù'];

function isAVowel(c) {
  let res = false;
  vowels.forEach(v => {
    if (c === v) {
      res = true;
    }
  });
  return res;
}

function contains(tab, string) {
  let res = false;
  tab.forEach(e => {
    if (e === string) {
      res = true;
    }
  });
  return res;
}

function replaceStrings(b, RVTest, R1Test, R2Test, suffix, replacement) {
  const pattern = suffix + '$';
  const re = new RegExp(pattern);
  const a = b.replace(re, replacement);
  const RV = RVTest.replace(re, replacement);
  const R1 = R1Test.replace(re, replacement);
  const R2 = R2Test.replace(re, replacement);
  return { a, RV, R1, R2 };
}

function longestSuffix(availableSuffixes, a) {
  let suffix = '';
  availableSuffixes.forEach(e => {
    const pattern = e + '$';
    if (e.length > suffix.length && new RegExp(pattern).test(a)) {
      suffix = e;
    }
  });
  return suffix;
}

module.exports = input => {
  let a = input.toLowerCase();

  // put some vowels in upper case so that they are not considered vowels by the rest of the algorithm
  for (let i = 0; i < a.length; i += 1) {
    // put to upper case u and i if preceded AND followed by a vowel
    if ((a[i] === 'u' || a[i] === 'i') && isAVowel(a[i - 1]) && isAVowel(a[i + 1])) {
      a[i] = a[i].toUpperCase();
    }

    // put to upper case y if preceded OR followed by a vowel
    if (a[i] === 'y' && (isAVowel(a[i - 1]) || isAVowel(a[i + 1]))) {
      a[i] = a[i].toUpperCase();
    }

    // put to upper case u after q (qU)
    if (a[i] === 'u' && a[i - 1] === 'q') {
      a[i] = a[i].toUpperCase();
    }
  }

  // finding start index of RV
  let iRV = a.length;
  if (isAVowel(a[0]) && isAVowel(a[1])) {
    // if the first two letters are vowels, RV starts after the third letter
    iRV = 3;
  } else {
    for (let i = 1; i < a.length && iRV === a.length; i += 1) {
      if (isAVowel(a[i])) {
        iRV = i + 1;
      }
    }
  }
  // getting the RV substring
  let RV = a.substring(iRV, a.length);

  // finding start index of R1
  let iR1 = a.length;
  for (let i = 0; i < a.length && iR1 === a.length; i += 1) {
    if (isAVowel(a[i]) && !isAVowel(a[i + 1])) {
      iR1 = i + 2;
    }
  }

  // finding start index of R2
  let iR2 = a.length;
  for (let i = iR1; i < a.length && iR2 === a.length; i += 1) {
    if (isAVowel(a[i]) && !isAVowel(a[i + 1])) {
      iR2 = i + 2;
    }
  }

  // geting R1 and R2 substrings
  let R1 = a.substring(iR1, a.length);
  let R2 = a.substring(iR2, a.length);

  // Step 1
  let isModified = '';
  // find the longest suffix
  let suffix = longestSuffix(suffixes, a);
  let pattern = suffix + '$';
  let re = new RegExp(pattern);

  // Standard suffix removal
  if (contains(caseAnce, suffix)) {
    if (re.test(R2)) {
      isModified = suffix;
      ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, suffix, '')); // delete ance
    }
  } else if (contains(caseAtrice, suffix)) {
    if (re.test(R2)) {
      ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, suffix, '')); // delete atrice
      isModified = suffix;

      if (/ic$/i.test(a)) {
        if (/ic$/i.test(R2)) {
          ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, 'ic', '')); // delete icatrice
        } else {
          ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, 'ic', 'iqU')); // icatrice => iqU
        }
      }
    }
  } else if (contains(caseLogie, suffix)) {
    if (re.test(R2)) {
      ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, suffix, 'log')); // logie => log
      isModified = suffix;
    }
  } else if (contains(caseUsion, suffix)) {
    if (re.test(R2)) {
      ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, suffix, 'u')); // usion => u
      isModified = suffix;
    }
  } else if (contains(caseEnce, suffix)) {
    if (re.test(R2)) {
      ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, suffix, 'ent')); // ence => ent
      isModified = suffix;
    }
  } else if (contains(caseEment, suffix)) {
    // Case where word ends in ement, ements
    if (re.test(RV)) {
      ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, suffix, ''));
      isModified = suffix;

      if (/iv$/i.test(R2)) {
        // Case where words ends in ivement
        ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, 'iv', ''));
        if (/at$/i.test(R2)) {
          ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, 'at', '')); // in case where word ends in ativement
        }
      } else if (/eus$/i.test(a)) {
        // Word ends in eusement
        if (/eus$/i.test(R2)) {
          ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, 'eus', '')); // delete eusement
        } else if (/eus$/i.test(R1)) {
          ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, 'eus', 'eux')); // replace eusement with eux
        }
      } else if (/abl$/i.test(a)) {
        ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, 'abl', '')); // delete ablement
      } else if (/iqU$/i.test(a)) {
        ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, 'iqU', '')); // delete iqUement
      } else if (/ièr$/.test(RV)) {
        ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, 'ièr', 'i')); // delete ièrement, Ièrement
      }
    }
  } else if (contains(caseIte, suffix)) {
    if (re.test(R2)) {
      ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, suffix, '')); // delete ité
      isModified = suffix;

      if (/abil$/.test(a)) {
        if (/abil$/.test(R2)) {
          ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, 'abil', '')); // delete abilité
        } else {
          ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, 'abil', 'abl'));
        }
      } else if (/ic$/.test(a)) {
        if (/ic$/.test(R2)) {
          ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, 'ic', '')); // delete icité
        } else {
          ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, 'ic', 'iqU'));
        }
      } else if (/iv$/.test(R2)) {
        ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, 'iv', '')); // delete ivité
      }
    }
  } else if (contains(caseIf, suffix)) {
    if (re.test(R2)) {
      ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, suffix, '')); // delete if
      isModified = suffix;

      if (/at$/.test(R2)) {
        ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, 'at', '')); // delete atif

        if (/ic$/.test(a)) {
          if (/ic$/.test(R2)) {
            ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, 'ic', '')); // delete icif
          } else {
            ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, 'ic', 'iqU'));
          }
        }
      }
    }
  } else if (contains(caseEaux, suffix)) {
    ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, suffix, 'eau')); // eaux => eau
    isModified = suffix;
  } else if (contains(caseAux, suffix)) {
    if (re.test(R1)) {
      ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, suffix, 'al')); // aux => al
      isModified = suffix;
    }
  } else if (contains(caseEuse, suffix)) {
    if (re.test(R2)) {
      ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, suffix, '')); // delete euse
      isModified = suffix;
    } else if (re.test(R1)) {
      ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, suffix, 'eux')); // euse => eux
      isModified = suffix;
    }
  } else if (contains(caseIssement, suffix)) {
    if (re.test(R1) && !isAVowel(a[a.length - 1 - suffix.length])) {
      ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, suffix, '')); // delete issement si précédé d'une consonne
      isModified = suffix;
    }
  } else if (contains(caseAmment, suffix)) {
    if (re.test(RV)) {
      ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, suffix, 'ant')); // amment => ant
      isModified = suffix;
    }
  } else if (contains(caseEmment, suffix)) {
    if (re.test(RV)) {
      ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, suffix, 'ent')); // emment => ent
      isModified = suffix;
    }
  } else if (contains(caseMent, suffix)) {
    if (isAVowel(RV[RV.length - 1 - suffix.length])) {
      ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, suffix, '')); // delete ment si précédé d'une voyelle
      isModified = suffix;
    }
  }

  // Step 2a, verb endings in i-
  if (
    isModified === 'amment' ||
    isModified === 'emment' ||
    isModified === 'ment' ||
    isModified === 'ments' ||
    isModified === ''
  ) {
    // Find the longest verb ending
    suffix = '';
    isModified = '';
    iVerbes.forEach(e => {
      if (e.length > suffix.length && /`${e}$`/.test(a)) {
        suffix = e;
      }
    });
    pattern = suffix + '$';
    re = new RegExp(pattern);
    if (suffix !== '' && !isAVowel(RV[RV.length - 1 - suffix.length])) {
      ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, suffix, '')); // Delete the suffix
      isModified = suffix;
    }

    // Step 2b, performed after 2a if it didn't remove anything
    if (isModified === '') {
      // Find the longest verb ending
      suffix = longestSuffix(verbes, a);

      // Suffix removal
      if (contains(verbeCaseIons, suffix)) {
        if (re.test(R2)) {
          ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, suffix, ''));
          isModified = suffix;
        }
      } else if (contains(verbCaseE, suffix)) {
        ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, suffix, ''));
        isModified = suffix;
      } else if (contains(verbcaseAmes, suffix)) {
        ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, suffix, ''));
        isModified = suffix;
        if (/e$/.test(RV)) {
          ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, 'e', ''));
          isModified = suffix;
        }
      }
    }
  }

  // Step 3
  if (isModified !== '') {
    if (/Y$/.test(a)) {
      ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, 'Y', 'i'));
    } else if (/ç$/.test(a)) {
      ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, 'ç', 'c'));
    }
  } else {
    // Step 4, removing residual suffix
    if (/[^aiouès]s$/.test(a)) {
      ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, 's', ''));
    }
    // Find the longest
    suffix = longestSuffix(residues, RV);
    pattern = suffix + '$';
    re = new RegExp(pattern);

    // Removing residual suffix
    if (contains(residueIon, suffix)) {
      if (re.test(R2) && /`(s|t)${suffix}$`/.test(a)) {
        ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, suffix, ''));
      }
    } else if (contains(residueIer, suffix)) {
      ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, suffix, 'i'));
    } else if (contains(residueE, suffix)) {
      ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, suffix, ''));
    } else if (contains(residueGue, suffix)) {
      if (/guë$/.test(RV)) {
        ({ a, RV, R1, R2 } = replaceStrings(a, RV, R1, R2, suffix, ''));
      }
    }
  }

  // Step 5 undouble
  if (/(enn|onn|ett|ell|eill)$/.test(a)) {
    a = a.replace(/.$/, '');
  }

  // Step 6 un-accent
  // eslint-disable-next-line no-unused-vars
  let vowelString = '';
  vowels.forEach(v => {
    vowelString += v;
  });
  a = a.replace(/`(é|è)[^${vowelString}]+$`/, 'e');

  return a.toLowerCase();
};
