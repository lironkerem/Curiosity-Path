// Mini-Apps/SelfAnalysisPro/js/numerology.js
// Numerology Calculation Engine

class NumerologyEngine {
  constructor() {
    // Frozen constants
    this.masterNumbers  = Object.freeze(new Set([10, 11, 22, 33]));
    this.karmicNumbers  = Object.freeze([13, 14, 16, 19]);
  }

  letterValue(char) {
    if (!char) return 0;
    const code = char.toUpperCase().charCodeAt(0);
    if (code < 65 || code > 90) return 0;
    const value = (code - 64) % 9;
    return value === 0 ? 9 : value;
  }

  sumLetters(name, filterFn = () => true) {
    const letters = String(name || '').toUpperCase().replace(/[^A-Z]/g, '').split('');
    let raw = 0;
    const parts = [];

    for (const char of letters) {
      if (!filterFn(char)) continue;
      const value = this.letterValue(char);
      raw += value;
      parts.push(`${char}=${value}`);
    }

    return { raw, trace: parts.join(', ') || '\u2014' };
  }

  sumDigits(number) {
    return String(number).split('').reduce((sum, digit) => sum + (parseInt(digit, 10) || 0), 0);
  }

  reduceToFinal(number) {
    let n = parseInt(String(number), 10) || 0;
    while (n > 9 && !this.masterNumbers.has(n)) {
      n = this.sumDigits(n);
    }
    return n;
  }

  parseDateOfBirth(dateString) {
    if (!dateString) return { year: 0, month: 0, day: 0, digits: '' };

    // Preferred format: YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const parts = dateString.split('-');
      const year  = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const day   = parseInt(parts[2], 10);
      if (Number.isInteger(year) && Number.isInteger(month) && Number.isInteger(day)) {
        return {
          year,
          month,
          day,
          digits: `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`
        };
      }
    }

