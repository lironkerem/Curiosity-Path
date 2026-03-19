/**
 * PDFAssembler.js - COMPLETE VERSION
 * Updated with:
 * - Dual ruling planets (Mars+Pluto, Saturn+Uranus, Jupiter+Neptune)
 * - 6 Key Major Arcana Tarot cards
 * - New Source PDF mapping
 */

class PDFAssembler {
  constructor(opts = {}) {
    this.sourcePdfUrl = opts.sourcePdfUrl || null;
    this.sourcePdfArrayBuffer = opts.sourcePdfArrayBuffer || null;
    this.progress = typeof opts.progress === "function" ? opts.progress : () => {};
    this.options = Object.assign(
      {
        autoDownload: false,
        downloadFilename: "Self-Analysis-Report.pdf",
      },
      opts.options || {}
    );

    this.pdfLib = null; // loaded lazily on first assemble()

    // Updated mapping with new Source PDF layout
    this.maps = {
      numbers: {
        "1": 24, "2": 25, "3": 26, "4": 27, "5": 28, "6": 29,
        "7": 30, "8": 31, "9": 32, "10": 33, "11": 34, "22": 35, "33": 36,
      },
      zodiac: {
        aries: 43, taurus: 44, gemini: 45, cancer: 46, leo: 47, virgo: 48,
        libra: 49, scorpio: 50, sagittarius: 51, capricorn: 52, aquarius: 53, pisces: 54,
      },
      planets: {
        sun: 56,
        mercury: 57,
        venus: 58,
        moon: 59,
        mars: 60,
        jupiter: 61,
        saturn: 62,
        earth: 63,
        pluto: 64,
        neptune: 65,
        uranus: 66
      },
      elements: {
        earth: 68,
        air: 69,
        water: 70,
        fire: 71,
      },
      sefira: {
        keter: [75, 76], kether: [75, 76],
        chokhmah: [77, 78], chochma: [77, 78], chokmah: [77, 78],
        binah: [79, 80],
        chesed: [81, 82],
        gevurah: [83, 84], gvurah: [83, 84], geburah: [83, 84],
        tiferet: [85, 86], tiphareth: [85, 86],
        netzach: [87, 88], netzah: [87, 88],
        hod: [89, 90],
        yesod: [91, 92],
        malkuth: [93, 94], malchut: [93, 94], malkut: [93, 94],
      },
      // Major Arcana mapping: 0-21 → Pages 100-121
      majorArcana: {
        0: 100,   // The Fool
        1: 101,   // The Magician
        2: 102,   // The High Priestess
        3: 103,   // The Empress
        4: 104,   // The Emperor
        5: 105,   // The Hierophant
        6: 106,   // The Lovers
        7: 107,   // The Chariot
        8: 108,   // Strength
        9: 109,   // The Hermit
        10: 110,  // Wheel of Fortune
        11: 111,  // Justice
        12: 112,  // The Hanged Man
        13: 113,  // Death
        14: 114,  // Temperance
        15: 115,  // The Devil
        16: 116,  // The Tower
        17: 117,  // The Star
        18: 118,  // The Moon
        19: 119,  // The Sun
        20: 120,  // Judgement
        21: 121   // The World
      }
    };
  }

  _report(pct, msg) {
    try {
      this.progress(pct, msg);
    } catch {}
  }

