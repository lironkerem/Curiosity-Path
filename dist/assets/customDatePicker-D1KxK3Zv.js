class d{constructor(t){this.input=document.getElementById(t),this.container=null,this.dropdowns={year:null,month:null,day:null},this.init()}init(){this.input&&(this.createPickerUI(),this.input.type="text",this.input.readOnly=!0,this.input.placeholder="Select date...",this.input.addEventListener("click",t=>{t.preventDefault(),this.show()}),this.input.addEventListener("focus",t=>{t.preventDefault(),this.input.blur(),this.show()}))}createPickerUI(){const t=document.createElement("div");t.className="custom-date-picker-overlay",t.style.cssText=`
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
    `;const e=document.createElement("div");e.className="custom-date-picker",e.style.cssText=`
      background: white;
      border-radius: 20px;
      padding: 25px;
      max-width: 90%;
      width: 400px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      position: relative;
    `,e.innerHTML=`
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h3 style="margin: 0; color: #3F7652; font-size: 24px;">Select Date of Birth</h3>
        <button class="close-picker" style="
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

      <div style="display: flex; gap: 10px; margin-bottom: 20px;">
        <div style="flex: 2;">
          <label style="display: block; margin-bottom: 5px; color: #3F7652; font-weight: 600; font-size: 16px;">Month</label>
          <select id="custom-month" style="
            width: 100%;
            padding: 12px;
            font-size: 16px;
            border: 2px solid #3F7652;
            border-radius: 10px;
            font-family: 'Amatic SC', cursive;
            background: white;
          ">
            <option value="">Month</option>
          </select>
        </div>

        <div style="flex: 1;">
          <label style="display: block; margin-bottom: 5px; color: #3F7652; font-weight: 600; font-size: 16px;">Day</label>
          <select id="custom-day" style="
            width: 100%;
            padding: 12px;
            font-size: 16px;
            border: 2px solid #3F7652;
            border-radius: 10px;
            font-family: 'Amatic SC', cursive;
            background: white;
          ">
            <option value="">Day</option>
          </select>
        </div>

        <div style="flex: 1.5;">
          <label style="display: block; margin-bottom: 5px; color: #3F7652; font-weight: 600; font-size: 16px;">Year</label>
          <select id="custom-year" style="
            width: 100%;
            padding: 12px;
            font-size: 16px;
            border: 2px solid #3F7652;
            border-radius: 10px;
            font-family: 'Amatic SC', cursive;
            background: white;
          ">
            <option value="">Year</option>
          </select>
        </div>
      </div>

      <div style="display: flex; gap: 10px;">
        <button class="picker-cancel" style="
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
        ">Cancel</button>
        <button class="picker-confirm" style="
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
    `,t.appendChild(e),document.body.appendChild(t),this.container=t,this.populateMonths(),this.populateYears(),this.populateDays(),this.dropdowns.year=e.querySelector("#custom-year"),this.dropdowns.month=e.querySelector("#custom-month"),this.dropdowns.day=e.querySelector("#custom-day"),this.dropdowns.month.addEventListener("change",()=>this.updateDays()),this.dropdowns.year.addEventListener("change",()=>this.updateDays()),e.querySelector(".close-picker").addEventListener("click",()=>this.hide()),e.querySelector(".picker-cancel").addEventListener("click",()=>this.hide()),e.querySelector(".picker-confirm").addEventListener("click",()=>this.confirm()),t.addEventListener("click",o=>{o.target===t&&this.hide()})}populateMonths(){const t=["January","February","March","April","May","June","July","August","September","October","November","December"],e=this.container.querySelector("#custom-month");t.forEach((o,n)=>{const i=document.createElement("option");i.value=n+1,i.textContent=o,e.appendChild(i)})}populateYears(){const t=this.container.querySelector("#custom-year"),e=new Date().getFullYear();for(let o=e;o>=1920;o--){const n=document.createElement("option");n.value=o,n.textContent=o,t.appendChild(n)}}populateDays(){const t=this.container.querySelector("#custom-day");t.innerHTML='<option value="">Day</option>';for(let e=1;e<=31;e++){const o=document.createElement("option");o.value=e,o.textContent=e,t.appendChild(o)}}updateDays(){const t=parseInt(this.dropdowns.year.value)||2e3,e=parseInt(this.dropdowns.month.value);if(!e)return;const o=new Date(t,e,0).getDate(),n=parseInt(this.dropdowns.day.value),i=this.dropdowns.day;i.innerHTML='<option value="">Day</option>';for(let s=1;s<=o;s++){const r=document.createElement("option");r.value=s,r.textContent=s,s===n&&s<=o&&(r.selected=!0),i.appendChild(r)}}show(){const t=this.input.value;if(t){const[e,o,n]=t.split("-");e&&(this.dropdowns.year.value=parseInt(e)),o&&(this.dropdowns.month.value=parseInt(o)),n&&(this.dropdowns.day.value=parseInt(n)),this.updateDays()}this.container.style.display="flex",document.body.style.overflow="hidden"}hide(){this.container.style.display="none",document.body.style.overflow=""}confirm(){const t=this.dropdowns.year.value,e=this.dropdowns.month.value.padStart(2,"0"),o=this.dropdowns.day.value.padStart(2,"0");if(!t||!e||!o){alert("Please select all fields");return}const n=`${t}-${e}-${o}`;this.input.value=n,this.input.dispatchEvent(new Event("change",{bubbles:!0})),this.input.dispatchEvent(new Event("input",{bubbles:!0})),this.hide()}}export{d as CustomDatePicker};