    // Fallback: Date object parse
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      const year  = date.getFullYear();
      const month = date.getMonth() + 1;
      const day   = date.getDate();
      return {
        year,
        month,
        day,
        digits: `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`
      };
    }

    return { year: 0, month: 0, day: 0, digits: '' };
  }

  analyze(data) {
    const {
      firstName   = '',
      middleName  = '',
      lastName    = '',
      dateOfBirth = '',
      includeY    = false
    } = data;

    const fullName  = [firstName, middleName, lastName].filter(Boolean).join(' ').trim();
    const dobInfo   = this.parseDateOfBirth(dateOfBirth);
    const vowelSet  = includeY
      ? new Set(['A','E','I','O','U','Y'])
      : new Set(['A','E','I','O','U']);

    // Name calculations
    const firstNameCalc    = this.sumLetters(firstName);
    const lastNameCalc     = this.sumLetters(lastName);
    const fullNameCalc     = this.sumLetters(fullName);
    const vowelsCalc       = this.sumLetters(fullName, char => vowelSet.has(char));
    const consonantsCalc   = this.sumLetters(fullName, char => !vowelSet.has(char));

    // Date calculations
    const lifePathRaw   = this.sumDigits(dobInfo.digits);
    const lifePathValue = this.reduceToFinal(lifePathRaw);
    const birthdayRaw   = dobInfo.day || 0;
    const birthdayValue = this.reduceToFinal(birthdayRaw);

    // Derived numbers
    const expressionRaw    = fullNameCalc.raw;
    const expressionValue  = this.reduceToFinal(expressionRaw);
    const soulDirectionRaw = expressionValue + lifePathValue;
    const soulDirectionValue = this.reduceToFinal(soulDirectionRaw);
    const maturityRaw      = firstNameCalc.raw + lastNameCalc.raw + lifePathRaw;
    const maturityValue    = this.reduceToFinal(maturityRaw);

    // Balance number from initials
    const initials = [];
    if (firstName)  initials.push(firstName[0]);
    if (middleName) initials.push(middleName[0]);
    if (lastName)   initials.push(lastName[0]);

    let balanceRaw = 0;
    const balanceParts = [];
    for (const char of initials) {
      const value = this.letterValue(char);
      balanceRaw += value;
      balanceParts.push(`${char}=${value}`);
    }
    const balanceValue = this.reduceToFinal(balanceRaw);

    // Karmic debt
    const karmicDebt = [];
    if (this.karmicNumbers.includes(expressionRaw))
      karmicDebt.push({ place: 'Expression', raw: expressionRaw });
    if (this.karmicNumbers.includes(lifePathRaw))
      karmicDebt.push({ place: 'Life Path',  raw: lifePathRaw });
    if (this.karmicNumbers.includes(vowelsCalc.raw))
      karmicDebt.push({ place: 'Soul Urge',  raw: vowelsCalc.raw });
    if (this.karmicNumbers.includes(birthdayRaw))
      karmicDebt.push({ place: 'Birthday',   raw: birthdayRaw });

    // Pinnacles
    const p1Raw = dobInfo.month + dobInfo.day;
    const p1    = this.reduceToFinal(p1Raw);
    const p2Raw = dobInfo.day   + dobInfo.year;
    const p2    = this.reduceToFinal(p2Raw);
    const p3Raw = p1 + p2;
    const p3    = this.reduceToFinal(p3Raw);
    const p4Raw = dobInfo.month + dobInfo.year;
    const p4    = this.reduceToFinal(p4Raw);

    // Challenges
    const monthReduced = this.reduceToFinal(dobInfo.month);
    const dayReduced   = this.reduceToFinal(dobInfo.day);
    const yearReduced  = this.reduceToFinal(this.sumDigits(dobInfo.year));

    const ch1Raw = Math.abs(dayReduced   - monthReduced);
    const ch2Raw = Math.abs(dayReduced   - yearReduced);
    const ch3Raw = Math.abs(ch1Raw       - ch2Raw);
    const ch4Raw = Math.abs(monthReduced - yearReduced);

    return {
      input: { firstName, middleName, lastName, fullName, dateOfBirth: dobInfo.digits, includeY },
      firstName:  { raw: firstNameCalc.raw,  value: this.reduceToFinal(firstNameCalc.raw),  trace: firstNameCalc.trace },
      lastName:   { raw: lastNameCalc.raw,   value: this.reduceToFinal(lastNameCalc.raw),   trace: lastNameCalc.trace },
      expression: { raw: expressionRaw,      value: expressionValue,                         trace: fullNameCalc.trace },
      lifePath:   { raw: lifePathRaw,        value: lifePathValue,                           trace: `DOB digits sum: ${dobInfo.digits}` },
      birthday:   { raw: birthdayRaw,        value: birthdayValue,                           trace: `Day: ${dobInfo.day}` },
      soulsDirection: {
        raw:   soulDirectionRaw,
        value: soulDirectionValue,
        trace: `Expression(${expressionValue}) + LifePath(${lifePathValue}) = ${soulDirectionRaw}`
      },
      maturity: {
        raw:   maturityRaw,
        value: maturityValue,
        trace: `FirstName(${firstNameCalc.raw}) + LastName(${lastNameCalc.raw}) + LifePath(${lifePathRaw}) = ${maturityRaw}`
      },
      soulUrge:    { raw: vowelsCalc.raw,    value: this.reduceToFinal(vowelsCalc.raw),    trace: vowelsCalc.trace },
      personality: { raw: consonantsCalc.raw, value: this.reduceToFinal(consonantsCalc.raw), trace: consonantsCalc.trace },
      balance:     { raw: balanceRaw,        value: balanceValue,                           trace: balanceParts.join(', ') || '\u2014' },
      karmicDebt,
      pinnacles: {
        p1: { raw: p1Raw, value: p1, trace: `Month(${dobInfo.month})+Day(${dobInfo.day})=${p1Raw}` },
        p2: { raw: p2Raw, value: p2, trace: `Day(${dobInfo.day})+Year(${dobInfo.year})=${p2Raw}` },
        p3: { raw: p3Raw, value: p3, trace: `P1(${p1})+P2(${p2})=${p3Raw}` },
        p4: { raw: p4Raw, value: p4, trace: `Month(${dobInfo.month})+Year(${dobInfo.year})=${p4Raw}` }
      },
      challenges: {
        ch1: { raw: ch1Raw, value: this.reduceToFinal(ch1Raw), trace: `|DayReduced(${dayReduced})-MonthReduced(${monthReduced})|=${ch1Raw}` },
        ch2: { raw: ch2Raw, value: this.reduceToFinal(ch2Raw), trace: `|DayReduced(${dayReduced})-YearReduced(${yearReduced})|=${ch2Raw}` },
        ch3: { raw: ch3Raw, value: this.reduceToFinal(ch3Raw), trace: `|Ch1(${ch1Raw})-Ch2(${ch2Raw})|=${ch3Raw}` },
        ch4: { raw: ch4Raw, value: this.reduceToFinal(ch4Raw), trace: `|MonthReduced(${monthReduced})-YearReduced(${yearReduced})|=${ch4Raw}` }
      }
    };
  }
}

window.NumerologyEngine = NumerologyEngine;
export default NumerologyEngine;