  async _fetchArrayBuffer(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch PDF: ${res.statusText}`);
    return await res.arrayBuffer();
  }

  _resolveNumber(n) {
    const p = this.maps.numbers[String(n)];
    return p ? [p] : [];
  }

  _resolveZodiac(z) {
    const p = this.maps.zodiac[String(z).toLowerCase()];
    return p ? [p] : [];
  }

  _resolvePlanet(pl) {
    const p = this.maps.planets[String(pl).toLowerCase()];
    return p ? [p] : [];
  }

  _resolveElement(el) {
    const p = this.maps.elements[String(el).toLowerCase()];
    return p ? [p] : [];
  }

  _resolveSefira(s) {
    const name = String(s).split('(')[0].trim().toLowerCase();
    const p = this.maps.sefira[name];
    return p ? (Array.isArray(p) ? p : [p]) : [];
  }

  _resolveMajorArcana(n) {
    const p = this.maps.majorArcana[Number(n)];
    return p ? [p] : [];
  }

  /**
   * Get all planet pages for dual ruling planets
   */
  _getDualPlanetPages(planetString) {
    if (!planetString) return [];
    
    const planets = planetString.split(',').map(p => p.trim());
    const pages = [];
    
    planets.forEach(planet => {
      const planetPages = this._resolvePlanet(planet);
      pages.push(...planetPages);
    });
    
    return pages;
  }

  /**
   * Reduce number to Major Arcana (0-21)
   */
  _reduceToMajorArcana(number) {
    if (!number) return null;
    let n = Number(number);
    
    // Master numbers 11, 22 stay as is if <= 22
    if (n === 11 || n === 22) return n;
    
    // Reduce larger numbers
    while (n > 22) {
      const digits = String(n).split('').map(Number);
      n = digits.reduce((a, b) => a + b, 0);
      if (n === 11 || n === 22) break;
    }
    
    // Handle 0 and 22 both as The Fool (0)
    if (n === 22) return 0;
    if (n === 0) return 0;
    
    return n;
  }

  /**
   * Map Zodiac Sign to Major Arcana
   */
  _getZodiacMajorArcana(zodiacSign) {
    const zodiacToMajorArcana = {
      aries: 4, taurus: 5, gemini: 6, cancer: 7,
      leo: 8, virgo: 9, libra: 11, scorpio: 13,
      sagittarius: 14, capricorn: 15, aquarius: 17, pisces: 18
    };
    
    const sign = String(zodiacSign).toLowerCase();
    return zodiacToMajorArcana[sign] || null;
  }

  /**
   * Map Ruling Planet to Major Arcana
   */
  _getPlanetMajorArcana(planetString) {
    if (!planetString) return null;
    
    // Handle dual planets - use the first (traditional) planet
    const primaryPlanet = planetString.split(',')[0].trim().toLowerCase();
    
    const planetToMajorArcana = {
      sun: 19, moon: 2, mercury: 1, venus: 3,
      mars: 16, jupiter: 10, saturn: 21,
      uranus: 0, neptune: 12, pluto: 20
    };
    
    return planetToMajorArcana[primaryPlanet] || null;
  }

  /**
   * Extract 6 key Major Arcana cards
   */
  _extractKeyTarotCards(appState) {
    const numerology = appState.analysis?.numerology || {};
    const astrology = appState.analysis?.astrology || {};
    
    return {
      lifeLessons: this._reduceToMajorArcana(numerology.firstName?.value),
      spiritualSupport: this._reduceToMajorArcana(numerology.lastName?.value),
      lifePath: this._reduceToMajorArcana(numerology.lifePath?.value),
      soulsDirection: this._reduceToMajorArcana(numerology.soulsDirection?.value),
      zodiacSign: this._getZodiacMajorArcana(astrology.zodiac?.name),
      rulingPlanet: this._getPlanetMajorArcana(astrology.zodiac?.planet)
    };
  }

  async assemble(appState = {}) {
    // Lazy-load pdf-lib if not yet loaded
    if (!this.pdfLib) {
      if (typeof window.loadPdfLib === 'function') {
        await window.loadPdfLib();
      }
      this.pdfLib = window.PDFLib || window.pdfLib || null;
      if (!this.pdfLib) throw new Error('pdf-lib failed to load');
    }
    try {
      this._report(5, "Loading source PDF");

      // Extract data from nested structure
      const numerology = appState.analysis?.numerology || {};
      const astrology = appState.analysis?.astrology || {};
      
      const results = {
        firstNameFinal: numerology.firstName?.value,
        lastNameFinal: numerology.lastName?.value,
        expressionFinal: numerology.expression?.value,
        lifePathFinal: numerology.lifePath?.value,
        birthdayFinal: numerology.birthday?.value,
        soulsDirectionFinal: numerology.soulsDirection?.value,
        soulUrgeFinal: numerology.soulUrge?.value,
        personalityFinal: numerology.personality?.value,
        maturityFinal: numerology.maturity?.value,
        balanceFinal: numerology.balance?.value,
        pinnacles: [
          numerology.pinnacles?.p1?.value,
          numerology.pinnacles?.p2?.value,
          numerology.pinnacles?.p3?.value,
          numerology.pinnacles?.p4?.value
        ],
        challenges: [
          numerology.challenges?.ch1?.value,
          numerology.challenges?.ch2?.value,
          numerology.challenges?.ch3?.value,
          numerology.challenges?.ch4?.value
        ],
        zodiac: astrology.zodiac?.name,
        rulingPlanet: astrology.zodiac?.planet,
        element: astrology.zodiac?.element,
        sefira: astrology.sefira
      };

      // Extract key tarot cards
      const keyTarotCards = this._extractKeyTarotCards(appState);
      console.log("Key Tarot Cards:", keyTarotCards);

      let sourceBytes;
      if (this.sourcePdfArrayBuffer) {
        sourceBytes = this.sourcePdfArrayBuffer;
      } else if (this.sourcePdfUrl) {
        sourceBytes = await this._fetchArrayBuffer(this.sourcePdfUrl);
      } else {
        throw new Error("No Source PDF provided");
      }

      const { PDFDocument } = this.pdfLib;
      const srcPdf = await PDFDocument.load(sourceBytes);
      const outPdf = await PDFDocument.create();

      const copyPage = async (n, label = "Unknown") => {
        if (n == null) {
          console.warn(`Skipping ${label}: no page number provided`);
          return;
        }
        if (n < 1 || n > srcPdf.getPageCount()) {
          throw new Error(
            `Mapping error: page ${n} for ${label} is out of range. Source PDF has ${srcPdf.getPageCount()} pages.`
          );
        }
        const [p] = await outPdf.copyPages(srcPdf, [n - 1]);
        outPdf.addPage(p);
      };

      const addExplainerAndNumber = async (explainerPage, value, label) => {
        if (explainerPage) await copyPage(explainerPage, `${label} explainer`);
        if (value == null) {
          console.warn(`Skipping ${label}: no value provided`);
          return;
        }
        const nums = this._resolveNumber(value);
        if (nums.length === 0) {
          console.warn(`No mapping found for ${label} value: ${value}`);
          return;
        }
        for (const n of nums) await copyPage(n, `${label} number ${value}`);
      };

      // === ASSEMBLY ORDER (Following Generated PDF Layout) ===
      
      this._report(10, "Adding cover pages");
      await copyPage(1, "Cover");
      await copyPage(2, "Welcome");
      await copyPage(3, "How to use");
      await copyPage(4, "Overview");
      
      this._report(15, "Adding numerology section");
      await copyPage(5, "Numerology cover");
      await copyPage(6, "Numerology intro 1");
      await copyPage(7, "Numerology intro 2");

      this._report(20, "Processing numerology numbers");
      await addExplainerAndNumber(8, results.firstNameFinal, "First Name (Life Lessons)");
      await addExplainerAndNumber(9, results.lastNameFinal, "Last Name (Spiritual Support)");
      await addExplainerAndNumber(10, results.expressionFinal, "Expression/Destiny");
      await addExplainerAndNumber(11, results.lifePathFinal, "Life Path");
      await addExplainerAndNumber(12, results.birthdayFinal, "Birthday");
      await addExplainerAndNumber(13, results.soulsDirectionFinal, "Soul's Direction");
      await addExplainerAndNumber(14, results.soulUrgeFinal, "Soul Urge");
      await addExplainerAndNumber(15, results.personalityFinal, "Personality");
      await addExplainerAndNumber(16, results.maturityFinal, "Maturity");
      await addExplainerAndNumber(17, results.balanceFinal, "Balance");

      this._report(35, "Checking karmic debt");
      const karmicSet = new Set([13, 14, 16, 19]);
      if (
        [results.lifePathFinal, results.expressionFinal, results.soulUrgeFinal, results.birthdayFinal].some((n) =>
          karmicSet.has(Number(n))
        )
      ) {
        await copyPage(18, "Karmic Debt");
      }

      this._report(40, "Adding pinnacles");
      await copyPage(19, "Pinnacles Explainer");
      if (Array.isArray(results.pinnacles)) {
        for (const [i, val] of results.pinnacles.entries()) {
          if (val == null) continue;
          const nums = this._resolveNumber(val);
          if (nums.length === 0) {
            console.warn(`No mapping found for Pinnacle ${i + 1} value: ${val}`);
            continue;
          }
          for (const n of nums) await copyPage(n, `Pinnacle ${i + 1}`);
        }
      }

      this._report(50, "Adding challenges");
      await copyPage(20, "Challenges Explainer");
      if (Array.isArray(results.challenges)) {
        for (const [i, val] of results.challenges.entries()) {
          if (val == null || val === 0) continue;
          const nums = this._resolveNumber(val);
          if (nums.length === 0) {
            console.warn(`No mapping found for Challenge ${i + 1} value: ${val}`);
            continue;
          }
          for (const n of nums) await copyPage(n, `Challenge ${i + 1}`);
        }
      }

      this._report(60, "Adding numerology reflections");
      await copyPage(21, "Numerology Reflection 1");
      await copyPage(22, "Numerology Reflection 2");

      this._report(65, "Adding astrology section");
      await copyPage(37, "Astrology Cover");
      await copyPage(38, "Astrology Intro 1");
      await copyPage(39, "Astrology Intro 2");
      
      // Zodiac sign
      for (const n of this._resolveZodiac(results.zodiac))
        await copyPage(n, "Zodiac Sign");
      
      // Ruling planet(s) - DUAL PLANET SUPPORT
      const planetPages = this._getDualPlanetPages(results.rulingPlanet);
      for (const n of planetPages)
        await copyPage(n, `Ruling Planet page ${n}`);
      
      // Element
      for (const n of this._resolveElement(results.element))
        await copyPage(n, "Element");
      
      await copyPage(40, "Astrology Reflection 1");
      await copyPage(41, "Astrology Reflection 2");

      this._report(75, "Adding Tree of Life section");
      await copyPage(72, "Tree Cover");
      await copyPage(73, "Tree Intro 1");
      await copyPage(74, "Tree Intro 2");
      
      for (const n of this._resolveSefira(results.sefira))
        await copyPage(n, "Sefira");
      
      await copyPage(95, "Tree Reflection 1");
      await copyPage(96, "Tree Reflection 2");

      this._report(85, "Adding tarot section");
      await copyPage(97, "Tarot Cover");
      await copyPage(98, "Tarot Intro 1");
      await copyPage(99, "Tarot Intro 2");
      
      // === KEY TAROT CARDS (6 Major Arcana) ===
      this._report(88, "Adding key tarot cards");
      
      // 1. Life Lessons (First Name)
      if (keyTarotCards.lifeLessons !== null) {
        const pages = this._resolveMajorArcana(keyTarotCards.lifeLessons);
        for (const n of pages) await copyPage(n, `Tarot: Life Lessons (${keyTarotCards.lifeLessons})`);
      }
      
      // 2. Spiritual Support (Last Name)
      if (keyTarotCards.spiritualSupport !== null) {
        const pages = this._resolveMajorArcana(keyTarotCards.spiritualSupport);
        for (const n of pages) await copyPage(n, `Tarot: Spiritual Support (${keyTarotCards.spiritualSupport})`);
      }
      
      // 3. Life Path (DOB)
      if (keyTarotCards.lifePath !== null) {
        const pages = this._resolveMajorArcana(keyTarotCards.lifePath);
        for (const n of pages) await copyPage(n, `Tarot: Life Path (${keyTarotCards.lifePath})`);
      }
      
      // 4. Soul's Direction (Full Name + DOB)
      if (keyTarotCards.soulsDirection !== null) {
        const pages = this._resolveMajorArcana(keyTarotCards.soulsDirection);
        for (const n of pages) await copyPage(n, `Tarot: Soul's Direction (${keyTarotCards.soulsDirection})`);
      }
      
