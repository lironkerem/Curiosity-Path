/**
 * Mini-Apps/SelfAnalysisPro/js/TarotEngine.js
 * Patched: frozen constants, aria attrs on images, safe unique IDs via crypto,
 * onload/onerror handlers use data-* delegation (no inline JS injection).
 */

const TAROT_BASE_URL = '/public/Tarot%20Cards%20images/';

// Frozen lookup for major arcana names
const MAJOR_ARCANA_NAMES = Object.freeze({
  0:'The Fool', 1:'The Magician', 2:'The High Priestess',
  3:'The Empress', 4:'The Emperor', 5:'The Hierophant',
  6:'The Lovers', 7:'The Chariot', 8:'Strength',
  9:'The Hermit', 10:'Wheel of Fortune', 11:'Justice',
  12:'The Hanged Man', 13:'Death', 14:'Temperance',
  15:'The Devil', 16:'The Tower', 17:'The Star',
  18:'The Moon', 19:'The Sun', 20:'Judgement',
  21:'The World', 22:'The Fool'
});

const SUITS = Object.freeze(['pentacles', 'swords', 'cups', 'wands']);

const ZODIAC_MAP = Object.freeze({
  aries:       { major: 4,  minors: [{ suit: 'wands',     numbers: [2,3,4]   }] },
  taurus:      { major: 5,  minors: [{ suit: 'pentacles', numbers: [5,6,7]   }] },
  gemini:      { major: 6,  minors: [{ suit: 'swords',    numbers: [8,9,10]  }] },
  cancer:      { major: 7,  minors: [{ suit: 'cups',      numbers: [2,3,4]   }] },
  leo:         { major: 8,  minors: [{ suit: 'wands',     numbers: [5,6,7]   }] },
  virgo:       { major: 9,  minors: [{ suit: 'pentacles', numbers: [8,9,10]  }] },
  libra:       { major: 11, minors: [{ suit: 'swords',    numbers: [2,3,4]   }] },
  scorpio:     { major: 13, minors: [{ suit: 'cups',      numbers: [5,6,7]   }] },
  sagittarius: { major: 14, minors: [{ suit: 'wands',     numbers: [8,9,10]  }] },
  capricorn:   { major: 15, minors: [{ suit: 'pentacles', numbers: [2,3,4]   }] },
  aquarius:    { major: 17, minors: [{ suit: 'swords',    numbers: [5,6,7]   }] },
  pisces:      { major: 18, minors: [{ suit: 'cups',      numbers: [8,9,10]  }] }
});

const PLANET_MAP = Object.freeze({
  sun: 19, moon: 2, mercury: 1, venus: 3, mars: 16,
  jupiter: 10, saturn: 21, uranus: 0, neptune: 12, pluto: 20, earth: 21
});

const ELEMENT_SUIT_MAP = Object.freeze({ fire: 'wands', water: 'cups', air: 'swords', earth: 'pentacles' });

const SEFIRA_MAP = Object.freeze({
  keter:1, kether:1, chokhmah:2, chochma:2, chokmah:2, binah:3,
  chesed:4, geburah:5, gevurah:5, gvurah:5, tiferet:6, tiphareth:6,
  netzach:7, netzah:7, hod:8, yesod:9, malkuth:10, malchut:10, malkut:10
});

// Safe unique ID using crypto if available, fallback to counter
let _idCounter = 0;
function _uniqueId() {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const arr = new Uint32Array(2);
    crypto.getRandomValues(arr);
    return arr[0].toString(36) + arr[1].toString(36);
  }
  return String(++_idCounter);
}

class TarotEngine {
  constructor() {
    this.baseUrl = TAROT_BASE_URL;
  }

  getMajorArcanaName(number) {
    return MAJOR_ARCANA_NAMES[number] || '';
  }

  getMajorArcanaImage(number) {
    const num    = String(number).padStart(2, '0');
    const name   = this.getMajorArcanaName(number).replace(/\s+/g, '');
    return `${this.baseUrl}${num}-${name}.webp`;
  }

