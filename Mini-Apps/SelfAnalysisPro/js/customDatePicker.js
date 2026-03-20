// Mini-Apps/SelfAnalysisPro/js/customDatePicker.js
// Mobile-friendly date picker with dropdowns
// NO AUTO-INITIALIZATION — loader.js handles it

export class CustomDatePicker {
  constructor(inputId) {
    this.input    = document.getElementById(inputId);
    this.container = null;
    this.dropdowns = { year: null, month: null, day: null };
    this.init();
  }

  init() {
    if (!this.input) return;

    this.createPickerUI();

    this.input.type        = 'text';
    this.input.readOnly    = true;
    this.input.placeholder = 'Select date...';

    this.input.addEventListener('click', e => { e.preventDefault(); this.show(); });
    this.input.addEventListener('focus', e => { e.preventDefault(); this.input.blur(); this.show(); });
  }

  createPickerUI() {
    const wrapper = document.createElement('div');
    wrapper.className       = 'custom-date-picker-overlay';
    wrapper.setAttribute('role', 'dialog');
    wrapper.setAttribute('aria-modal', 'true');
    wrapper.setAttribute('aria-label', 'Select Date of Birth');
    wrapper.style.cssText = 'display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:10000;align-items:center;justify-content:center;';

    const picker = document.createElement('div');
    picker.className  = 'custom-date-picker';
    picker.style.cssText = 'background:white;border-radius:20px;padding:25px;max-width:90%;width:400px;box-shadow:0 10px 40px rgba(0,0,0,0.3);position:relative;';

    // Build header
    const header = document.createElement('div');
    header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;';
    const title = document.createElement('h3');
    title.style.cssText = 'margin:0;color:#3F7652;font-size:24px;';
    title.id = 'date-picker-title';
    title.textContent = 'Select Date of Birth';
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'close-picker';
    closeBtn.setAttribute('aria-label', 'Close date picker');
    closeBtn.style.cssText = 'background:none;border:none;font-size:30px;color:#666;cursor:pointer;line-height:1;padding:0;width:30px;height:30px;';
    closeBtn.textContent = '\u00D7';
    header.append(title, closeBtn);

    wrapper.setAttribute('aria-labelledby', 'date-picker-title');

    // Dropdowns row
    const dropdownRow = document.createElement('div');
    dropdownRow.style.cssText = 'display:flex;gap:10px;margin-bottom:20px;';

    const selectStyle = 'width:100%;padding:12px;font-size:16px;border:2px solid #3F7652;border-radius:10px;font-family:\'Amatic SC\',cursive;background:white;';

    const monthWrap = document.createElement('div');
    monthWrap.style.flex = '2';
    const monthLabel = document.createElement('label');
    monthLabel.htmlFor = 'custom-month';
    monthLabel.style.cssText = 'display:block;margin-bottom:5px;color:#3F7652;font-weight:600;font-size:16px;';
    monthLabel.textContent = 'Month';
    const monthSel = document.createElement('select');
    monthSel.id = 'custom-month';
    monthSel.style.cssText = selectStyle;
    monthSel.setAttribute('aria-label', 'Birth month');
    monthSel.innerHTML = '<option value="">Month</option>';
    monthWrap.append(monthLabel, monthSel);

    const dayWrap = document.createElement('div');
    dayWrap.style.flex = '1';
    const dayLabel = document.createElement('label');
    dayLabel.htmlFor = 'custom-day';
    dayLabel.style.cssText = 'display:block;margin-bottom:5px;color:#3F7652;font-weight:600;font-size:16px;';
    dayLabel.textContent = 'Day';
    const daySel = document.createElement('select');
    daySel.id = 'custom-day';
    daySel.style.cssText = selectStyle;
    daySel.setAttribute('aria-label', 'Birth day');
    daySel.innerHTML = '<option value="">Day</option>';
    dayWrap.append(dayLabel, daySel);

    const yearWrap = document.createElement('div');
    yearWrap.style.flex = '1.5';
    const yearLabel = document.createElement('label');
    yearLabel.htmlFor = 'custom-year';
    yearLabel.style.cssText = 'display:block;margin-bottom:5px;color:#3F7652;font-weight:600;font-size:16px;';
    yearLabel.textContent = 'Year';
    const yearSel = document.createElement('select');
    yearSel.id = 'custom-year';
    yearSel.style.cssText = selectStyle;
    yearSel.setAttribute('aria-label', 'Birth year');
    yearSel.innerHTML = '<option value="">Year</option>';
    yearWrap.append(yearLabel, yearSel);

    dropdownRow.append(monthWrap, dayWrap, yearWrap);

    // Error message
    const errorMsg = document.createElement('div');
    errorMsg.id = 'date-picker-error';
    errorMsg.role = 'alert';
    errorMsg.setAttribute('aria-live', 'polite');
    errorMsg.style.cssText = 'color:#d32f2f;font-size:14px;margin-bottom:8px;min-height:20px;';

    // Footer buttons
    const footer = document.createElement('div');
    footer.style.cssText = 'display:flex;gap:10px;';
    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'picker-cancel';
    cancelBtn.style.cssText = 'flex:1;padding:15px;font-size:18px;font-weight:700;font-family:\'Amatic SC\',cursive;background:#ddd;color:#333;border:none;border-radius:15px;cursor:pointer;';
    cancelBtn.textContent = 'Cancel';
    const confirmBtn = document.createElement('button');
    confirmBtn.type = 'button';
    confirmBtn.className = 'picker-confirm';
    confirmBtn.style.cssText = 'flex:1;padding:15px;font-size:18px;font-weight:700;font-family:\'Amatic SC\',cursive;background:#3F7652;color:white;border:none;border-radius:15px;cursor:pointer;';
    confirmBtn.textContent = 'Confirm';
    footer.append(cancelBtn, confirmBtn);

    picker.append(header, dropdownRow, errorMsg, footer);
    wrapper.appendChild(picker);
    document.body.appendChild(wrapper);
    this.container = wrapper;
    this._errorEl  = errorMsg;

    // Store dropdown references
    this.dropdowns.year  = yearSel;
    this.dropdowns.month = monthSel;
    this.dropdowns.day   = daySel;

    this.populateMonths();
    this.populateYears();
    this.populateDays();

    this.dropdowns.month.addEventListener('change', () => this.updateDays());
    this.dropdowns.year.addEventListener('change',  () => this.updateDays());

    closeBtn.addEventListener('click',  () => this.hide());
    cancelBtn.addEventListener('click', () => this.hide());
    confirmBtn.addEventListener('click', () => this.confirm());

    wrapper.addEventListener('click', e => { if (e.target === wrapper) this.hide(); });
  }

