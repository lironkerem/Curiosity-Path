/**
 * TarotEngine.js - Complete Tarot Integration
 */

const TAROT_BASE_URL = '/public/Tarot%20Cards%20images/';

class TarotEngine {
  constructor() {
    this.baseUrl = TAROT_BASE_URL;
  }

  getMajorArcanaImage(number) {
    const num = String(number).padStart(2, '0');
    return `${this.baseUrl}${num}-${this.getMajorArcanaName(number).replace(/\s+/g, '')}.webp`;
  }

  getMinorArcanaImage(suit, number) {
    const num = String(number).padStart(2, '0');
    const suitCap = suit.charAt(0).toUpperCase() + suit.slice(1);
    return `${this.baseUrl}${suitCap}${num}.webp`;
  }

  getMajorArcanaName(number) {
    const names = {
      0: "The Fool", 1: "The Magician", 2: "The High Priestess",
      3: "The Empress", 4: "The Emperor", 5: "The Hierophant",
      6: "The Lovers", 7: "The Chariot", 8: "Strength",
      9: "The Hermit", 10: "Wheel of Fortune", 11: "Justice",
      12: "The Hanged Man", 13: "Death", 14: "Temperance",
      15: "The Devil", 16: "The Tower", 17: "The Star",
      18: "The Moon", 19: "The Sun", 20: "Judgement",
      21: "The World", 22: "The Fool"
    };
    return names[number] || "";
  }

  getCardsForNumber(number) {
    const cards = [];
    
    let reduced = number;
    if (number > 22) {
      reduced = this.reduceToMasterOrSingle(number);
    }
    
    if (reduced === 0 || reduced === 22) reduced = 0;
    
    if (reduced >= 0 && reduced <= 21) {
      cards.push({
        type: 'major',
        number: reduced,
        name: this.getMajorArcanaName(reduced),
        image: this.getMajorArcanaImage(reduced)
      });
    }
    
    const minorNum = reduced === 0 ? 1 : (reduced > 10 ? reduced % 10 || 10 : reduced);
    if (minorNum >= 1 && minorNum <= 10) {
      ['pentacles', 'swords', 'cups', 'wands'].forEach(suit => {
        cards.push({
          type: 'minor',
          suit: suit,
          number: minorNum,
          name: `${minorNum} of ${suit.charAt(0).toUpperCase() + suit.slice(1)}`,
          image: this.getMinorArcanaImage(suit, minorNum)
        });
      });
    }
    
    return cards;
  }

  getCardsForZodiac(zodiacSign) {
    const zodiacMap = {
      aries: { major: 4, minors: [{ suit: 'wands', numbers: [2, 3, 4] }] },
      taurus: { major: 5, minors: [{ suit: 'pentacles', numbers: [5, 6, 7] }] },
      gemini: { major: 6, minors: [{ suit: 'swords', numbers: [8, 9, 10] }] },
      cancer: { major: 7, minors: [{ suit: 'cups', numbers: [2, 3, 4] }] },
      leo: { major: 8, minors: [{ suit: 'wands', numbers: [5, 6, 7] }] },
      virgo: { major: 9, minors: [{ suit: 'pentacles', numbers: [8, 9, 10] }] },
      libra: { major: 11, minors: [{ suit: 'swords', numbers: [2, 3, 4] }] },
      scorpio: { major: 13, minors: [{ suit: 'cups', numbers: [5, 6, 7] }] },
      sagittarius: { major: 14, minors: [{ suit: 'wands', numbers: [8, 9, 10] }] },
      capricorn: { major: 15, minors: [{ suit: 'pentacles', numbers: [2, 3, 4] }] },
      aquarius: { major: 17, minors: [{ suit: 'swords', numbers: [5, 6, 7] }] },
      pisces: { major: 18, minors: [{ suit: 'cups', numbers: [8, 9, 10] }] }
    };
    
    const sign = String(zodiacSign).toLowerCase();
    const mapping = zodiacMap[sign];
    if (!mapping) return [];
    
    const cards = [];
    
    cards.push({
      type: 'major',
      number: mapping.major,
      name: this.getMajorArcanaName(mapping.major),
      image: this.getMajorArcanaImage(mapping.major)
    });
    
    mapping.minors.forEach(minor => {
      minor.numbers.forEach(num => {
        cards.push({
          type: 'minor',
          suit: minor.suit,
          number: num,
          name: `${num} of ${minor.suit.charAt(0).toUpperCase() + minor.suit.slice(1)}`,
          image: this.getMinorArcanaImage(minor.suit, num)
        });
      });
    });
    
    return cards;
  }