  getMinorArcanaImage(suit, number) {
    const num     = String(number).padStart(2, '0');
    const suitCap = suit.charAt(0).toUpperCase() + suit.slice(1);
    return `${this.baseUrl}${suitCap}${num}.webp`;
  }

  getCardsForNumber(number) {
    const cards = [];
    let reduced = number;
    if (number > 22) reduced = this.reduceToMasterOrSingle(number);
    if (reduced === 0 || reduced === 22) reduced = 0;

    if (reduced >= 0 && reduced <= 21) {
      cards.push({ type: 'major', number: reduced, name: this.getMajorArcanaName(reduced), image: this.getMajorArcanaImage(reduced) });
    }

    const minorNum = reduced === 0 ? 1 : (reduced > 10 ? reduced % 10 || 10 : reduced);
    if (minorNum >= 1 && minorNum <= 10) {
      SUITS.forEach(suit => {
        cards.push({ type: 'minor', suit, number: minorNum, name: `${minorNum} of ${suit.charAt(0).toUpperCase() + suit.slice(1)}`, image: this.getMinorArcanaImage(suit, minorNum) });
      });
    }
    return cards;
  }

  getCardsForZodiac(zodiacSign) {
    const mapping = ZODIAC_MAP[String(zodiacSign).toLowerCase()];
    if (!mapping) return [];
    const cards = [{ type: 'major', number: mapping.major, name: this.getMajorArcanaName(mapping.major), image: this.getMajorArcanaImage(mapping.major) }];
    mapping.minors.forEach(minor => {
      minor.numbers.forEach(num => {
        cards.push({ type: 'minor', suit: minor.suit, number: num, name: `${num} of ${minor.suit.charAt(0).toUpperCase() + minor.suit.slice(1)}`, image: this.getMinorArcanaImage(minor.suit, num) });
      });
    });
    return cards;
  }

  getCardsForPlanet(planet) {
    const majorNum = PLANET_MAP[String(planet).toLowerCase()];
    if (majorNum === undefined) return [];
    return [{ type: 'major', number: majorNum, name: this.getMajorArcanaName(majorNum), image: this.getMajorArcanaImage(majorNum) }];
  }

  getCardsForElement(element) {
    const suit = ELEMENT_SUIT_MAP[String(element).toLowerCase()];
    if (!suit) return [];
    const cards = [];
    for (let i = 1; i <= 10; i++) {
      cards.push({ type: 'minor', suit, number: i, name: `${i} of ${suit.charAt(0).toUpperCase() + suit.slice(1)}`, image: this.getMinorArcanaImage(suit, i) });
    }
    const courtNames = Object.freeze(['Page','Knight','Queen','King']);
    for (let i = 11; i <= 14; i++) {
      cards.push({ type: 'court', suit, number: i, name: `${courtNames[i-11]} of ${suit.charAt(0).toUpperCase() + suit.slice(1)}`, image: this.getMinorArcanaImage(suit, i) });
    }
    return cards;
  }

  getCardsForSefira(sefira, element) {
    const number = SEFIRA_MAP[String(sefira).toLowerCase()];
    if (!number) return [];
    const suits  = element ? [ELEMENT_SUIT_MAP[String(element).toLowerCase()]] : [...SUITS];
    const cards  = [];
    suits.forEach(suit => {
      if (suit) cards.push({ type: 'minor', suit, number, name: `${number} of ${suit.charAt(0).toUpperCase() + suit.slice(1)}`, image: this.getMinorArcanaImage(suit, number) });
    });
    return cards;
  }

  reduceToMasterOrSingle(num) {
    while (num > 22) {
      num = String(num).split('').reduce((a, b) => a + parseInt(b, 10), 0);
      if (num === 11 || num === 22) break;
    }
    return num;
  }

