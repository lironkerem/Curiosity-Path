/**
 * AuthManager - Authentication & User Session Management
 * Handles Google OAuth, Email/Password auth, session management, lockout tracking.
 * @author Aanandoham (Liron Kerem)
 * @copyright 2026
 */

import { EMOJI_TO_KEY } from './avatar-icons.js';
import { supabase }     from './Supabase.js';

// ─── Configuration ────────────────────────────────────────────────────────────

const CONFIG = Object.freeze({
  MAX_FAILED_ATTEMPTS:  5,
  LOCKOUT_TIME:         900_000, // 15 min
  PASSWORD_MIN_LENGTH:  6,
  PASSWORD_DEBOUNCE:    300,
  TOAST_DURATION:       3_000,
  REDIRECT_DELAY:       2_000
});

const STORAGE_KEYS = Object.freeze({
  USER:                'pc_user',
  APPDATA:             'pc_appdata',
  ACTIVE_TAB:          'pc_active_tab',
  LOCKOUT:             'login_lockout',
  REMEMBER_ME:         'remember_me',
  DAILY_RESET:         'lastDailyReset',
  QUEST_RESET:         'last_quest_reset',
  DAILY_TAROT:         'daily_tarot_card',
  THEME:               'activeTheme',
  GAMIFICATION_STATE:  'gamificationState',
  KARMA_BOOSTS:        'karma_active_boosts',
  KARMA_HISTORY:       'karma_purchase_history',
  KARMA_CAPS_DAILY:    'karma_skip_caps_dailySkips',
  KARMA_CAPS_WEEKLY:   'karma_skip_caps_weeklySkips',
  KARMA_CAPS_MONTHLY:  'karma_skip_caps_monthlySkips',
  SAVED_FLIPS:         'savedFlips',
  BOOSTER_VIEWS:       'daily_booster_views',
  REMINDER_SETTINGS:   'reminderSettings',
  CUSTOM_AFFIRMATIONS: 'customAffirmations'
});

const ASSETS = { LOGO_URL: '/public/Tabs/Header.png' };

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Escape a string for safe HTML text content (prevents XSS in innerHTML) */
function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Safe localStorage wrapper */
const ls = {
  get:    key  => { try { return localStorage.getItem(key); }  catch { return null; } },
  set:    (k, v) => { try { localStorage.setItem(k, v); }     catch { /* noop */ } },
  remove: key  => { try { localStorage.removeItem(key); }      catch { /* noop */ } }
};

// ─── AuthManager ─────────────────────────────────────────────────────────────

export default class AuthManager {
  constructor(app) {
    this.app                    = app;
    this.failedAttempts         = 0;
    this.maxFailedAttempts      = CONFIG.MAX_FAILED_ATTEMPTS;
    this.lockoutTime            = CONFIG.LOCKOUT_TIME;
    this.passwordStrengthTimeout = null;
    this.isSubmitting           = false;
    this._preloadAssets();
  }

  _preloadAssets() {
    const logo = new Image();
    logo.src = ASSETS.LOGO_URL;
  }

  // ─── Session ───────────────────────────────────────────────────────────────