  populateMonths() {
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    months.forEach((month, index) => {
      const opt = document.createElement('option');
      opt.value       = index + 1;
      opt.textContent = month;
      this.dropdowns.month.appendChild(opt);
    });
  }

  populateYears() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1920; year--) {
      const opt = document.createElement('option');
      opt.value       = year;
      opt.textContent = year;
      this.dropdowns.year.appendChild(opt);
    }
  }

  populateDays() {
    const select = this.dropdowns.day;
    select.innerHTML = '<option value="">Day</option>';
    for (let day = 1; day <= 31; day++) {
      const opt = document.createElement('option');
      opt.value       = day;
      opt.textContent = day;
      select.appendChild(opt);
    }
  }

  updateDays() {
    const year  = parseInt(this.dropdowns.year.value,  10) || 2000;
    const month = parseInt(this.dropdowns.month.value, 10);
    if (!month) return;

    const daysInMonth = new Date(year, month, 0).getDate();
    const currentDay  = parseInt(this.dropdowns.day.value, 10);
    const select      = this.dropdowns.day;
    select.innerHTML  = '<option value="">Day</option>';

    for (let day = 1; day <= daysInMonth; day++) {
      const opt = document.createElement('option');
      opt.value       = day;
      opt.textContent = day;
      if (day === currentDay && day <= daysInMonth) opt.selected = true;
      select.appendChild(opt);
    }
  }

  show() {
    const currentValue = this.input.value;
    if (currentValue) {
      const [yearStr, monthStr, dayStr] = currentValue.split('-');
      const y = parseInt(yearStr,  10);
      const m = parseInt(monthStr, 10);
      const d = parseInt(dayStr,   10);
      if (y) this.dropdowns.year.value  = y;
      if (m) this.dropdowns.month.value = m;
      if (d) this.dropdowns.day.value   = d;
      this.updateDays();
    }
    if (this._errorEl) this._errorEl.textContent = '';
    this.container.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  hide() {
    this.container.style.display = 'none';
    document.body.style.overflow = '';
  }

  confirm() {
    const year  = this.dropdowns.year.value;
    const month = this.dropdowns.month.value;
    const day   = this.dropdowns.day.value;

    if (!year || !month || !day) {
      if (this._errorEl) this._errorEl.textContent = 'Please select all fields';
      return;
    }
    if (this._errorEl) this._errorEl.textContent = '';

    const dateString = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;

    this.input.value = dateString;
    this.input.dispatchEvent(new Event('change', { bubbles: true }));
    this.input.dispatchEvent(new Event('input',  { bubbles: true }));
    this.hide();
  }
}
