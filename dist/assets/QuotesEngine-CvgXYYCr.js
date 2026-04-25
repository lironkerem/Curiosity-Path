function r(o){return String(o??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const a=Object.freeze({DEFAULT_QUOTES:Object.freeze([{text:"The quieter you become, the more you are able to hear",author:"Rumi"},{text:"Be the change you wish to see in the world",author:"Gandhi"},{text:"Peace comes from within. Do not seek it without",author:"Buddha"}])});class s{constructor(t){this.app=t,this.quotes=a.DEFAULT_QUOTES}getDailyQuote(){const t=this._getDayOfYear();return this.quotes[t%this.quotes.length]}_getDayOfYear(){const t=new Date,e=new Date(t.getFullYear(),0,0);return Math.floor((t-e)/864e5)}render(){const t=document.getElementById("quotes-tab");if(!t)return;const e=this.getDailyQuote();t.innerHTML=`
      <div class="min-h-screen bg-gray-900 p-6">
        <div class="max-w-7xl mx-auto">

          <h2 class="text-4xl font-bold text-white" style="margin-bottom:1rem;">Wisdom &amp; Quotes</h2>
          <p class="text-gray-400" style="margin-bottom:2rem;">Inspiration from spiritual teachers</p>

          <!-- Featured Daily Quote -->
          <div class="bg-gradient-to-r from-purple-900 to-blue-900 rounded-3xl p-12 text-center border border-purple-500/30" style="margin-bottom:3rem;">
            <p class="text-purple-200 text-sm uppercase tracking-wider" style="margin-bottom:1.5rem;">Quote of the Day</p>
            <p class="text-white text-4xl font-light italic" style="margin-bottom:2rem;">"${r(e.text)}"</p>
            <p class="text-purple-300 text-xl">- ${r(e.author)}</p>
          </div>

          <!-- All Quotes Gallery -->
          <h3 class="text-2xl font-bold text-white" style="margin-bottom:1.5rem;">All Quotes</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${this._renderQuotesGrid()}
          </div>
        </div>
      </div>
    `}_renderQuotesGrid(){return this.quotes.map(t=>`
      <div class="card">
        <p class="text-white text-lg italic" style="margin-bottom:1rem;">"${r(t.text)}"</p>
        <p class="text-purple-400">- ${r(t.author)}</p>
      </div>
    `).join("")}}export{s as default};