  async checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) { await this._setAuthenticated(session.user); return true; }
    this._clearLocalUser();
    return false;
  }

  _restoreLocalUser() {
    try {
      const raw = ls.get(STORAGE_KEYS.USER);
      if (!raw) return false;
      this.app.state.currentUser     = JSON.parse(raw);
      this.app.state.isAuthenticated = true;
      return true;
    } catch (error) {
      console.warn('[Auth] Failed to restore user:', error);
      ls.remove(STORAGE_KEYS.USER);
      return false;
    }
  }

  // ─── Render Auth Screen ────────────────────────────────────────────────────

  renderAuthScreen() {
    const isLocked      = this._isAccountLocked();
    const lockoutMessage = isLocked ? this._getLockoutMessage() : '';
    document.getElementById('auth-screen').innerHTML =
      this._generateLoginHTML(isLocked, lockoutMessage);
  }

  _generateLoginHTML(isLocked, lockoutMessage) {
    return `
      <div class="auth-screen-wrapper mobile-optimized">
        <div class="auth-card-enhanced">
          ${this._generateLogoHeader('The Curiosity Path', 'by Aanandoham', 'Join 10,000+ seekers on their journey')}
          ${isLocked ? `<div class="lockout-warning" role="alert">${esc(lockoutMessage)}</div>` : ''}
          ${this._generateGoogleButton('Continue with Google', 'handleGoogleLogin', isLocked)}
          <div class="divider"><span>or</span></div>
          ${this._generateLoginForm(isLocked)}
          <p class="text-center mt-4 text-sm" style="margin-top:10px">
            <a href="#" onclick="window.app.auth.showSignupForm(); return false;" class="auth-link">Create an account</a>
          </p>
          ${this._generateFooter()}
        </div>
      </div>
      ${this._generateStyles()}`;
  }

  showSignupForm() {
    document.getElementById('auth-screen').innerHTML = `
      <div class="auth-screen-wrapper mobile-optimized">
        <div class="auth-card-enhanced">
          ${this._generateLogoHeader('Create Account', 'Join The Curiosity Path', 'Join 10,000+ seekers on their journey')}
          ${this._generateGoogleButton('Sign up with Google', 'handleGoogleSignup', false)}
          <div class="divider"><span>or</span></div>
          ${this._generateSignupForm()}
          <p class="text-center mt-4 text-sm" style="margin-top:10px">
            <a href="#" onclick="window.app.auth.renderAuthScreen(); return false;" class="auth-link">Already have an account? Sign in</a>
          </p>
          ${this._generateFooter()}
        </div>
      </div>
      ${this._generateStyles()}`;
  }

  showForgotPassword() {
    document.getElementById('auth-screen').innerHTML = `
      <div class="auth-screen-wrapper mobile-optimized">
        <div class="auth-card-enhanced">
          ${this._generateLogoHeader('Reset Password', 'Enter your email to receive a reset link', '')}
          <form id="forgot-form" onsubmit="window.app.auth.handleForgotPassword(event)" class="space-y-4" style="margin-top:1rem">
            <div class="form-group" style="margin-bottom:10px">
              <label class="form-label" style="margin-bottom:8px;display:block" for="forgot-email">Email</label>
              <input id="forgot-email" type="email" class="form-input-enhanced" placeholder="your@email.com"
                     autocomplete="email" inputmode="email" required>
              <span class="error-message" style="display:none" aria-live="polite"></span>
            </div>
            ${this._generateSubmitButton('Send Reset Link')}
          </form>
          <p class="text-center mt-4 text-sm" style="margin-top:10px">
            <a href="#" onclick="window.app.auth.renderAuthScreen(); return false;" class="auth-link">Back to sign in</a>
          </p>
          ${this._generateSecurityBadge()}
        </div>
      </div>`;
  }

  // ─── HTML Generators ───────────────────────────────────────────────────────

  _generateLogoHeader(title, subtitle, description) {
    return `
      <div class="text-center mb-3 fade-in">
        <picture>
          <source srcset="/public/Tabs/Header.webp" type="image/webp">
          <img class="header-image" src="${ASSETS.LOGO_URL}" alt="The Curiosity Path"
               width="1280" height="400" loading="eager" fetchpriority="high" decoding="async"
               style="margin:0 auto 1rem">
        </picture>
        <hr style="border:none;border-top:1px solid var(--neuro-shadow-dark);margin:0.4rem 0">
        <h1 class="text-3xl font-bold mb-2">${esc(title)}</h1>
        <p class="auth-subtitle">${esc(subtitle)}</p>
        ${description ? `<p class="auth-desc">${esc(description)}</p>` : ''}
      </div>`;
  }

  _generateGoogleButton(text, handler, disabled) {
    const dis = disabled ? 'disabled' : '';
    return `
      <button type="button" onclick="window.app.auth.${esc(handler)}()"
              class="btn-google w-full mb-4 touch-target" style="margin-top:1rem" ${dis}
              aria-label="${esc(text)}">
        <svg width="20" height="20" viewBox="0 0 48 48" style="margin-right:12px" aria-hidden="true" focusable="false">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.03h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.66z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
        <span style="font-weight:500;color:var(--neuro-text)">${esc(text)}</span>
      </button>`;
  }

  _generateLoginForm(disabled) {
    const dis = disabled ? 'disabled' : '';
    return `
      <form id="login-form" onsubmit="window.app.auth.handleLogin(event)" class="space-y-4" style="margin-top:1rem">
        ${this._generateEmailField(disabled)}
        ${this._generatePasswordField(disabled, false)}
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;margin-bottom:10px">
          <label style="display:flex;align-items:center;font-size:0.875rem;color:var(--neuro-text-light);cursor:pointer">
            <input type="checkbox" id="remember-me" style="margin-right:6px" ${dis}> Remember me
          </label>
          <a href="#" onclick="window.app.auth.showForgotPassword(); return false;" class="auth-link" style="font-size:0.875rem">Forgot password?</a>
        </div>
        ${this._generateSubmitButton('Sign In', disabled)}
      </form>`;
  }

  _generateSignupForm() {
    return `
      <form id="signup-form" onsubmit="window.app.auth.handleSignup(event)" class="space-y-4" style="margin-top:1rem">
        <div class="form-group" style="margin-bottom:10px">
          <label class="form-label" style="margin-bottom:8px;display:block" for="signup-name">Name</label>
          <input id="signup-name" type="text" class="form-input-enhanced" placeholder="Your spiritual name"
                 autocomplete="name" maxlength="100" required>
          <span class="error-message" style="display:none" aria-live="polite"></span>
        </div>
        ${this._generateEmailField(false)}
        ${this._generatePasswordField(false, true)}
        ${this._generateSubmitButton('Sign Up')}
      </form>`;
  }

  _generateEmailField(disabled) {
    const dis = disabled ? 'disabled' : '';
    return `
      <div class="form-group" style="margin-bottom:10px">
        <label class="form-label" style="margin-bottom:8px;display:block" for="auth-email">Email</label>
        <input id="auth-email" type="email" class="form-input-enhanced" placeholder="your@email.com"
               autocomplete="email" inputmode="email" maxlength="254" required ${dis}>
        <span class="error-message" style="display:none" aria-live="polite"></span>
      </div>`;
  }

  _generatePasswordField(disabled, showStrength) {
    const dis         = disabled ? 'disabled' : '';
    const autocomplete = showStrength ? 'new-password' : 'current-password';
    const minlength    = showStrength ? `minlength="${CONFIG.PASSWORD_MIN_LENGTH}"` : '';
    const oninput      = showStrength
      ? 'oninput="window.app.auth.debouncedPasswordCheck(this)"'
      : '';
    return `
      <div class="form-group" style="margin-bottom:10px">
        <label class="form-label" style="margin-bottom:8px;display:block" for="auth-password">
          Password${this._generatePasswordHint()}
        </label>
        <div style="position:relative">
          <input id="auth-password" type="password" class="form-input-enhanced" placeholder="••••••••"
                 ${minlength} autocomplete="${autocomplete}" maxlength="128"
                 required ${oninput} onkeyup="window.app.auth.checkCapsLock(event)" ${dis}>
        </div>
        ${showStrength ? this._generatePasswordStrength() : ''}
        <span class="caps-warning" style="display:none;font-size:0.8rem;margin-top:4px" aria-live="polite">⚠️ Caps Lock is ON</span>
        <span class="error-message" style="display:none" aria-live="polite"></span>
      </div>`;
  }

  _generatePasswordHint() {
    return `
      <span class="password-hint" style="position:relative;display:inline-block;margin-left:4px">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             style="cursor:help" aria-hidden="true" focusable="false"
             onmouseenter="window.app.auth.showPasswordHint(this)"
             onmouseleave="window.app.auth.hidePasswordHint(this)">
          <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <div class="tooltip" style="display:none" role="tooltip">
          <strong>Password must have:</strong>
          <ul style="margin:8px 0 0 0;padding-left:20px;text-align:left">
            <li>At least ${CONFIG.PASSWORD_MIN_LENGTH} characters</li>
            <li>Mix of letters &amp; numbers (recommended)</li>
            <li>Special characters for extra security</li>
          </ul>
        </div>
      </span>`;
  }

  _generatePasswordStrength() {
    return `
      <div class="password-strength" style="display:flex;gap:4px;margin-top:8px" role="presentation" aria-label="Password strength indicator">
        ${Array.from({ length: 4 }, () =>
          '<span style="flex:1;height:4px;border-radius:2px;transition:background 0.3s"></span>'
        ).join('')}
      </div>`;
  }

  _generateSubmitButton(text, disabled = false) {
    const dis = disabled ? 'disabled' : '';
    return `
      <button type="submit" class="btn-primary-enhanced w-full touch-target" ${dis} style="margin-top:10px">
        <span class="btn-text">${esc(text)}</span>
        <span class="btn-spinner" style="display:none" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               style="animation:spin 1s linear infinite" aria-label="Loading">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
            <path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="0.75"/>
          </svg>
        </span>
      </button>`;
  }

  _generateSecurityBadge() {
    return `
      <div class="auth-footer text-center mt-6 text-sm" style="margin-top:14px">
        <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:12px">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span style="font-size:0.85rem">Secure &amp; encrypted • We never share your data</span>
        </div>
      </div>`;
  }

  _generateFooter() {
    return `
      <div class="auth-footer text-center mt-6 text-sm" style="margin-top:14px">
        <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:12px">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span style="font-size:0.85rem">Secure &amp; encrypted • We never share your data</span>
        </div>
        <p class="mb-2">Your account is securely stored in Supabase Cloud</p>
        <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap">
          <a href="#" onclick="window.open('Core/Legal/terms.html','_blank','width=800,height=700,scrollbars=yes,resizable=yes'); return false;" class="auth-link">Terms of Service</a>
          <span aria-hidden="true">•</span>
          <a href="#" onclick="window.open('Core/Legal/privacy.html','_blank','width=800,height=700,scrollbars=yes,resizable=yes'); return false;" class="auth-link">Privacy Policy</a>
        </div>
      </div>`;
  }

  _generateStyles() {
    return `<style>
      @keyframes spin    { to { transform: rotate(360deg) } }
      @keyframes fadeIn  { from { opacity:0; transform:translateY(-10px) } to { opacity:1; transform:translateY(0) } }
      @keyframes slideIn { from { transform:translateX(100%); opacity:0 } to { transform:translateX(0); opacity:1 } }
      @keyframes slideUp { from { transform:translateY(20px); opacity:0 } to { transform:translateY(0); opacity:1 } }
      .auth-screen-wrapper { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:1rem; background:var(--neuro-bg); }
      .auth-card-enhanced { background:var(--neuro-bg); border-radius:var(--radius-2xl); box-shadow:var(--shadow-raised-lg); padding:28px; max-width:440px; width:100%; }
      @media (max-width:640px) { .auth-card-enhanced { padding:20px 18px; border-radius:var(--radius-xl); } .tooltip { white-space:normal; max-width:250px; } }
      .auth-card-enhanced h1 { color:var(--neuro-text); }
      .auth-subtitle  { color:var(--neuro-text-light); font-weight:600; font-size:1.1rem; }
      .auth-desc      { color:var(--neuro-text-lighter); font-size:0.9rem; margin-top:8px; }
      .auth-link { color:var(--neuro-accent); text-decoration:none; font-weight:500; transition:color var(--transition-fast); }
      .auth-link:hover { color:var(--neuro-forest-dark); }
      .auth-link:focus-visible { outline:2px solid var(--neuro-accent); outline-offset:2px; border-radius:2px; }
      .btn-google { display:flex; align-items:center; justify-content:center; padding:14px 24px; background:var(--neuro-bg); border:1px solid var(--neuro-shadow-dark); border-radius:var(--radius-md); font-weight:500; font-size:14px; cursor:pointer; transition:all .15s cubic-bezier(.4,0,.2,1); color:var(--neuro-text); box-shadow:var(--shadow-raised); width:100%; }
      .btn-google:hover:not(:disabled)  { box-shadow:var(--shadow-raised-hover); }
      .btn-google:active:not(:disabled) { box-shadow:var(--shadow-inset); }
      .btn-google:focus-visible { outline:2px solid var(--neuro-accent); outline-offset:2px; }
      .btn-google:disabled { opacity:.5; cursor:not-allowed; }
      .btn-primary-enhanced { display:flex; align-items:center; justify-content:center; padding:12px 24px; background:linear-gradient(135deg, var(--neuro-accent), var(--neuro-accent-light)); border:none; border-radius:var(--radius-lg); color:#fff; font-weight:600; font-size:.95rem; cursor:pointer; transition:all .2s; width:100%; box-shadow:var(--shadow-raised); }
      .btn-primary-enhanced:hover:not(:disabled)  { transform:translateY(-2px); box-shadow:var(--shadow-raised-hover); }
      .btn-primary-enhanced:active:not(:disabled) { transform:translateY(0); box-shadow:var(--shadow-inset); }
      .btn-primary-enhanced:focus-visible { outline:2px solid #fff; outline-offset:2px; }
      .btn-primary-enhanced:disabled { opacity:.6; cursor:not-allowed; transform:none; }
      .form-label { color:var(--neuro-text); font-weight:500; }
      .form-input-enhanced { width:100%; padding:12px 16px; background:var(--neuro-bg); border:none; border-radius:var(--radius-md); font-size:16px; transition:all .2s; outline:none; color:var(--neuro-text); box-shadow:var(--shadow-inset); font-family:inherit; }
      .form-input-enhanced:focus { box-shadow:var(--shadow-inset), 0 0 0 2px var(--neuro-accent); }
      .form-input-enhanced.error { box-shadow:var(--shadow-inset), 0 0 0 2px var(--neuro-error); }
      .form-input-enhanced:disabled { opacity:.6; cursor:not-allowed; }
      .error-message { color:var(--neuro-error); font-size:.8rem; margin-top:4px; display:block; }
      .caps-warning  { display:block; color:var(--neuro-warning); font-size:.8rem; margin-top:4px; animation:fadeIn .3s ease-out; }
      .divider { display:flex; align-items:center; text-align:center; margin:24px 0; color:var(--neuro-text-dim); font-size:.875rem; }
      .divider::before, .divider::after { content:''; flex:1; border-bottom:1px solid var(--neuro-shadow-dark); }
      .divider span { padding:0 12px; }
      .password-strength span { background:var(--neuro-shadow-dark); }
      .password-strength span.active-weak   { background:var(--neuro-error); }
      .password-strength span.active-medium { background:var(--neuro-warning); }
      .password-strength span.active-strong { background:var(--neuro-success); }
      .tooltip { position:absolute; bottom:120%; left:50%; transform:translateX(-50%); background:var(--neuro-text); color:var(--neuro-bg); padding:12px; border-radius:var(--radius-md); font-size:.8rem; white-space:nowrap; z-index:1000; box-shadow:var(--shadow-raised-lg); }
      .tooltip::after { content:''; position:absolute; top:100%; left:50%; transform:translateX(-50%); border:6px solid transparent; border-top-color:var(--neuro-text); }
      .lockout-warning { background:var(--neuro-bg); border:2px solid var(--neuro-error); color:var(--neuro-error); box-shadow:var(--shadow-inset); padding:16px; border-radius:var(--radius-md); margin-bottom:20px; text-align:center; font-weight:500; animation:fadeIn .3s ease-out; }
      .auth-footer { color:var(--neuro-text-dim); }
      .auth-footer a { color:var(--neuro-text-light); text-decoration:none; transition:color var(--transition-fast); }
      .auth-footer a:hover { color:var(--neuro-accent); }
      .auth-modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.5); display:flex; align-items:center; justify-content:center; z-index:10000; padding:20px; animation:fadeIn .2s ease-out; }
      .auth-modal-card { background:var(--neuro-bg); border-radius:var(--radius-xl); max-width:600px; width:100%; max-height:80vh; overflow-y:auto; box-shadow:var(--shadow-raised-lg); animation:slideUp .3s ease-out; }
      .auth-modal-header { padding:24px; border-bottom:1px solid var(--neuro-shadow-dark); display:flex; justify-content:space-between; align-items:center; position:sticky; top:0; background:var(--neuro-bg); z-index:1; }
      .auth-modal-header h2 { font-size:1.5rem; font-weight:700; color:var(--neuro-text); }
      .auth-modal-close { background:var(--neuro-bg); border:none; cursor:pointer; padding:8px; border-radius:var(--radius-sm); color:var(--neuro-text-light); box-shadow:var(--shadow-raised); transition:all var(--transition-fast); }
      .auth-modal-close:hover { box-shadow:var(--shadow-inset); color:var(--neuro-error); }
      .auth-modal-body { padding:24px; color:var(--neuro-text-light); line-height:1.6; }
      .auth-modal-body h3 { color:var(--neuro-text); }
      .fade-in { animation:fadeIn .5s ease-out; }
      .touch-target { min-height:44px; min-width:44px; }
      .mobile-optimized * { -webkit-tap-highlight-color:transparent; }
    </style>`;
  }

  // ─── UI interactions ────────────────────────────────────────────────────────

  togglePassword(btn) {
    const input = btn.previousElementSibling;
    const svg   = btn.querySelector('svg');
    if (!input || !svg) return;
    if (input.type === 'password') {
      input.type   = 'text';
      svg.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
    } else {
      input.type   = 'password';
      svg.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
    }
  }

  checkCapsLock(event) {
    const capsWarning = event.target.closest('.form-group')?.querySelector('.caps-warning');
    if (!capsWarning) return;
    const on = event.getModifierState?.('CapsLock') ?? false;
    capsWarning.style.display = on ? 'block' : 'none';
  }

  showPasswordHint(svg) {
    svg.parentElement.querySelector('.tooltip')?.style.setProperty('display', 'block');
  }
  hidePasswordHint(svg) {
    svg.parentElement.querySelector('.tooltip')?.style.setProperty('display', 'none');
  }

  debouncedPasswordCheck(input) {
    clearTimeout(this.passwordStrengthTimeout);
    this.passwordStrengthTimeout = setTimeout(
      () => this.checkPasswordStrength(input), CONFIG.PASSWORD_DEBOUNCE
    );
  }

  checkPasswordStrength(input) {
    const password   = input.value;
    const strengthBars = input.closest('.form-group')?.querySelectorAll('.password-strength span');
    if (!strengthBars?.length) return;
    let strength = 0;
    if (password.length >= 6)  strength++;
    if (password.length >= 10) strength++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) strength++;
    strengthBars.forEach((bar, i) => {
      bar.className = '';
      if (i < strength) {
        bar.classList.add(strength <= 1 ? 'active-weak' : strength <= 2 ? 'active-medium' : 'active-strong');
      }
    });
  }

  showError(input, message) {
    input.classList.add('error');
    const span = input.closest('.form-group')?.querySelector('.error-message');
    if (span) { span.textContent = message; span.style.display = 'block'; }
  }

  clearError(input) {
    input.classList.remove('error');
    const span = input.closest('.form-group')?.querySelector('.error-message');
    if (span) span.style.display = 'none';
  }

  showSuccess(message) {
    const toast = document.createElement('div');
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.style.cssText = 'position:fixed;top:20px;right:20px;background:var(--neuro-success);color:#fff;padding:16px 24px;border-radius:var(--radius-lg);box-shadow:var(--shadow-raised-lg);z-index:10000;animation:slideIn .3s ease-out';
    toast.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span>${esc(message)}</span>
      </div>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), CONFIG.TOAST_DURATION);
  }

  // ─── Lockout ───────────────────────────────────────────────────────────────

  _isAccountLocked() {
    const data = ls.get(STORAGE_KEYS.LOCKOUT);
    if (!data) return false;
    try {
      const { lockedUntil } = JSON.parse(data);
      return Date.now() < lockedUntil;
    } catch {
      ls.remove(STORAGE_KEYS.LOCKOUT);
      return false;
    }
  }

  _getLockoutMessage() {
    const data = ls.get(STORAGE_KEYS.LOCKOUT);
    if (!data) return '';
    try {
      const { lockedUntil } = JSON.parse(data);
      const mins = Math.ceil((lockedUntil - Date.now()) / 60_000);
      return `⚠️ Too many failed attempts. Please try again in ${mins} minute${mins !== 1 ? 's' : ''}.`;
    } catch { return ''; }
  }

  _recordFailedAttempt() {
    this.failedAttempts++;
    if (this.failedAttempts >= this.maxFailedAttempts) {
      ls.set(STORAGE_KEYS.LOCKOUT, JSON.stringify({ lockedUntil: Date.now() + this.lockoutTime }));
      this.renderAuthScreen();
    }
  }

  _resetFailedAttempts() {
    this.failedAttempts = 0;
    ls.remove(STORAGE_KEYS.LOCKOUT);
  }

  // ─── Auth Handlers ─────────────────────────────────────────────────────────

  async handleGoogleLogin() {
    if (this._isAccountLocked()) return;
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin, queryParams: { access_type: 'offline', prompt: 'consent' } }
      });
      if (error) throw error;
    } catch (error) {
      console.error('[Auth] Google login error:', error);
      const btn = document.querySelector('.btn-google');
      if (btn) this.showError(btn, 'Failed to sign in with Google');
    }
  }

  async handleGoogleSignup() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin, queryParams: { access_type: 'offline', prompt: 'consent' } }
      });
      if (error) throw error;
    } catch (error) {
      console.error('[Auth] Google signup error:', error);
      this.showSuccess('Failed to sign up with Google: ' + error.message);
    }
  }

  async handleLogin(e) {
    e.preventDefault();
    if (this.isSubmitting || this._isAccountLocked()) return;
    this.isSubmitting = true;
    const form       = e.target;
    const btn        = form.querySelector('button[type="submit"]');
    const emailInput = form.querySelector('input[type="email"]');
    const passInput  = form.querySelector('input[type="password"]');
    this._setButtonLoading(btn, true);
    this.clearError(emailInput);
    this.clearError(passInput);
    const email    = emailInput.value.trim().slice(0, 254);
    const password = passInput.value.slice(0, 128);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      this._resetFailedAttempts();
      if (document.getElementById('remember-me')?.checked) ls.set(STORAGE_KEYS.REMEMBER_ME, 'true');
      await this._setAuthenticated(data.user);
    } catch (error) {
      console.error('[Auth] Login error:', error);
      this._recordFailedAttempt();
      const attemptsLeft = this.maxFailedAttempts - this.failedAttempts;
      const msg = error.message.includes('Invalid login')
        ? (attemptsLeft > 0
            ? `Invalid email or password. ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining.`
            : 'Invalid email or password')
        : error.message;
      this.showError(emailInput, msg);
      if (error.message.includes('Invalid login')) this.showError(passInput, msg);
    } finally {
      this._setButtonLoading(btn, false);
      this.isSubmitting = false;
    }
  }

  async handleSignup(e) {
    e.preventDefault();
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    const form       = e.target;
    const btn        = form.querySelector('button[type="submit"]');
    const nameInput  = form.querySelector('input[type="text"]');
    const emailInput = form.querySelector('input[type="email"]');
    const passInput  = form.querySelector('input[type="password"]');
    this._setButtonLoading(btn, true);
    [nameInput, emailInput, passInput].forEach(i => this.clearError(i));
    const name     = nameInput.value.trim().slice(0, 100);
    const email    = emailInput.value.trim().slice(0, 254);
    const password = passInput.value.slice(0, 128);
    try {
      if (password.length < CONFIG.PASSWORD_MIN_LENGTH) {
        throw new Error(`Password must be at least ${CONFIG.PASSWORD_MIN_LENGTH} characters`);
      }
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
      if (error) throw error;
      if (data.user) {
        if (data.user.identities?.length === 0) {
          this.showSuccess('Check your email to verify your account!');
          setTimeout(() => this.renderAuthScreen(), CONFIG.REDIRECT_DELAY);
        } else {
          await this._initUserProgress(data.user.id);
          await this._setAuthenticated(data.user);
        }
      }
    } catch (error) {
      console.error('[Auth] Signup error:', error);
      if (error.message.includes('already registered')) this.showError(emailInput, 'Email already registered');
      else if (error.message.includes('Password'))       this.showError(passInput, error.message);
      else                                               this.showError(emailInput, error.message);
    } finally {
      this._setButtonLoading(btn, false);
      this.isSubmitting = false;
    }
  }

  async handleForgotPassword(e) {
    e.preventDefault();
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    const form       = e.target;
    const btn        = form.querySelector('button[type="submit"]');
    const emailInput = form.querySelector('input[type="email"]');
    this._setButtonLoading(btn, true);
    this.clearError(emailInput);
    const email = emailInput.value.trim().slice(0, 254);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) throw error;
      this.showSuccess('Password reset link sent! Check your email.');
      setTimeout(() => this.renderAuthScreen(), CONFIG.REDIRECT_DELAY);
    } catch (error) {
      console.error('[Auth] Password reset error:', error);
      this.showError(emailInput, error.message);
    } finally {
      this._setButtonLoading(btn, false);
      this.isSubmitting = false;
    }
  }

  _setButtonLoading(btn, loading) {
    if (!btn) return;
    btn.disabled = loading;
    const text    = btn.querySelector('.btn-text');
    const spinner = btn.querySelector('.btn-spinner');
    if (text)    text.style.display    = loading ? 'none'  : 'block';
    if (spinner) spinner.style.display = loading ? 'block' : 'none';
  }

  // ─── User Setup ────────────────────────────────────────────────────────────

  async _initUserProgress(uid) {
    try {
      const payload = this.app.state.emptyModel();
      const { error } = await supabase
        .from('user_progress')
        .insert({ user_id: uid, payload, updated_at: new Date().toISOString() });
      if (error) throw error;
    } catch (error) {
      console.error('[Auth] Failed to init user_progress:', error);
    }
  }

  async _ensureUserProgress(uid) {
    try {
      const { data } = await supabase
        .from('user_progress').select('user_id').eq('user_id', uid).single();
      if (!data) await this._initUserProgress(uid);
    } catch (error) {
      console.error('[Auth] Failed to ensure user_progress:', error);
    }
  }

  async _setAuthenticated(u) {
    const isGoogle = u.app_metadata?.provider === 'google';
    let isAdmin = false, isVip = false;
    try {
      const { data: profile } = await supabase
        .from('profiles').select('is_admin, is_vip').eq('id', u.id).single();
      isAdmin = profile?.is_admin || false;
      isVip   = profile?.is_vip   || false;
    } catch (error) {
      console.warn('[Auth] Profile fetch failed:', error);
    }

    const user = {
      id:        u.id,
      name:      u.user_metadata?.full_name || u.user_metadata?.name || u.email.split('@')[0],
      email:     u.email,
      phone:     u.user_metadata?.phone    || '',
      birthday:  u.user_metadata?.birthday || '',
      emoji:     u.user_metadata?.emoji    || '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
      avatarUrl: u.user_metadata?.avatar_url || u.user_metadata?.avatarUrl || null,
      tier:      'Premium',
      joinDate:  u.created_at,
      provider:  isGoogle ? 'google' : 'email',
      isAdmin,
      isVip
    };

    this.app.state.currentUser     = user;
    this.app.state.isAuthenticated = true;
    ls.set(STORAGE_KEYS.USER, JSON.stringify(user));

    const authScreen = document.getElementById('auth-screen');
    if (authScreen) { authScreen.style.display = 'none'; authScreen.innerHTML = ''; }

    await this._ensureUserProgress(user.id);
    document.documentElement.classList.add('theme-loaded');
    await this.app.state.loadData();
    await this.app.initializeApp();
  }

  _clearLocalUser() {
    ls.remove(STORAGE_KEYS.USER);
    this.app.state.currentUser     = null;
    this.app.state.isAuthenticated = false;
  }

  async signOut() {
    try {
      this.app?.destroy?.();
      await supabase.auth.signOut();
    } catch (error) {
      console.error('[Auth] Sign out error:', error);
    }
    this._clearLocalUser();
    Object.values(STORAGE_KEYS).forEach(key => ls.remove(key));
    location.reload();
  }
}