      // 5. Zodiac Sign
      if (keyTarotCards.zodiacSign !== null) {
        const pages = this._resolveMajorArcana(keyTarotCards.zodiacSign);
        for (const n of pages) await copyPage(n, `Tarot: Zodiac Sign (${keyTarotCards.zodiacSign})`);
      }
      
      // 6. Ruling Planet
      if (keyTarotCards.rulingPlanet !== null) {
        const pages = this._resolveMajorArcana(keyTarotCards.rulingPlanet);
        for (const n of pages) await copyPage(n, `Tarot: Ruling Planet (${keyTarotCards.rulingPlanet})`);
      }
      
      await copyPage(122, "Tarot Reflection 1");
      await copyPage(123, "Tarot Reflection 2");

      this._report(95, "Adding end pages");
      await copyPage(124, "End Notes 1");
      await copyPage(125, "End Notes 2");
      await copyPage(126, "Project Curiosity");
      await copyPage(127, "Sign Up");

      this._report(100, "Finalizing PDF");
      const bytes = await outPdf.save();

      if (this.options.autoDownload) {
        const blob = new Blob([bytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = this.options.downloadFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      }

      return bytes;
    } catch (err) {
      console.error("Critical PDF Assembly Error:", err);
      throw err;
    } 
  }
}

export default PDFAssembler;