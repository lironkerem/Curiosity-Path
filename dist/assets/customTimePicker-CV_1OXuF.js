class p{constructor(t){this.input=document.getElementById(t),this.container=null,this.dropdowns={hour:null,minute:null,period:null},this.init()}init(){this.input&&(this.createPickerUI(),this.input.type="text",this.input.readOnly=!0,this.input.placeholder="Select time...",this.input.addEventListener("click",t=>{t.preventDefault(),this.show()}),this.input.addEventListener("focus",t=>{t.preventDefault(),this.input.blur(),this.show()}))}createPickerUI(){const t=document.createElement("div");t.className="custom-time-picker-overlay",t.style.cssText=`
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 10000;
      align-items: center;
      justify-content: center;
    `;const e=document.createElement("div");e.className="custom-time-picker",e.style.cssText=`
      background: white;
      border-radius: 20px;
      padding: 25px;
      max-width: 90%;
      width: 400px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      position: relative;
    `,e.innerHTML=`
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h3 style="margin: 0; color: #3F7652; font-size: 24px;">Select Time of Birth</h3>
        <button class="close-time-picker" style="
          background: none;
          border: none;
          font-size: 30px;
          color: #666;
          cursor: pointer;
          line-height: 1;
          padding: 0;
          width: 30px;
          height: 30px;
        ">&times;</button>
      </div>

      <div style="margin-bottom: 15px; padding: 12px; background: #e8f5e9; border-radius: 10px; text-align: center;">
        <div style="font-size: 14px; color: #666; margin-bottom: 5px;">Optional - Best guess is fine!</div>
        <div style="font-size: 16px; color: #3F7652; font-weight: 600;">
          💡 If you don't know the exact time, choose morning/afternoon/evening or leave blank
        </div>
      </div>

      <!-- Quick Presets -->
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 8px; color: #3F7652; font-weight: 600; font-size: 16px;">Quick Select:</label>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
          <button class="preset-btn" data-time="06:00" style="
            padding: 10px;
            font-size: 14px;
            font-weight: 600;
            font-family: 'Amatic SC', cursive;
            background: white;
            color: #3F7652;
            border: 2px solid #3F7652;
            border-radius: 10px;
            cursor: pointer;
          ">🌅 Morning<br>6:00 AM</button>
          <button class="preset-btn" data-time="12:00" style="
            padding: 10px;
            font-size: 14px;
            font-weight: 600;
            font-family: 'Amatic SC', cursive;
            background: white;
            color: #3F7652;
            border: 2px solid #3F7652;
            border-radius: 10px;
            cursor: pointer;
          ">☀️ Noon<br>12:00 PM</button>
          <button class="preset-btn" data-time="18:00" style="
            padding: 10px;
            font-size: 14px;
            font-weight: 600;
            font-family: 'Amatic SC', cursive;
            background: white;
            color: #3F7652;
            border: 2px solid #3F7652;
            border-radius: 10px;
            cursor: pointer;
          ">🌙 Evening<br>6:00 PM</button>
          <button class="preset-btn" data-time="00:00" style="
            padding: 10px;
            font-size: 14px;
            font-weight: 600;
            font-family: 'Amatic SC', cursive;
            background: white;
            color: #3F7652;
            border: 2px solid #3F7652;
            border-radius: 10px;
            cursor: pointer;
          ">🌃 Midnight<br>12:00 AM</button>
          <button class="preset-btn" data-time="09:00" style="
            padding: 10px;
            font-size: 14px;
            font-weight: 600;
            font-family: 'Amatic SC', cursive;
            background: white;
            color: #3F7652;
            border: 2px solid #3F7652;
            border-radius: 10px;
            cursor: pointer;
          ">☕ Late Morning<br>9:00 AM</button>
          <button class="preset-btn" data-time="21:00" style="
            padding: 10px;
            font-size: 14px;
            font-weight: 600;
            font-family: 'Amatic SC', cursive;
            background: white;
            color: #3F7652;
            border: 2px solid #3F7652;
            border-radius: 10px;
            cursor: pointer;
          ">🌆 Night<br>9:00 PM</button>
        </div>
      </div>

      <div style="text-align: center; margin: 15px 0; color: #666; font-size: 16px; font-weight: 600;">
        - OR -
      </div>

      <!-- Exact Time Selection -->
      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 8px; color: #3F7652; font-weight: 600; font-size: 16px;">Exact Time (if known):</label>
        <div style="display: flex; gap: 10px; align-items: center; justify-content: center;">
          <select id="custom-hour" style="
            width: 80px;
            padding: 12px 8px;
            font-size: 20px;
            font-weight: 700;
            text-align: center;
            border: 2px solid #3F7652;
            border-radius: 10px;
            font-family: 'Amatic SC', cursive;
            background: white;
          ">
            <option value="">HH</option>
          </select>
          <span style="font-size: 24px; font-weight: 700; color: #3F7652;">:</span>
          <select id="custom-minute" style="
            width: 80px;
            padding: 12px 8px;
            font-size: 20px;
            font-weight: 700;
            text-align: center;
            border: 2px solid #3F7652;
            border-radius: 10px;
            font-family: 'Amatic SC', cursive;
            background: white;
          ">
            <option value="">MM</option>
          </select>
          <select id="custom-period" style="
            width: 90px;
            padding: 12px 8px;
            font-size: 18px;
            font-weight: 700;
            text-align: center;
            border: 2px solid #3F7652;
            border-radius: 10px;
            font-family: 'Amatic SC', cursive;
            background: white;
          ">
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      </div>

      <div style="display: flex; gap: 10px;">
        <button class="time-picker-skip" style="
          flex: 1;
          padding: 15px;
          font-size: 18px;
          font-weight: 700;
          font-family: 'Amatic SC', cursive;
          background: #ddd;
          color: #333;
          border: none;
          border-radius: 15px;
          cursor: pointer;
        ">Skip (Unknown)</button>
        <button class="time-picker-confirm" style="
          flex: 1;
          padding: 15px;
          font-size: 18px;
          font-weight: 700;
          font-family: 'Amatic SC', cursive;
          background: #3F7652;
          color: white;
          border: none;
          border-radius: 15px;
          cursor: pointer;
        ">Confirm</button>
      </div>
    `,t.appendChild(e),document.body.appendChild(t),this.container=t,this.populateHours(),this.populateMinutes(),this.dropdowns.hour=e.querySelector("#custom-hour"),this.dropdowns.minute=e.querySelector("#custom-minute"),this.dropdowns.period=e.querySelector("#custom-period"),e.querySelectorAll(".preset-btn").forEach(i=>{i.addEventListener("click",()=>{const o=i.dataset.time;this.setTimeFromPreset(o)})}),e.querySelector(".close-time-picker").addEventListener("click",()=>this.hide()),e.querySelector(".time-picker-skip").addEventListener("click",()=>{this.input.value="",this.hide()}),e.querySelector(".time-picker-confirm").addEventListener("click",()=>this.confirm()),t.addEventListener("click",i=>{i.target===t&&this.hide()})}populateHours(){var e;const t=((e=this.dropdowns)==null?void 0:e.hour)||this.container.querySelector("#custom-hour");for(let i=1;i<=12;i++){const o=document.createElement("option");o.value=i,o.textContent=i.toString().padStart(2,"0"),t.appendChild(o)}}populateMinutes(){var e;const t=((e=this.dropdowns)==null?void 0:e.minute)||this.container.querySelector("#custom-minute");for(let i=0;i<60;i+=5){const o=document.createElement("option");o.value=i,o.textContent=i.toString().padStart(2,"0"),t.appendChild(o)}}setTimeFromPreset(t){const[e,i]=t.split(":").map(Number);let o=e%12;o===0&&(o=12);const r=e>=12?"PM":"AM";this.dropdowns.hour.value=o,this.dropdowns.minute.value=i,this.dropdowns.period.value=r,this.container.querySelectorAll(".preset-btn").forEach(n=>{n.dataset.time===t?(n.style.background="#3F7652",n.style.color="white"):(n.style.background="white",n.style.color="#3F7652")})}show(){const t=this.input.value;if(t){const[e,i]=t.split(":"),o=parseInt(e),r=parseInt(i);let n=o%12;n===0&&(n=12);const s=o>=12?"PM":"AM";this.dropdowns.hour.value=n,this.dropdowns.minute.value=r,this.dropdowns.period.value=s}this.container.style.display="flex",document.body.style.overflow="hidden"}hide(){this.container.style.display="none",document.body.style.overflow=""}confirm(){const t=parseInt(this.dropdowns.hour.value),e=parseInt(this.dropdowns.minute.value),i=this.dropdowns.period.value;if(!t||isNaN(e)){alert("Please select a time or use a quick preset");return}let o=t;i==="PM"&&t!==12?o=t+12:i==="AM"&&t===12&&(o=0);const r=`${o.toString().padStart(2,"0")}:${e.toString().padStart(2,"0")}`;this.input.value=r,this.input.dispatchEvent(new Event("change",{bubbles:!0})),this.input.dispatchEvent(new Event("input",{bubbles:!0})),this.hide()}}export{p as CustomTimePicker};