// ─── Profile helpers (attached after app bootstraps) ─────────────────────────

function attachProfileHelpers() {
  if (!window.app) { requestAnimationFrame(attachProfileHelpers); return; }

  window.app.saveQuickProfile = async function() {
    const uid = this.state?.currentUser?.id;
    if (!uid) return this.showToast('Not logged in', 'error');

    // Sanitise all user-controlled fields
    const sanitize = (v, max = 200) => (v ?? '').trim().slice(0, max);
    const payload  = {
      name:      sanitize(document.getElementById('profile-name')?.value,     100) || null,
      email:     sanitize(document.getElementById('profile-email')?.value,    254) || null,
      phone:     sanitize(document.getElementById('profile-phone')?.value,     20) || null,
      birthday:  sanitize(document.getElementById('profile-birthday')?.value,  10) || null,
      emoji:     document.getElementById('profile-emoji')?.value || '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
      avatarUrl: document.getElementById('profile-avatar-img')?.src || ''
    };

    let savedOnServer = false;
    try {
      const { error } = await supabase.from('profiles').upsert({ id: uid, ...payload }, { onConflict: 'id' });
      if (!error) savedOnServer = true;
    } catch (error) {
      console.warn('[Auth] Profile server save failed:', error);
    }

    try { localStorage.setItem(`profile_${uid}`, JSON.stringify(payload)); } catch { /* noop */ }
    Object.assign(this.state.currentUser, payload);
    this.userTab?.syncAvatar();
    this.showToast(
      savedOnServer ? '✅ Profile saved & synced' : '⚠️ Saved locally (offline)',
      savedOnServer ? 'success' : 'warning'
    );
  };

  window.app.hydrateUserProfile = async function() {
    const uid = this.state?.currentUser?.id;
    if (!uid) return;
    let data = null;
    try {
      const { data: row, error } = await supabase.from('profiles').select('*').eq('id', uid).single();
      if (!error && row) data = row;
    } catch (error) {
      console.warn('[Auth] Profile fetch error:', error);
    }
    if (!data) {
      try { const cached = localStorage.getItem(`profile_${uid}`); if (cached) data = JSON.parse(cached); } catch { /* noop */ }
    }
    if (data) {
      const target = this.state.currentUser;
      ['name', 'email', 'phone', 'birthday', 'emoji', 'avatarUrl'].forEach(key => {
        if (data[key] != null) target[key] = data[key];
      });
      this.userTab?.syncAvatar();
    }
  };
}
attachProfileHelpers();
