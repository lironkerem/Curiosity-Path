/**
 * LUNAR-CONFIG.JS v3.0
 * Shared content generators for all lunar phase rooms.
 * Loaded once; all phase rooms depend on this.
 */

const LunarConfig = {

    generateIntentionPracticeContent(userData, affirmations, labels) {
        const { intention = '', affirmation = '', releaseList = '' } = userData;

        const affirmationButtons = affirmations.map(aff => `
            <button data-affirmation="${this._escapeAttr(aff)}" class="lunar-affirmation-btn">
                ${this._escapeHtml(aff)}
            </button>`
        ).join('');

        return `
            <div class="lunar-popup-section">
                <h3>Purpose</h3>
                <p>${labels.purpose}</p>
            </div>

            <div class="lunar-popup-section">
                <h3>One Clear Intention</h3>
                <p>Write one sentence beginning with:</p>
                <div class="lunar-popup-highlight">
                    <p>"${labels.intentionPrompt}"</p>
                </div>
                <textarea id="intentionText" class="lunar-textarea-large"
                    style="min-height:80px;" maxlength="500"
                    aria-label="Your intention"
                    placeholder="${labels.intentionPrompt}"
                >${this._escapeHtml(intention)}</textarea>
                <p class="lunar-helper-text">${labels.intentionHelper}</p>
            </div>

            <div class="lunar-popup-section">
                <h3>One ${labels.affirmationType} Affirmation</h3>
                <p>${labels.affirmationPrompt}</p>
                <div class="lunar-affirmation-grid">${affirmationButtons}</div>
                <textarea id="affirmationText" class="lunar-textarea-large"
                    style="min-height:80px;" maxlength="300"
                    aria-label="Your affirmation"
                    placeholder="Or write your own..."
                >${this._escapeHtml(affirmation)}</textarea>
                ${labels.affirmationHelper ? `<p class="lunar-helper-text">${labels.affirmationHelper}</p>` : ''}
            </div>

            <div class="lunar-popup-section">
                <h3>${labels.listTitle}</h3>
                <p>${labels.listPrompt}</p>
                ${labels.listHelper ? `<p class="lunar-helper-text">${labels.listHelper}</p>` : ''}
                <textarea id="releaseListText" class="lunar-textarea-large"
                    style="min-height:120px;" maxlength="1000"
                    aria-label="${labels.listTitle}"
                    placeholder="1. &#10;2. &#10;3. "
                >${this._escapeHtml(releaseList)}</textarea>
                ${labels.listFooter ? `<div class="lunar-popup-highlight"><p>${labels.listFooter}</p></div>` : ''}
            </div>

            <div class="lunar-popup-footer">
                <button class="lunar-popup-btn" data-action="save-practice" aria-label="Save your practice">
                    Save Practice
                </button>
            </div>`;
    },

    generateFutureAlignmentContent({ purpose, steps, guideline }) {
        return `
            <div class="lunar-popup-section">
                <h3>Purpose</h3>
                <p>${purpose}</p>
            </div>
            <div class="lunar-popup-section">
                <h3>Practice Steps</h3>
                <ul>${steps.map(s => `<li>${s}</li>`).join('')}</ul>
            </div>
            <div class="lunar-popup-highlight"><p>${guideline}</p></div>`;
    },

    generateBodyPracticeContent({ purpose, steps, guideline }) {
        return `
            <div class="lunar-popup-section">
                <h3>Purpose</h3>
                <p>${purpose}</p>
            </div>
            <div class="lunar-popup-section">
                <h3>Practice Steps</h3>
                <ul>${steps.map(s => `<li>${s}</li>`).join('')}</ul>
                <div class="lunar-popup-highlight" style="margin-top:1rem;">
                    <p>${guideline}</p>
                </div>
            </div>`;
    },

    generateEnergyAwarenessContent(cfg) {
        return `
            <div class="lunar-popup-section">
                <h3>Purpose</h3>
                <p>${cfg.purpose}</p>
            </div>
            <div class="lunar-popup-section">
                <h3>Energy Direction</h3>
                <ul>${cfg.energySteps.map(s => `<li>${s}</li>`).join('')}</ul>
                <div class="lunar-popup-highlight"><p>${cfg.energyGuideline}</p></div>
            </div>
            <div class="lunar-popup-section">
                <h3>${cfg.awarenessTitle}</h3>
                <p>${cfg.awarenessPrompt}</p>
                ${cfg.awarenessExample ? `<p class="lunar-helper-text"><em>${cfg.awarenessExample}</em></p>` : ''}
            </div>
            <div class="lunar-popup-section">
                <h3>Closing</h3>
                <div class="lunar-popup-highlight"><p>"${cfg.closingStatement}"</p></div>
                <p>Say once, out loud or silently. End the practice.</p>
            </div>`;
    },

    _escapeHtml(text) {
        if (!text) return '';
        const d = document.createElement('div');
        d.textContent = text;
        return d.innerHTML;
    },

    _escapeAttr(text) {
        if (!text) return '';
        return text
            .replace(/&/g, '&amp;').replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
};

export { LunarConfig };
