// ============================================
// INQUIRY ENGINE - OPTIMIZED
// ============================================

import { InquiryList } from './Data/InquiryList.js';

const INTENSITY_MAP = {
  beginner: [1, 2],
  intermediate: [1, 2, 3],
  advanced: [1, 2, 3, 4]
};

export class InquiryEngine {
  constructor(userLevel = 'beginner') {
    this.userLevel = userLevel;
    this.todaySelections = [];
  }

  getAllowedIntensities() {
    return INTENSITY_MAP[this.userLevel] || INTENSITY_MAP.beginner;
  }

  getRandomQuestion(domain) {
    const allowedIntensities = this.getAllowedIntensities();
    let candidates = InquiryList.filter(q => 
      q.domain === domain && 
      allowedIntensities.includes(q.intensity) && 
      !this.todaySelections.includes(q.id)
    );

    // Reset domain selections if exhausted
    if (!candidates.length) {
      this.todaySelections = this.todaySelections.filter(id => {
        const q = InquiryList.find(item => item.id === id);
        return q?.domain !== domain;
      });
      
      // Recalculate candidates
      candidates = InquiryList.filter(q => 
        q.domain === domain && 
        allowedIntensities.includes(q.intensity)
      );
      
      if (!candidates.length) {
        console.warn(`No inquiries found for domain: ${domain}`);
        return null;
      }
    }

    const choice = candidates[Math.floor(Math.random() * candidates.length)];
    this.todaySelections.push(choice.id);
    return choice;
  }

  generateDailyInquiries(domains = null) {
    const selectedDomains = domains || this._getUniqueDomains();
    return selectedDomains
      .map(domain => this.getRandomQuestion(domain))
      .filter(Boolean); // Remove nulls
  }

  _getUniqueDomains() {
    return [...new Set(InquiryList.map(q => q.domain))];
  }

  setUserLevel(level) {
    if (INTENSITY_MAP[level]) {
      this.userLevel = level;
    } else {
      console.warn(`Invalid level: ${level}. Using 'beginner'.`);
      this.userLevel = 'beginner';
    }
  }

  resetDailySelections() {
    this.todaySelections = [];
  }
}