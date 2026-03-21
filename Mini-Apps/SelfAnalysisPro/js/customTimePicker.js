// js/customTimePicker.js - Mobile-friendly time picker for birth time
// NO AUTO-INITIALIZATION - loader.js handles it

export class CustomTimePicker {
  constructor(inputId) {
    this.input = document.getElementById(inputId);
    this.container = null;
    this.dropdowns = { hour: null, minute: null, period: null };
    this.init();
  }

  init() {
    if (!this.input) return;

    // Create custom picker container
    this.createPickerUI();

    // ALWAYS hide native time input and use custom picker
    this.input.type = 'text';
    this.input.readOnly = true;
    this.input.placeholder = 'Select time...';

    // Show custom picker on click
    this.input.addEventListener('click', (e) => {
      e.preventDefault();
      this.show();
    });

    this.input.addEventListener('focus', (e) => {
      e.preventDefault();
      this.input.blur();
      this.show();
    });
  }

  createPickerUI() {
    const wrapper = document.createElement('div');
    wrapper.className = 'custom-time-picker-overlay';
    wrapper.style.cssText = `
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
    `;

    const picker = document.createElement('div');
    picker.className = 'custom-time-picker';
    picker.style.cssText = `
      background: white;
      border-radius: 20px;
      padding: 25px;
      max-width: 90%;
      width: 400px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      position: relative;
    `;

    picker.innerHTML = `
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
    `;

    wrapper.appendChild(picker);
    document.body.appendChild(wrapper);
    this.container = wrapper;

    // Populate dropdowns
    this.populateHours();
    this.populateMinutes();

    // Store references
    this.dropdowns.hour = picker.querySelector('#custom-hour');
    this.dropdowns.minute = picker.querySelector('#custom-minute');
    this.dropdowns.period = picker.querySelector('#custom-period');

    // Preset buttons
    picker.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const time = btn.dataset.time;
        this.setTimeFromPreset(time);
      });
    });

    // Event listeners
    picker.querySelector('.close-time-picker').addEventListener('click', () => this.hide());
    picker.querySelector('.time-picker-skip').addEventListener('click', () => {
      this.input.value = '';
      this.hide();
    });
    picker.querySelector('.time-picker-confirm').addEventListener('click', () => this.confirm());

    // Close on overlay click
    wrapper.addEventListener('click', (e) => {
      if (e.target === wrapper) this.hide();
    });
  }

  populateHours() {
    const select = this.dropdowns?.hour || this.container.querySelector('#custom-hour');
    for (let hour = 1; hour <= 12; hour++) {
      const option = document.createElement('option');
      option.value = hour;
      option.textContent = hour.toString().padStart(2, '0');
      select.appendChild(option);
    }
  }

  populateMinutes() {
    const select = this.dropdowns?.minute || this.container.querySelector('#custom-minute');
    for (let minute = 0; minute < 60; minute += 5) {
      const option = document.createElement('option');
      option.value = minute;
      option.textContent = minute.toString().padStart(2, '0');
      select.appendChild(option);
    }
  }

  setTimeFromPreset(time24) {
    const [hour24, minute] = time24.split(':').map(Number);
    
    let hour12 = hour24 % 12;
    if (hour12 === 0) hour12 = 12;
    
    const period = hour24 >= 12 ? 'PM' : 'AM';
    
    this.dropdowns.hour.value = hour12;
    this.dropdowns.minute.value = minute;
    this.dropdowns.period.value = period;
    
    // Highlight selected preset
    this.container.querySelectorAll('.preset-btn').forEach(btn => {
      if (btn.dataset.time === time24) {
        btn.style.background = '#3F7652';
        btn.style.color = 'white';
      } else {
        btn.style.background = 'white';
        btn.style.color = '#3F7652';
      }
    });
  }

  show() {
    // Pre-fill with current value if exists
    const currentValue = this.input.value;
    if (currentValue) {
      const [hour24Str, minuteStr] = currentValue.split(':');
      const hour24 = parseInt(hour24Str);
      const minute = parseInt(minuteStr);
      
      let hour12 = hour24 % 12;
      if (hour12 === 0) hour12 = 12;
      
      const period = hour24 >= 12 ? 'PM' : 'AM';
      
      this.dropdowns.hour.value = hour12;
      this.dropdowns.minute.value = minute;
      this.dropdowns.period.value = period;
    }

    this.container.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  hide() {
    this.container.style.display = 'none';
    document.body.style.overflow = '';
  }

  confirm() {
    const hour12 = parseInt(this.dropdowns.hour.value);
    const minute = parseInt(this.dropdowns.minute.value);
    const period = this.dropdowns.period.value;

    if (!hour12 || isNaN(minute)) {
      alert('Please select a time or use a quick preset');
      return;
    }

    // Convert to 24-hour format
    let hour24 = hour12;
    if (period === 'PM' && hour12 !== 12) {
      hour24 = hour12 + 12;
    } else if (period === 'AM' && hour12 === 12) {
      hour24 = 0;
    }

    // Format as HH:MM
    const timeString = `${hour24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    
    // Update input
    this.input.value = timeString;
    
    // Trigger change event
    this.input.dispatchEvent(new Event('change', { bubbles: true }));
    this.input.dispatchEvent(new Event('input', { bubbles: true }));

    this.hide();
  }
}

// NO AUTO-INITIALIZATION - loader.js handles it