  /**
   * Render cards as HTML string.
   * - Image onload/onerror replaced by data-* attributes; real handlers
   *   attached by initImageLoading() after insertion, or via event delegation.
   * - All card names set safely (they come from frozen constants, not user input).
   */
  renderCards(cards, _layout = 'row') {
    if (!cards || cards.length === 0) return '';

    const majorCards = cards.filter(c => c.type === 'major');
    const minorCards = cards.filter(c => c.type === 'minor');
    const courtCards = cards.filter(c => c.type === 'court');

    const createCardHTML = (card, width = '110px') => {
      const uid = `tarot-img-${_uniqueId()}`;
      // card.name comes from frozen MAJOR_ARCANA_NAMES or static string concat — safe
      return `
        <div class="tarot-card"
             data-card-number="${card.number}"
             data-card-type="${card.type}"
             data-card-suit="${card.suit || 'major'}"
             style="text-align:center;width:${width};cursor:pointer;position:relative;"
             role="button" tabindex="0" aria-label="${card.name}">
          <div class="tarot-card-inner" style="background:white;border-radius:8px;padding:8px;box-shadow:0 2px 8px rgba(0,0,0,0.15);transition:all 0.3s ease;border:2px solid #3F7652;position:relative;min-height:auto;">
            <div class="tarot-card-loading" id="loading-${uid}" style="position:absolute;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.9);border-radius:4px;z-index:10;" aria-hidden="true">
              <div class="tarot-spinner"></div>
            </div>
            <img id="${uid}"
                 src="${card.image}"
                 alt="${card.name}"
                 title="${card.name}"
                 loading="lazy"
                 decoding="async"
                 data-loading-id="loading-${uid}"
                 class="tarot-lazy-img"
                 style="width:100%;height:auto;border-radius:4px;display:block;opacity:0;position:relative;z-index:5;transition:opacity 0.3s ease;"
                 aria-hidden="true">
            <p style="margin:6px 0 0 0;font-size:20px;color:white;background:#3F7652;padding:4px;border-radius:4px;line-height:1.2;font-weight:600;position:relative;z-index:5;">${card.name}</p>
          </div>
        </div>`;
    };

    let html = '';
    if (majorCards.length > 0) {
      html += '<div style="text-align:center;">';
      html += '<h5 style="margin:0 0 8px 0;color:#3F7652;font-size:30px;font-weight:600;">Major Arcana</h5>';
      html += '<div style="display:flex;justify-content:center;flex-wrap:wrap;gap:12px;max-width:800px;margin:0 auto;">';
      majorCards.forEach(card => { html += createCardHTML(card, '110px'); });
      html += '</div></div>';
    }
    if (minorCards.length > 0) {
      html += '<div style="margin-top:15px;text-align:center;">';
      html += '<h5 style="margin:0 0 8px 0;color:#3F7652;font-size:30px;font-weight:600;">Minor Arcana</h5>';
      html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,95px);gap:12px;justify-content:center;margin:0 auto;max-width:600px;">';
      minorCards.forEach(card => { html += createCardHTML(card, '95px'); });
      html += '</div></div>';
    }
    if (courtCards.length > 0) {
      html += '<div style="margin-top:15px;text-align:center;">';
      html += '<h5 style="margin:0 0 8px 0;color:#3F7652;font-size:30px;font-weight:600;">Court Cards</h5>';
      html += '<div style="display:flex;justify-content:center;flex-wrap:wrap;gap:12px;">';
      courtCards.forEach(card => { html += createCardHTML(card, '95px'); });
      html += '</div></div>';
    }
    return html;
  }

  /**
   * Call after inserting renderCards() HTML into the DOM.
   * Attaches load/error handlers to tarot images without inline JS.
   */
  static initImageLoading(container = document) {
    container.querySelectorAll('.tarot-lazy-img').forEach(img => {
      const loadingId = img.dataset.loadingId;
      if (!loadingId) return;

      img.addEventListener('load', function onLoad() {
        img.style.opacity = '1';
        const loader = document.getElementById(loadingId);
        if (loader) loader.style.display = 'none';
        img.removeEventListener('load', onLoad);
      });

      img.addEventListener('error', function onError() {
        img.style.opacity = '1';
        const loader = document.getElementById(loadingId);
        if (loader) {
          loader.textContent = 'Image unavailable';
          loader.style.fontSize = '12px';
          loader.style.color = '#999';
        }
        img.removeEventListener('error', onError);
      });
    });
  }
}

if (typeof window !== 'undefined') window.TarotEngine = TarotEngine;
export default TarotEngine;
