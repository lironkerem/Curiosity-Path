import n from"./AffirmationsList-BRihhJ1z.js";const r={DEFAULT_AFFIRMATIONS:[{text:"I am worthy of love and belonging exactly as I am",tags:[]},{text:"I trust in the divine timing of my life",tags:[]},{text:"I am safe, protected, and guided",tags:[]}]};class a{constructor(t){this.app=t,this.affirmations=window.affirmations||n||{general_positive_affirmations:r.DEFAULT_AFFIRMATIONS},this.currentAffirmation=null,this._allAffirmations=null}_getAllAffirmations(){return this._allAffirmations?this._allAffirmations:(this._allAffirmations=Object.values(this.affirmations).flat().filter(Boolean),this._allAffirmations)}_extractText(t){return typeof t=="string"?t:t.text}_getDayOfYear(){const t=new Date,e=new Date(t.getFullYear(),0,0);return Math.floor((t-e)/864e5)}getDailyAffirmation(){const t=this.affirmations.general_positive_affirmations||[];if(!t.length)return console.warn("⚠️ No affirmations loaded, using default"),"I am worthy of love and belonging exactly as I am.";const e=this._getDayOfYear()%t.length,i=t[e];return this._extractText(i)}randomCard(){const t=this._getAllAffirmations();if(!t.length)console.warn("⚠️ No affirmations available, using default"),this.currentAffirmation="I am worthy of love and belonging exactly as I am.";else{const e=Math.floor(Math.random()*t.length),i=t[e];this.currentAffirmation=this._extractText(i)}this.render()}reset(){this.currentAffirmation=null,this.render()}render(){const t=document.getElementById("affirmations-tab");t&&(t.innerHTML=this.currentAffirmation?this._renderFullScreen():this._renderDashboard())}_renderDashboard(){return`
      <div style="background:var(--neuro-bg);padding:1.5rem;min-height:100vh;">
        <div class="universal-content">
          <h2 class="text-4xl font-bold text-white" style="margin-bottom: 1.5rem;">Positive Affirmations</h2>
          <p class="text-gray-400" style="margin-bottom: 2rem;">Powerful statements to reprogram your mindset</p>

          <div class="text-center" style="margin-bottom: 3rem;">
            <!-- Daily Affirmation Flip Card -->
            <div class="flip-card inline-block w-80 h-48" style="margin-bottom: 2rem;" onclick="this.classList.toggle('flipped')">
              <div class="flip-card-inner">
                <div class="flip-card-front bg-gradient-to-br from-pink-600 to-purple-600 p-8 flex items-center justify-center">
                  <div class="text-center">
                    <p class="text-white text-2xl font-bold" style="margin-bottom: 1rem;">Daily Affirmation</p>
                    <p class="text-pink-100" style="display:flex;align-items:center;justify-content:center;gap:0.4rem;">Tap to reveal <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg></p>
                  </div>
                </div>
                <div class="flip-card-back bg-gradient-to-br from-purple-600 to-blue-600 p-8 flex items-center justify-center">
                  <p class="text-white text-xl font-semibold text-center">
                    "${this.getDailyAffirmation()}"
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Random Affirmation Button -->
            <div>
              <button onclick="window.featuresManager.engines.affirmations.randomCard()" class="btn btn-primary text-lg" style="display:inline-flex;align-items:center;gap:0.5rem;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M16 3h5v5"/><path d="M4 20 21 3"/><path d="M21 16v5h-5"/><path d="M15 15l5.1 5.1"/><path d="M4 4l5 5"/></svg>
                Random Affirmation
              </button>
            </div>
          </div>
        </div>
      </div>
    `}_renderFullScreen(){return`
      <div class="min-h-screen bg-gray-900 p-6">
        <div class="max-w-4xl mx-auto flex items-center justify-center min-h-[80vh]">
          <div class="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-12 text-center w-full max-w-2xl">
            
            <!-- Icon Circle -->
            <div class="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto" style="margin-bottom: 2rem;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:48px;height:48px;color:white;"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>
            </div>
            
            <!-- Affirmation Text -->
            <p class="text-white text-4xl font-bold" style="margin-bottom: 3rem;">
              "${this.currentAffirmation}"
            </p>
            
            <!-- Action Buttons -->
            <div class="flex justify-center space-x-4">
              <button onclick="window.featuresManager.engines.affirmations.reset()" class="btn btn-secondary">
                ← Back
              </button>
              <button onclick="window.featuresManager.engines.affirmations.randomCard()" class="btn btn-primary" style="display:inline-flex;align-items:center;gap:0.5rem;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M16 3h5v5"/><path d="M4 20 21 3"/><path d="M21 16v5h-5"/><path d="M15 15l5.1 5.1"/><path d="M4 4l5 5"/></svg>
                Another One
              </button>
            </div>
          </div>
        </div>
      </div>
    `}}typeof window<"u"&&(window.AffirmationsEngine=a);export{a as default};
