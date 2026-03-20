// Mini-Apps/SelfAnalysisPro/js/customTimePicker.js
// Mobile-friendly time picker for birth time
// NO AUTO-INITIALIZATION — loader.js handles it

export class CustomTimePicker {
  constructor(inputId) {
    this.input     = document.getElementById(inputId);
    this.container = null;
    this.dropdowns = { hour: null, minute: null, period: null };
    this._errorEl  = null;
    this.init();
  }

  init() {
    if (!this.input) return;

    this.createPickerUI();

    this.input.type        = 'text';
    this.input.readOnly    = true;
    this.input.placeholder = 'Select time...';

    this.input.addEventListener('click', e => { e.preventDefault(); this.show(); });
    this.input.addEventListener('focus', e => { e.preventDefault(); this.input.blur(); this.show(); });
  }

  createPickerUI() {
    const wrapper = document.createElement('div');
    wrapper.className = 'custom-time-picker-overlay';
    wrapper.setAttribute('role', 'dialog');
    wrapper.setAttribute('aria-modal', 'true');
    wrapper.setAttribute('aria-labelledby', 'time-picker-title');
    wrapper.style.cssText = 'display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:10000;align-items:center;justify-content:center;';

    const picker = document.createElement('div');
    picker.className  = 'custom-time-picker';
    picker.style.cssText = 'background:white;border-radius:20px;padding:25px;max-width:90%;width:400px;box-shadow:0 10px 40px rgba(0,0,0,0.3);position:relative;';

    // ---- Header ----
    const header = document.createElement('div');
    header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;';

    const title = document.createElement('h3');
    title.id = 'time-picker-title';
    title.style.cssText = 'margin:0;color:#3F7652;font-size:24px;';
    title.textContent = 'Select Time of Birth';

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'close-time-picker';
    closeBtn.setAttribute('aria-label', 'Close time picker');
    closeBtn.style.cssText = 'background:none;border:none;font-size:30px;color:#666;cursor:pointer;line-height:1;padding:0;width:30px;height:30px;';
    closeBtn.textContent = '\u00D7';

    header.append(title, closeBtn);

    // ---- Info box ----
    const infoBox = document.createElement('div');
    infoBox.style.cssText = 'margin-bottom:15px;padding:12px;background:#e8f5e9;border-radius:10px;text-align:center;';
    const infoSmall = document.createElement('div');
    infoSmall.style.cssText = 'font-size:14px;color:#666;margin-bottom:5px;';
    infoSmall.textContent = 'Optional - Best guess is fine!';
    const infoTip = document.createElement('div');
    infoTip.style.cssText = 'font-size:16px;color:#3F7652;font-weight:600;';
    infoTip.textContent = '\uD83D\uDCA1 If you don\u2019t know the exact time, choose morning/afternoon/evening or leave blank';
    infoBox.append(infoSmall, infoTip);

    // ---- Quick Presets ----
    const presetLabel = document.createElement('label');
    presetLabel.style.cssText = 'display:block;margin-bottom:8px;color:#3F7652;font-weight:600;font-size:16px;';
    presetLabel.textContent = 'Quick Select:';

    const presetGrid = document.createElement('div');
    presetGrid.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:15px;';

    const presets = Object.freeze([
      { time: '06:00', label: '\uD83C\uDF05 Morning\n6:00 AM' },
      { time: '12:00', label: '\u2600\uFE0F Noon\n12:00 PM' },
      { time: '18:00', label: '\uD83C\uDF19 Evening\n6:00 PM' },
      { time: '00:00', label: '\uD83C\uDF03 Midnight\n12:00 AM' },
      { time: '09:00', label: '\u2615 Late Morning\n9:00 AM' },
      { time: '21:00', label: '\uD83C\uDF06 Night\n9:00 PM' }
    ]);

    presets.forEach(({ time, label }) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'preset-btn';
      btn.dataset.time = time;
      btn.setAttribute('aria-label', label.replace('\n', ' '));
      btn.style.cssText = 'padding:10px;font-size:14px;font-weight:600;font-family:\'Amatic SC\',cursive;background:white;color:#3F7652;border:2px solid #3F7652;border-radius:10px;cursor:pointer;white-space:pre-line;';
      btn.textContent = label;
      btn.addEventListener('click', () => this.setTimeFromPreset(time));
      presetGrid.appendChild(btn);
    });

    // ---- Divider ----
    const divider = document.createElement('div');
    divider.style.cssText = 'text-align:center;margin:15px 0;color:#666;font-size:16px;font-weight:600;';
    divider.textContent = '- OR -';
    divider.setAttribute('aria-hidden', 'true');

    // ---- Exact time selects ----
    const exactLabel = document.createElement('label');
    exactLabel.style.cssText = 'display:block;margin-bottom:8px;color:#3F7652;font-weight:600;font-size:16px;';
    exactLabel.textContent = 'Exact Time (if known):';

    const exactRow = document.createElement('div');
    exactRow.style.cssText = 'display:flex;gap:10px;align-items:center;justify-content:center;margin-bottom:20px;';

    const selStyle = 'padding:12px 8px;font-size:20px;font-weight:700;text-align:center;border:2px solid #3F7652;border-radius:10px;font-family:\'Amatic SC\',cursive;background:white;';

    const hourSel = document.createElement('select');
    hourSel.id = 'custom-hour';
    hourSel.style.cssText = 'width:80px;' + selStyle;
    hourSel.setAttribute('aria-label', 'Hour');
    hourSel.innerHTML = '<option value="">HH</option>';

    const colon = document.createElement('span');
    colon.style.cssText = 'font-size:24px;font-weight:700;color:#3F7652;';
    colon.textContent = ':';
    colon.setAttribute('aria-hidden', 'true');

