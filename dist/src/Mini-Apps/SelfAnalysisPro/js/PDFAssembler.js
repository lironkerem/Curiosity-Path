/**
 * Mini-Apps/SelfAnalysisPro/js/PDFAssembler.js
 * Patched: frozen maps, removed console.log, safe page-number validation,
 * lazy pdf-lib load via window.loadPdfLib(), safe download link pattern.
 */

class PDFAssembler {
  constructor(opts = {}) {
    this.sourcePdfUrl         = opts.sourcePdfUrl         || null;
    this.sourcePdfArrayBuffer = opts.sourcePdfArrayBuffer || null;
    this.progress = typeof opts.progress === 'function' ? opts.progress : () => {};
    this.options  = Object.assign(
      { autoDownload: false, downloadFilename: 'Self-Analysis-Report.pdf' },
      opts.options || {}
    );
    this.pdfLib = null;

    // Frozen page-number maps
    this.maps = Object.freeze({
      numbers: Object.freeze({
        "1": 24, "2": 25, "3": 26, "4": 27, "5": 28, "6": 29,
        "7": 30, "8": 31, "9": 32, "10": 33, "11": 34, "22": 35, "33": 36
      }),
      zodiac: Object.freeze({
        aries: 43, taurus: 44, gemini: 45, cancer: 46, leo: 47, virgo: 48,
        libra: 49, scorpio: 50, sagittarius: 51, capricorn: 52, aquarius: 53, pisces: 54
      }),
      planets: Object.freeze({
        sun: 56, mercury: 57, venus: 58, moon: 59, mars: 60,
        jupiter: 61, saturn: 62, earth: 63, pluto: 64, neptune: 65, uranus: 66
      }),
      elements: Object.freeze({ earth: 68, air: 69, water: 70, fire: 71 }),
      sefira: Object.freeze({
        keter: [75,76], kether: [75,76],
        chokhmah: [77,78], chochma: [77,78], chokmah: [77,78],
        binah: [79,80], chesed: [81,82],
        gevurah: [83,84], gvurah: [83,84], geburah: [83,84],
        tiferet: [85,86], tiphareth: [85,86],
        netzach: [87,88], netzah: [87,88],
        hod: [89,90], yesod: [91,92],
        malkuth: [93,94], malchut: [93,94], malkut: [93,94]
      }),
      majorArcana: Object.freeze({
        0:100, 1:101, 2:102, 3:103, 4:104, 5:105,
        6:106, 7:107, 8:108, 9:109, 10:110, 11:111,
        12:112, 13:113, 14:114, 15:115, 16:116, 17:117,
        18:118, 19:119, 20:120, 21:121
      })
    });
  }

  _report(pct, msg) {
    try { this.progress(pct, msg); } catch { /* noop */ }
  }