  getCardsForPlanet(planet) {
    const planetMap = {
      sun: 19,
      moon: 2,
      mercury: 1,
      venus: 3,
      mars: 16,
      jupiter: 10,
      saturn: 21,
      uranus: 0,
      neptune: 12,
      pluto: 20,
      earth: 21
    };
    
    const planetLower = String(planet).toLowerCase();
    const majorNum = planetMap[planetLower];
    if (majorNum === undefined) return [];
    
    return [{
      type: 'major',
      number: majorNum,
      name: this.getMajorArcanaName(majorNum),
      image: this.getMajorArcanaImage(majorNum)
    }];
  }

  getCardsForElement(element) {
    const elementMap = {
      fire: 'wands',
      water: 'cups',
      air: 'swords',
      earth: 'pentacles'
    };
    
    const suit = elementMap[String(element).toLowerCase()];
    if (!suit) return [];
    
    const cards = [];
    
    for (let i = 1; i <= 10; i++) {
      cards.push({
        type: 'minor',
        suit: suit,
        number: i,
        name: `${i} of ${suit.charAt(0).toUpperCase() + suit.slice(1)}`,
        image: this.getMinorArcanaImage(suit, i)
      });
    }
    
    const courtNames = ['Page', 'Knight', 'Queen', 'King'];
    for (let i = 11; i <= 14; i++) {
      cards.push({
        type: 'court',
        suit: suit,
        number: i,
        name: `${courtNames[i - 11]} of ${suit.charAt(0).toUpperCase() + suit.slice(1)}`,
        image: this.getMinorArcanaImage(suit, i)
      });
    }
    
    return cards;
  }

  getCardsForSefira(sefira, element) {
    const sefiraMap = {
      keter: 1, kether: 1,
      chokhmah: 2, chochma: 2, chokmah: 2,
      binah: 3,
      chesed: 4,
      geburah: 5, gevurah: 5, gvurah: 5,
      tiferet: 6, tiphareth: 6,
      netzach: 7, netzah: 7,
      hod: 8,
      yesod: 9,
      malkuth: 10, malchut: 10, malkut: 10
    };
    
    const sefiraLower = String(sefira).toLowerCase();
    const number = sefiraMap[sefiraLower];
    if (!number) return [];
    
    const elementMap = {
      fire: 'wands',
      water: 'cups',
      air: 'swords',
      earth: 'pentacles'
    };
    
    const cards = [];
    const suits = element ? [elementMap[String(element).toLowerCase()]] : ['pentacles', 'swords', 'cups', 'wands'];
    
    suits.forEach(suit => {
      if (suit) {
        cards.push({
          type: 'minor',
          suit: suit,
          number: number,
          name: `${number} of ${suit.charAt(0).toUpperCase() + suit.slice(1)}`,
          image: this.getMinorArcanaImage(suit, number)
        });
      }
    });
    
    return cards;
  }

  reduceToMasterOrSingle(num) {
    while (num > 22) {
      const digits = String(num).split('').map(Number);
      num = digits.reduce((a, b) => a + b, 0);
      if (num === 11 || num === 22) break;
    }
    return num;
  }