    const minSel = document.createElement('select');
    minSel.id = 'custom-minute';
    minSel.style.cssText = 'width:80px;' + selStyle;
    minSel.setAttribute('aria-label', 'Minute');
    minSel.innerHTML = '<option value="">MM</option>';

    const periodSel = document.createElement('select');
    periodSel.id = 'custom-period';
    periodSel.style.cssText = 'width:90px;' + selStyle;
    periodSel.setAttribute('aria-label', 'AM or PM');
    periodSel.innerHTML = '<option value="AM">AM</option><option value="PM">PM</option>';

    exactRow.append(hourSel, colon, minSel, periodSel);

    // ---- Inline error ----
    const errorMsg = document.createElement('div');
    errorMsg.id = 'time-picker-error';
    errorMsg.setAttribute('role', 'alert');
    errorMsg.setAttribute('aria-live', 'polite');
    errorMsg.style.cssText = 'color:#d32f2f;font-size:14px;margin-bottom:8px;min-height:20px;';
    this._errorEl = errorMsg;

    // ---- Footer buttons ----
    const footer = document.createElement('div');
    footer.style.cssText = 'display:flex;gap:10px;';

    const skipBtn = document.createElement('button');
    skipBtn.type = 'button';
    skipBtn.className = 'time-picker-skip';
    skipBtn.style.cssText = 'flex:1;padding:15px;font-size:18px;font-weight:700;font-family:\'Amatic SC\',cursive;background:#ddd;color:#333;border:none;border-radius:15px;cursor:pointer;';
    skipBtn.textContent = 'Skip (Unknown)';

    const confirmBtn = document.createElement('button');
    confirmBtn.type = 'button';
    confirmBtn.className = 'time-picker-confirm';
    confirmBtn.style.cssText = 'flex:1;padding:15px;font-size:18px;font-weight:700;font-family:\'Amatic SC\',cursive;background:#3F7652;color:white;border:none;border-radius:15px;cursor:pointer;';
    confirmBtn.textContent = 'Confirm';

    footer.append(skipBtn, confirmBtn);

    // ---- Assemble picker ----
    picker.append(header, infoBox, presetLabel, presetGrid, divider, exactLabel, exactRow, errorMsg, footer);
    wrapper.appendChild(picker);
    document.body.appendChild(wrapper);
    this.container = wrapper;

    // Store dropdown references
    this.dropdowns.hour   = hourSel;
    this.dropdowns.minute = minSel;
    this.dropdowns.period = periodSel;

    this.populateHours();
    this.populateMinutes();

    // Event listeners
    closeBtn.addEventListener('click',  () => this.hide());
    skipBtn.addEventListener('click',   () => { this.input.value = ''; this.hide(); });
    confirmBtn.addEventListener('click', () => this.confirm());
    wrapper.addEventListener('click',   e => { if (e.target === wrapper) this.hide(); });
  }

  populateHours() {
    for (let hour = 1; hour <= 12; hour++) {
      const opt = document.createElement('option');
      opt.value       = hour;
      opt.textContent = String(hour).padStart(2, '0');
      this.dropdowns.hour.appendChild(opt);
    }
  }

  populateMinutes() {
    for (let minute = 0; minute < 60; minute += 5) {
      const opt = document.createElement('option');
      opt.value       = minute;
      opt.textContent = String(minute).padStart(2, '0');
      this.dropdowns.minute.appendChild(opt);
    }
  }

  setTimeFromPreset(time24) {
    const parts  = time24.split(':').map(Number);
    const hour24 = parts[0];
    const minute = parts[1];

    let hour12 = hour24 % 12;
    if (hour12 === 0) hour12 = 12;
    const period = hour24 >= 12 ? 'PM' : 'AM';

    this.dropdowns.hour.value   = hour12;
    this.dropdowns.minute.value = minute;
    this.dropdowns.period.value = period;

    // Highlight selected preset
    this.container.querySelectorAll('.preset-btn').forEach(btn => {
      const selected = btn.dataset.time === time24;
      btn.style.background = selected ? '#3F7652' : 'white';
      btn.style.color      = selected ? 'white'   : '#3F7652';
    });
  }

  show() {
    if (this._errorEl) this._errorEl.textContent = '';

    const currentValue = this.input.value;
    if (currentValue) {
      const parts  = currentValue.split(':');
      const hour24 = parseInt(parts[0], 10);
      const minute = parseInt(parts[1], 10);

      if (Number.isInteger(hour24) && Number.isInteger(minute)) {
        let hour12 = hour24 % 12;
        if (hour12 === 0) hour12 = 12;
        const period = hour24 >= 12 ? 'PM' : 'AM';

        this.dropdowns.hour.value   = hour12;
        this.dropdowns.minute.value = minute;
        this.dropdowns.period.value = period;
      }
    }

    this.container.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  hide() {
    this.container.style.display = 'none';
    document.body.style.overflow = '';
  }

  confirm() {
    const hour12 = parseInt(this.dropdowns.hour.value,   10);
    const minute = parseInt(this.dropdowns.minute.value, 10);
    const period = this.dropdowns.period.value;

    if (!Number.isInteger(hour12) || isNaN(minute)) {
      if (this._errorEl) this._errorEl.textContent = 'Please select a time or use a quick preset';
      return;
    }
    if (this._errorEl) this._errorEl.textContent = '';

    let hour24 = hour12;
    if (period === 'PM' && hour12 !== 12) hour24 = hour12 + 12;
    else if (period === 'AM' && hour12 === 12) hour24 = 0;

    const timeString = `${String(hour24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

    this.input.value = timeString;
    this.input.dispatchEvent(new Event('change', { bubbles: true }));
    this.input.dispatchEvent(new Event('input',  { bubbles: true }));
    this.hide();
  }
}