  async _fetchArrayBuffer(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch PDF: ${res.statusText}`);
    return res.arrayBuffer();
  }

  _resolveNumber(n)  { const p = this.maps.numbers[String(n)];                            return p ? [p] : []; }
  _resolveZodiac(z)  { const p = this.maps.zodiac[String(z).toLowerCase()];                return p ? [p] : []; }
  _resolvePlanet(pl) { const p = this.maps.planets[String(pl).toLowerCase()];              return p ? [p] : []; }
  _resolveElement(el){ const p = this.maps.elements[String(el).toLowerCase()];             return p ? [p] : []; }
  _resolveSefira(s)  {
    const name = String(s).split('(')[0].trim().toLowerCase();
    const p = this.maps.sefira[name];
    return p ? (Array.isArray(p) ? p : [p]) : [];
  }
  _resolveMajorArcana(n) {
    const p = this.maps.majorArcana[Number(n)];
    return p ? [p] : [];
  }

  _getDualPlanetPages(planetString) {
    if (!planetString) return [];
    return String(planetString).split(',')
      .map(p => p.trim())
      .flatMap(planet => this._resolvePlanet(planet));
  }

  _reduceToMajorArcana(number) {
    if (!number) return null;
    let n = Number(number);
    if (n === 11 || n === 22) return n;
    while (n > 22) {
      const digits = String(n).split('').map(Number);
      n = digits.reduce((a, b) => a + b, 0);
      if (n === 11 || n === 22) break;
    }
    return (n === 22 || n === 0) ? 0 : n;
  }

  _getZodiacMajorArcana(zodiacSign) {
    const map = Object.freeze({
      aries: 4, taurus: 5, gemini: 6, cancer: 7,
      leo: 8, virgo: 9, libra: 11, scorpio: 13,
      sagittarius: 14, capricorn: 15, aquarius: 17, pisces: 18
    });
    return map[String(zodiacSign).toLowerCase()] || null;
  }

  _getPlanetMajorArcana(planetString) {
    if (!planetString) return null;
    const primaryPlanet = String(planetString).split(',')[0].trim().toLowerCase();
    const map = Object.freeze({
      sun: 19, moon: 2, mercury: 1, venus: 3,
      mars: 16, jupiter: 10, saturn: 21,
      uranus: 0, neptune: 12, pluto: 20
    });
    return map[primaryPlanet] ?? null;
  }

  _extractKeyTarotCards(appState) {
    const numerology = appState.analysis?.numerology || {};
    const astrology  = appState.analysis?.astrology  || {};
    return {
      lifeLessons:     this._reduceToMajorArcana(numerology.firstName?.value),
      spiritualSupport:this._reduceToMajorArcana(numerology.lastName?.value),
      lifePath:        this._reduceToMajorArcana(numerology.lifePath?.value),
      soulsDirection:  this._reduceToMajorArcana(numerology.soulsDirection?.value),
      zodiacSign:      this._getZodiacMajorArcana(astrology.zodiac?.name),
      rulingPlanet:    this._getPlanetMajorArcana(astrology.zodiac?.planet)
    };
  }

  async assemble(appState = {}) {
    // Lazy-load pdf-lib
    if (!this.pdfLib) {
      if (typeof window.loadPdfLib === 'function') await window.loadPdfLib();
      this.pdfLib = window.PDFLib || window.pdfLib || null;
      if (!this.pdfLib) throw new Error('pdf-lib failed to load');
    }

    try {
      this._report(5, 'Loading source PDF');

      const numerology = appState.analysis?.numerology || {};
      const astrology  = appState.analysis?.astrology  || {};

      const results = {
        firstNameFinal:     numerology.firstName?.value,
        lastNameFinal:      numerology.lastName?.value,
        expressionFinal:    numerology.expression?.value,
        lifePathFinal:      numerology.lifePath?.value,
        birthdayFinal:      numerology.birthday?.value,
        soulsDirectionFinal:numerology.soulsDirection?.value,
        soulUrgeFinal:      numerology.soulUrge?.value,
        personalityFinal:   numerology.personality?.value,
        maturityFinal:      numerology.maturity?.value,
        balanceFinal:       numerology.balance?.value,
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
        zodiac:       astrology.zodiac?.name,
        rulingPlanet: astrology.zodiac?.planet,
        element:      astrology.zodiac?.element,
        sefira:       astrology.sefira
      };

      const keyTarotCards = this._extractKeyTarotCards(appState);

      let sourceBytes;
      if (this.sourcePdfArrayBuffer) {
        sourceBytes = this.sourcePdfArrayBuffer;
      } else if (this.sourcePdfUrl) {
        sourceBytes = await this._fetchArrayBuffer(this.sourcePdfUrl);
      } else {
        throw new Error('No Source PDF provided');
      }

      const { PDFDocument } = this.pdfLib;
      const srcPdf = await PDFDocument.load(sourceBytes);
      const outPdf = await PDFDocument.create();
      const totalPages = srcPdf.getPageCount();

      const copyPage = async (n, label = 'Unknown') => {
        if (n == null) return;
        const pageNum = parseInt(String(n), 10);
        if (!Number.isInteger(pageNum) || pageNum < 1 || pageNum > totalPages) {
          console.warn(`Skipping ${label}: page ${n} out of range (1–${totalPages})`);
          return;
        }
        const [p] = await outPdf.copyPages(srcPdf, [pageNum - 1]);
        outPdf.addPage(p);
      };

      const addExplainerAndNumber = async (explainerPage, value, label) => {
        if (explainerPage) await copyPage(explainerPage, `${label} explainer`);
        if (value == null) return;
        const nums = this._resolveNumber(value);
        for (const n of nums) await copyPage(n, `${label} number ${value}`);
      };

      // ===== ASSEMBLY =====
      this._report(10, 'Adding cover pages');
      for (const [n, lbl] of [[1,'Cover'],[2,'Welcome'],[3,'How to use'],[4,'Overview']]) await copyPage(n, lbl);

      this._report(15, 'Adding numerology section');
      for (const [n, lbl] of [[5,'Numerology cover'],[6,'Numerology intro 1'],[7,'Numerology intro 2']]) await copyPage(n, lbl);

      this._report(20, 'Processing numerology numbers');
      await addExplainerAndNumber(8,  results.firstNameFinal,     'First Name (Life Lessons)');
      await addExplainerAndNumber(9,  results.lastNameFinal,      'Last Name (Spiritual Support)');
      await addExplainerAndNumber(10, results.expressionFinal,    'Expression/Destiny');
      await addExplainerAndNumber(11, results.lifePathFinal,      'Life Path');
      await addExplainerAndNumber(12, results.birthdayFinal,      'Birthday');
      await addExplainerAndNumber(13, results.soulsDirectionFinal,'Soul\'s Direction');
      await addExplainerAndNumber(14, results.soulUrgeFinal,      'Soul Urge');
      await addExplainerAndNumber(15, results.personalityFinal,   'Personality');
      await addExplainerAndNumber(16, results.maturityFinal,      'Maturity');
      await addExplainerAndNumber(17, results.balanceFinal,       'Balance');

      this._report(35, 'Checking karmic debt');
      const karmicSet = Object.freeze(new Set([13, 14, 16, 19]));
      if ([results.lifePathFinal, results.expressionFinal, results.soulUrgeFinal, results.birthdayFinal].some(n => karmicSet.has(Number(n)))) {
        await copyPage(18, 'Karmic Debt');
      }

      this._report(40, 'Adding pinnacles');
      await copyPage(19, 'Pinnacles Explainer');
      if (Array.isArray(results.pinnacles)) {
        for (const [i, val] of results.pinnacles.entries()) {
          if (val == null) continue;
          for (const n of this._resolveNumber(val)) await copyPage(n, `Pinnacle ${i + 1}`);
        }
      }

      this._report(50, 'Adding challenges');
      await copyPage(20, 'Challenges Explainer');
      if (Array.isArray(results.challenges)) {
        for (const [i, val] of results.challenges.entries()) {
          if (val == null || val === 0) continue;
          for (const n of this._resolveNumber(val)) await copyPage(n, `Challenge ${i + 1}`);
        }
      }

      this._report(60, 'Adding numerology reflections');
      await copyPage(21, 'Numerology Reflection 1');
      await copyPage(22, 'Numerology Reflection 2');

      this._report(65, 'Adding astrology section');
      for (const [n, lbl] of [[37,'Astrology Cover'],[38,'Astrology Intro 1'],[39,'Astrology Intro 2']]) await copyPage(n, lbl);
      for (const n of this._resolveZodiac(results.zodiac))           await copyPage(n, 'Zodiac Sign');
      for (const n of this._getDualPlanetPages(results.rulingPlanet)) await copyPage(n, 'Ruling Planet');
      for (const n of this._resolveElement(results.element))         await copyPage(n, 'Element');
      await copyPage(40, 'Astrology Reflection 1');
      await copyPage(41, 'Astrology Reflection 2');

      this._report(75, 'Adding Tree of Life section');
      for (const [n, lbl] of [[72,'Tree Cover'],[73,'Tree Intro 1'],[74,'Tree Intro 2']]) await copyPage(n, lbl);
      for (const n of this._resolveSefira(results.sefira)) await copyPage(n, 'Sefira');
      await copyPage(95, 'Tree Reflection 1');
      await copyPage(96, 'Tree Reflection 2');

      this._report(85, 'Adding tarot section');
      for (const [n, lbl] of [[97,'Tarot Cover'],[98,'Tarot Intro 1'],[99,'Tarot Intro 2']]) await copyPage(n, lbl);

      this._report(88, 'Adding key tarot cards');
      const tarotEntries = Object.freeze([
        ['lifeLessons',      'Life Lessons'],
        ['spiritualSupport', 'Spiritual Support'],
        ['lifePath',         'Life Path'],
        ['soulsDirection',   "Soul's Direction"],
        ['zodiacSign',       'Zodiac Sign'],
        ['rulingPlanet',     'Ruling Planet']
      ]);
      for (const [key, label] of tarotEntries) {
        if (keyTarotCards[key] !== null && keyTarotCards[key] !== undefined) {
          for (const n of this._resolveMajorArcana(keyTarotCards[key])) await copyPage(n, `Tarot: ${label}`);
        }
      }

      await copyPage(122, 'Tarot Reflection 1');
      await copyPage(123, 'Tarot Reflection 2');

      this._report(95, 'Adding end pages');
      for (const [n, lbl] of [[124,'End Notes 1'],[125,'End Notes 2'],[126,'Project Curiosity'],[127,'Sign Up']]) await copyPage(n, lbl);

      this._report(100, 'Finalizing PDF');
      const bytes = await outPdf.save();

      if (this.options.autoDownload) {
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = this.options.downloadFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      }

      return bytes;
    } catch (err) {
      console.error('PDF Assembly Error:', err);
      throw err;
    }
  }
}

export default PDFAssembler;