  // FIXED: Removed wrapper divs - return content directly
  renderCards(cards, layout = 'row') {
    if (!cards || cards.length === 0) return '';
    
    const majorCards = cards.filter(c => c.type === 'major');
    const minorCards = cards.filter(c => c.type === 'minor');
    const courtCards = cards.filter(c => c.type === 'court');
    
    // FIXED: No wrapper div - start with empty string
    let html = '';
    
    const createCardHTML = (card, width = '110px') => {
      const uniqueId = `tarot-${card.type}-${card.suit || 'major'}-${card.number}-${Math.random().toString(36).substr(2, 9)}`;
      return `
        <div class="tarot-card" data-card-number="${card.number}" 
             data-card-type="${card.type}" 
             data-card-suit="${card.suit || 'major'}" 
             style="text-align: center; width: ${width}; cursor: pointer; position: relative;">
          <div class="tarot-card-inner" style="background: white; border-radius: 8px; padding: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); transition: all 0.3s ease; border: 2px solid #3F7652; position: relative; min-height: auto;">
            <div class="tarot-card-loading" id="loading-${uniqueId}" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.9); border-radius: 4px; z-index: 10;">
              <div class="tarot-spinner"></div>
            </div>
            <picture>
              <source srcset="${card.image}" type="image/webp">
              <img id="${uniqueId}"
                 src="${card.image.replace('.webp', '.jpg')}" 
                 alt="${card.name}" 
                 title="${card.name}" 
                 loading="lazy"
                 decoding="async"
                 style="width: 100%; height: auto; border-radius: 4px; display: block; opacity: 0; position: relative; z-index: 5; transition: opacity 0.3s ease;"
                 onload="this.style.opacity='1'; var loader = document.getElementById('loading-${uniqueId}'); if (loader) loader.style.display='none';"
                 onerror="this.style.opacity='1'; var loader = document.getElementById('loading-${uniqueId}'); if (loader) loader.innerHTML='<span style=\\'color:#999;font-size:12px;\\'>Image unavailable</span>';">
            </picture>
            <p style="margin: 6px 0 0 0; font-size: 20px; color: white; background: #3F7652; padding: 4px; border-radius: 4px; line-height: 1.2; font-weight: 600; position: relative; z-index: 5;">${card.name}</p>
          </div>
        </div>`;
    };
    
    if (majorCards.length > 0) {
      html += '<div style="text-align: center;">';
      html += '<h5 style="margin: 0 0 8px 0; color: #3F7652; font-size: 30px; font-weight: 600;">Major Arcana</h5>';
      html += '<div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 12px; max-width: 800px; margin: 0 auto;">';
      majorCards.forEach(card => {
        html += createCardHTML(card, '110px');
      });
      html += '</div></div>';
    }
    
    if (minorCards.length > 0) {
      html += '<div style="margin-top: 15px; text-align: center;">';
      html += '<h5 style="margin: 0 0 8px 0; color: #3F7652; font-size: 30px; font-weight: 600;">Minor Arcana</h5>';
      html += '<div style="display: grid; grid-template-columns: repeat(auto-fit, 95px); gap: 12px; justify-content: center; margin: 0 auto; max-width: 600px;">';
      minorCards.forEach(card => {
        html += createCardHTML(card, '95px');
      });
      html += '</div></div>';
    }
    
    if (courtCards.length > 0) {
      html += '<div style="margin-top: 15px; text-align: center;">';
      html += '<h5 style="margin: 0 0 8px 0; color: #3F7652; font-size: 30px; font-weight: 600;">Court Cards</h5>';
      html += '<div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 12px;">';
      courtCards.forEach(card => {
        html += createCardHTML(card, '95px');
      });
      html += '</div></div>';
    }
    
    // FIXED: No closing wrapper div
    return html;
  }
}

if (typeof window !== 'undefined') {
  window.TarotEngine = TarotEngine;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TarotEngine;
}
export default TarotEngine;
