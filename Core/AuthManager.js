// AuthManager.js – Google + email login, optimised, professional UI/UX
/* global window, document, location, localStorage, alert */

import { supabase } from './Supabase.js';

export default class AuthManager {
  constructor(app) { 
    this.app = app;
    this.failedAttempts = 0;
    this.maxFailedAttempts = 5;
    this.lockoutTime = 15 * 60 * 1000; // 15 minutes
    this.passwordStrengthTimeout = null;
    this.isSubmitting = false;
    this._preloadAssets();
  }

  /* ---------- PRELOAD ASSETS ---------- */
  _preloadAssets() {
    const logo = new Image();
    logo.src = 'https://raw.githubusercontent.com/lironkerem/self-analysis-pro/main/assets/Watermarks/Logo.svg';
  }

  /* ---------- CHECK AUTH ---------- */
  async checkAuth() {
    const raw = localStorage.getItem('pc_user');
    if (raw) try {
      this.app.state.currentUser = JSON.parse(raw);
      this.app.state.isAuthenticated = true;
    } catch { localStorage.removeItem('pc_user'); }

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) { await this._setAuthenticated(session.user); return true; }

    this._clearLocalUser();
    return false;
  }

  /* ---------- RENDER ---------- */
  renderAuthScreen() {
    const isLocked = this._isAccountLocked();
    const lockoutMessage = isLocked ? this._getLockoutMessage() : '';

    const html = `
<div class="min-h-screen flex items-center justify-center p-4 mobile-optimized" style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%)">
  <div class="auth-card-enhanced">
    <div class="text-center mb-8 fade-in">
      <div class="logo-icon" style="width:144px;height:144px;display:flex;align-items:center;justify-content:center;margin:0 auto">
        <img src=https://raw.githubusercontent.com/lironkerem/self-analysis-pro/main/assets/Watermarks/Logo.svg alt=Aanandoham style="width:120px;height:120px;object-fit:contain" loading="eager">
      </div>
      <h1 class="text-3xl font-bold mb-2">The Curiosity Path</h1>
      <p style="color:#6c757d;font-weight:bold;font-size:1.1rem">by Aanandoham</p>
      <p style="color:#9ca3af;font-size:0.9rem;margin-top:8px">Join 10,000+ seekers on their journey</p>
    </div>

    ${isLocked ? `<div class="lockout-warning">${lockoutMessage}</div>` : ''}

    <!-- GOOGLE -->
    <button onclick="window.app.auth.handleGoogleLogin()" class="btn-google w-full mb-4 touch-target" style="margin-top:2.5rem" ${isLocked ? 'disabled' : ''}>
      <svg width="20" height="20" viewBox="0 0 48 48" style="margin-right:12px"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.03h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.66z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></svg>
      <span style="font-weight:500;color:#3c4043">Continue with Google</span>
    </button>

    <div class=divider><span>or</span></div>

    <form id=login-form onsubmit="window.app.auth.handleLogin(event)" class="space-y-4" style="margin-top:2.5rem">
      <div class=form-group style="margin-bottom:20px">
        <label class=form-label style="margin-bottom:8px;display:block">Email</label>
        <input type=email class="form-input-enhanced" placeholder="your@email.com" autocomplete="email" inputmode="email" required ${isLocked ? 'disabled' : ''}>
        <span class="error-message" style="display:none"></span>
      </div>
      <div class=form-group style="margin-bottom:20px">
        <label class=form-label style="margin-bottom:8px;display:block">
          Password
          <span class="password-hint" style="position:relative;display:inline-block;margin-left:4px">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="cursor:help" onmouseenter="window.app.auth.showPasswordHint(this)" onmouseleave="window.app.auth.hidePasswordHint(this)">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <div class="tooltip" style="display:none">
              <strong>Password must have:</strong>
              <ul style="margin:8px 0 0 0;padding-left:20px;text-align:left">
                <li>At least 6 characters</li>
                <li>Mix of letters & numbers (recommended)</li>
                <li>Special characters for extra security</li>
              </ul>
            </div>
          </span>
        </label>
        <div style="position:relative">
          <input type=password class="form-input-enhanced" placeholder="••••••••" autocomplete="current-password" required onkeyup="window.app.auth.checkCapsLock(event)" ${isLocked ? 'disabled' : ''}>
          <button type=button class="password-toggle-icon" onclick="window.app.auth.togglePassword(this)" ${isLocked ? 'disabled' : ''}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
        </div>
        <span class="caps-warning" style="display:none;color:#f59e0b;font-size:0.8rem;margin-top:4px">⚠️ Caps Lock is ON</span>
        <span class="error-message" style="display:none"></span>
      </div>
      
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;margin-bottom:24px">
        <label style="display:flex;align-items:center;font-size:0.875rem;color:#6c757d;cursor:pointer">
          <input type=checkbox id="remember-me" style="margin-right:6px" ${isLocked ? 'disabled' : ''}>
          Remember me
        </label>
        <a href="#" onclick="window.app.auth.showForgotPassword(); return false;" style="color:#6366f1;text-decoration:none;font-size:0.875rem;font-weight:500">Forgot password?</a>
      </div>

      <button type=submit class="btn-primary-enhanced w-full touch-target" ${isLocked ? 'disabled' : ''} style="margin-top:24px">
        <span class="btn-text">Sign In</span>
        <span class="btn-spinner" style="display:none">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="0.75"></path>
          </svg>
        </span>
      </button>
    </form>

    <p class="text-center mt-4 text-sm" style="margin-top:24px">
      <a href="#" onclick="window.app.auth.showSignupForm(); return false;" style="color:#6366f1;text-decoration:none;font-weight:500">Create an account</a>
    </p>

    <div class="text-center mt-6 text-sm" style="color:#6c757d;margin-top:32px">
      <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:12px">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        <span style="font-size:0.85rem">Secure & encrypted • We never share your data</span>
      </div>
      <p class="mb-2">Your account is securely stored in Supabase Cloud</p>
      <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap">
        <a href="#" onclick="window.app.auth.showTerms(); return false;" style="color:#6c757d;text-decoration:none;transition:color 0.2s" onmouseover="this.style.color='#6366f1'" onmouseout="this.style.color='#6c757d'">Terms of Service</a>
        <span>•</span>
        <a href="#" onclick="window.app.auth.showPrivacy(); return false;" style="color:#6c757d;text-decoration:none;transition:color 0.2s" onmouseover="this.style.color='#6366f1'" onmouseout="this.style.color='#6c757d'">Privacy Policy</a>
      </div>
    </div>
  </div>
</div>
<style>
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

.fade-in { animation: fadeIn 0.5s ease-out; }

.mobile-optimized * {
  -webkit-tap-highlight-color: transparent;
}

.auth-card-enhanced {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  padding: 48px 40px;
  max-width: 440px;
  width: 100%;
  border: 1px solid rgba(0,0,0,0.08);
}

@media (max-width: 640px) {
  .auth-card-enhanced {
    padding: 32px 24px;
    border-radius: 12px;
  }
}

.touch-target {
  min-height: 44px;
  min-width: 44px;
}

.btn-google {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 24px;
  background: white;
  border: 1px solid #dadce0;
  border-radius: 4px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s cubic-bezier(0.4,0,0.2,1);
  color: #3c4043;
  font-family: 'Google Sans', Roboto, Arial, sans-serif;
  box-shadow: 0 1px 2px 0 rgba(60,64,67,.30), 0 1px 3px 1px rgba(60,64,67,.15);
}

.btn-google:hover:not(:disabled) {
  background: #f8f9fa;
  border-color: #d2e3fc;
  box-shadow: 0 1px 3px 0 rgba(60,64,67,.30), 0 4px 8px 3px rgba(60,64,67,.15);
}

.btn-google:active:not(:disabled) {
  background: #f1f3f4;
  box-shadow: 0 1px 2px 0 rgba(60,64,67,.30), 0 1px 3px 1px rgba(60,64,67,.15);
}

.btn-google:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary-enhanced {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 20px;
}

.btn-primary-enhanced:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(99,102,241,0.4);
}

.btn-primary-enhanced:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary-enhanced:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.form-input-enhanced {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s;
  outline: none;
}

.form-input-enhanced:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
}

.form-input-enhanced.error {
  border-color: #ef4444;
}

.form-input-enhanced:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
}

.error-message {
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 4px;
  display: block;
}

.password-toggle:hover:not(:disabled) {
  color: #6366f1;
}

.password-toggle:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.password-toggle-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none !important;
  border: none !important;
  box-shadow: none !important;
  border-radius: 0 !important;
  cursor: pointer;
  color: #9ca3af;
  padding: 0 !important;
  margin: 0 !important;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
  outline: none !important;
  line-height: 0;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.password-toggle-icon svg {
  display: block;
  width: 18px;
  height: 18px;
  pointer-events: none;
}

.password-toggle-icon:hover:not(:disabled) {
  color: #6366f1;
  background: none !important;
  border: none !important;
  box-shadow: none !important;
}

.password-toggle-icon:active:not(:disabled) {
  background: none !important;
  border: none !important;
  box-shadow: none !important;
}

.password-toggle-icon:focus {
  outline: none !important;
  background: none !important;
  border: none !important;
  box-shadow: none !important;
}

.password-toggle-icon:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: none !important;
  border: none !important;
  box-shadow: none !important;
}

.caps-warning {
  display: block;
  animation: fadeIn 0.3s ease-out;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 24px 0;
  color: #9ca3af;
  font-size: 0.875rem;
}

.divider::before, .divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e5e7eb;
}

.divider span {
  padding: 0 12px;
}

.password-strength {
  display: flex;
  gap: 4px;
  margin-top: 8px;
}

.password-strength span {
  flex: 1;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  transition: background 0.3s;
}

.password-strength span.active-weak { background: #ef4444; }
.password-strength span.active-medium { background: #f59e0b; }
.password-strength span.active-strong { background: #10b981; }

.tooltip {
  position: absolute;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%);
  background: #1f2937;
  color: white;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  white-space: nowrap;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: #1f2937;
}

.lockout-warning {
  background: #fef2f2;
  border: 2px solid #ef4444;
  color: #991b1b;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 500;
  animation: fadeIn 0.3s ease-out;
}

@media (max-width: 640px) {
  .tooltip {
    white-space: normal;
    max-width: 250px;
  }
}
</style>`;
    document.getElementById('auth-screen').innerHTML = html;
  }

  showSignupForm() {
    const html = `
<div class="min-h-screen flex items-center justify-center p-4 mobile-optimized" style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%)">
  <div class="auth-card-enhanced">
    <div class="text-center mb-8 fade-in">
      <div class="logo-icon" style="width:144px;height:144px;display:flex;align-items:center;justify-content:center;margin:0 auto">
        <img src=https://raw.githubusercontent.com/lironkerem/self-analysis-pro/main/assets/Watermarks/Logo.svg alt=Aanandoham style="width:120px;height:120px;object-fit:contain" loading="eager">
      </div>
      <h1 class="text-3xl font-bold mb-2">Create Account</h1>
      <p style="color:#6c757d;font-weight:bold;font-size:1.1rem">Join The Curiosity Path</p>
      <p style="color:#9ca3af;font-size:0.9rem;margin-top:8px">Join 10,000+ seekers on their journey</p>
    </div>

    <!-- GOOGLE -->
    <button onclick="window.app.auth.handleGoogleSignup()" class="btn-google w-full mb-4 touch-target" style="margin-top:2.5rem">
      <svg width="20" height="20" viewBox="0 0 48 48" style="margin-right:12px"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.03h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.66z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></svg>
      <span style="font-weight:500;color:#3c4043">Sign up with Google</span>
    </button>

    <div class=divider><span>or</span></div>

    <form id=signup-form onsubmit="window.app.auth.handleSignup(event)" class="space-y-4"
      <div class=form-group style="margin-bottom:20px">
        <label class=form-label style="margin-bottom:8px;display:block">Name</label>
        <input type=text class="form-input-enhanced" placeholder="Your spiritual name" autocomplete="name" required>
        <span class="error-message" style="display:none"></span>
      </div>
      <div class=form-group style="margin-bottom:20px">
        <label class=form-label style="margin-bottom:8px;display:block">Email</label>
        <input type=email class="form-input-enhanced" placeholder="your@email.com" autocomplete="email" inputmode="email" required>
        <span class="error-message" style="display:none"></span>
      </div>
      <div class=form-group style="margin-bottom:20px">
        <label class=form-label style="margin-bottom:8px;display:block">
          Password
          <span class="password-hint" style="position:relative;display:inline-block;margin-left:4px">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="cursor:help" onmouseenter="window.app.auth.showPasswordHint(this)" onmouseleave="window.app.auth.hidePasswordHint(this)">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <div class="tooltip" style="display:none">
              <strong>Password must have:</strong>
              <ul style="margin:8px 0 0 0;padding-left:20px;text-align:left">
                <li>At least 6 characters</li>
                <li>Mix of letters & numbers (recommended)</li>
                <li>Special characters for extra security</li>
              </ul>
            </div>
          </span>
        </label>
        <div style="position:relative">
          <input type=password class="form-input-enhanced" placeholder="••••••••" minlength=6 autocomplete="new-password" required oninput="window.app.auth.debouncedPasswordCheck(this)" onkeyup="window.app.auth.checkCapsLock(event)">
          <button type=button class="password-toggle-icon" onclick="window.app.auth.togglePassword(this)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
        </div>
        <div class="password-strength" style="margin-top:8px">
          <span></span><span></span><span></span><span></span>
        </div>
        <span class="caps-warning" style="display:none;color:#f59e0b;font-size:0.8rem;margin-top:4px">⚠️ Caps Lock is ON</span>
        <span class="error-message" style="display:none"></span>
      </div>
      
      <button type=submit class="btn-primary-enhanced w-full touch-target" style="margin-top:24px">
        <span class="btn-text">Sign Up</span>
        <span class="btn-spinner" style="display:none">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="0.75"></path>
          </svg>
        </span>
      </button>
    </form>

    <p class="text-center mt-4 text-sm" style="margin-top:24px">
      <a href="#" onclick="window.app.auth.renderAuthScreen(); return false;" style="color:#6366f1;text-decoration:none;font-weight:500">Already have an account? Sign in</a>
    </p>

    <div class="text-center mt-6 text-sm" style="color:#6c757d;margin-top:32px">
      <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:12px">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        <span style="font-size:0.85rem">Secure & encrypted • We never share your data</span>
      </div>
      <p class="mb-2">Your account is securely stored in Supabase Cloud</p>
      <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap">
        <a href="#" onclick="window.app.auth.showTerms(); return false;" style="color:#6c757d;text-decoration:none;transition:color 0.2s" onmouseover="this.style.color='#6366f1'" onmouseout="this.style.color='#6c757d'">Terms of Service</a>
        <span>•</span>
        <a href="#" onclick="window.app.auth.showPrivacy(); return false;" style="color:#6c757d;text-decoration:none;transition:color 0.2s" onmouseover="this.style.color='#6366f1'" onmouseout="this.style.color='#6c757d'">Privacy Policy</a>
      </div>
    </div>
  </div>
</div>`;
    document.getElementById('auth-screen').innerHTML = html;
  }

  showForgotPassword() {
    const html = `
<div class="min-h-screen flex items-center justify-center p-4 mobile-optimized" style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%)">
  <div class="auth-card-enhanced">
    <div class="text-center mb-8 fade-in">
      <div class="logo-icon" style="width:144px;height:144px;display:flex;align-items:center;justify-content:center;margin:0 auto;margin-bottom:16px">
        <img src=https://raw.githubusercontent.com/lironkerem/self-analysis-pro/main/assets/Watermarks/Logo.svg alt=Aanandoham style="width:120px;height:120px;object-fit:contain" loading="eager">
      </div>
      <h1 class="text-3xl font-bold mb-2">Reset Password</h1>
      <p style="color:#6c757d;font-size:0.95rem">Enter your email to receive a reset link</p>
    </div>

    <form id=forgot-form onsubmit="window.app.auth.handleForgotPassword(event)" class="space-y-4" style="margin-top:2.5rem">
      <div class=form-group style="margin-bottom:20px">
        <label class=form-label style="margin-bottom:8px;display:block">Email</label>
        <input type=email class="form-input-enhanced" placeholder="your@email.com" autocomplete="email" inputmode="email" required>
        <span class="error-message" style="display:none"></span>
      </div>
      
      <button type=submit class="btn-primary-enhanced w-full touch-target" style="margin-top:24px">
        <span class="btn-text">Send Reset Link</span>
        <span class="btn-spinner" style="display:none">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="0.75"></path>
          </svg>
        </span>
      </button>
    </form>

    <p class="text-center mt-4 text-sm" style="margin-top:24px">
      <a href="#" onclick="window.app.auth.renderAuthScreen(); return false;" style="color:#6366f1;text-decoration:none;font-weight:500">Back to sign in</a>
    </p>

    <div class="text-center mt-6 text-sm" style="color:#6c757d;margin-top:32px">
      <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:12px">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        <span style="font-size:0.85rem">Secure & encrypted • We never share your data</span>
      </div>
    </div>
  </div>
</div>`;
    document.getElementById('auth-screen').innerHTML = html;
  }

  /* ---------- UI HELPERS ---------- */
  togglePassword(btn) {
    const input = btn.previousElementSibling;
    const svg = btn.querySelector('svg');
    if (input.type === 'password') {
      input.type = 'text';
      svg.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
    } else {
      input.type = 'password';
      svg.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
    }
  }

  checkCapsLock(event) {
    const capsWarning = event.target.closest('.form-group').querySelector('.caps-warning');
    if (!capsWarning) return;
    
    if (event.getModifierState && event.getModifierState('CapsLock')) {
      capsWarning.style.display = 'block';
    } else {
      capsWarning.style.display = 'none';
    }
  }

  showPasswordHint(svg) {
    const tooltip = svg.parentElement.querySelector('.tooltip');
    if (tooltip) tooltip.style.display = 'block';
  }

  hidePasswordHint(svg) {
    const tooltip = svg.parentElement.querySelector('.tooltip');
    if (tooltip) tooltip.style.display = 'none';
  }

  showTerms() {
    this._showModal('Terms of Service', `
      <h3 style="font-weight:600;margin-bottom:16px">1. Acceptance of Terms</h3>
      <p style="margin-bottom:16px">By accessing and using The Curiosity Path, you accept and agree to be bound by the terms and provision of this agreement.</p>
      
      <h3 style="font-weight:600;margin-bottom:16px">2. Use License</h3>
      <p style="margin-bottom:16px">Permission is granted to temporarily access the materials on The Curiosity Path for personal, non-commercial transitory viewing only.</p>
      
      <h3 style="font-weight:600;margin-bottom:16px">3. User Account</h3>
      <p style="margin-bottom:16px">You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>
      
      <h3 style="font-weight:600;margin-bottom:16px">4. Prohibited Uses</h3>
      <p style="margin-bottom:16px">You may not use our service for any illegal or unauthorized purpose, nor may you violate any laws in your jurisdiction.</p>
      
      <h3 style="font-weight:600;margin-bottom:16px">5. Modifications</h3>
      <p style="margin-bottom:16px">We reserve the right to modify or replace these Terms at any time. Continued use of the service after changes constitutes acceptance.</p>
      
      <h3 style="font-weight:600;margin-bottom:16px">6. Contact</h3>
      <p>For questions about these Terms, please contact us through our support channels.</p>
    `);
  }

  showPrivacy() {
    this._showModal('Privacy Policy', `
      <h3 style="font-weight:600;margin-bottom:16px">1. Information We Collect</h3>
      <p style="margin-bottom:16px">We collect information you provide directly to us, including your name, email address, and any other information you choose to provide.</p>
      
      <h3 style="font-weight:600;margin-bottom:16px">2. How We Use Your Information</h3>
      <p style="margin-bottom:16px">We use the information we collect to provide, maintain, and improve our services, to process your transactions, and to communicate with you.</p>
      
      <h3 style="font-weight:600;margin-bottom:16px">3. Information Sharing</h3>
      <p style="margin-bottom:16px">We do not share your personal information with third parties except as described in this policy or with your consent.</p>
      
      <h3 style="font-weight:600;margin-bottom:16px">4. Data Security</h3>
      <p style="margin-bottom:16px">Your data is securely stored in Supabase Cloud with industry-standard encryption. We implement appropriate technical and organizational measures to protect your information.</p>
      
      <h3 style="font-weight:600;margin-bottom:16px">5. Your Rights</h3>
      <p style="margin-bottom:16px">You have the right to access, update, or delete your personal information at any time through your account settings.</p>
      
      <h3 style="font-weight:600;margin-bottom:16px">6. Cookies and Tracking</h3>
      <p style="margin-bottom:16px">We use local storage to maintain your session and improve your experience. No third-party tracking cookies are used.</p>
      
      <h3 style="font-weight:600;margin-bottom:16px">7. Changes to Privacy Policy</h3>
      <p style="margin-bottom:16px">We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
      
      <h3 style="font-weight:600;margin-bottom:16px">8. Contact Us</h3>
      <p>If you have questions about this Privacy Policy, please contact us through our support channels.</p>
    `);
  }

  _showModal(title, content) {
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:10000;padding:20px;animation:fadeIn 0.2s ease-out';
    
    modal.innerHTML = `
      <div style="background:white;border-radius:16px;max-width:600px;width:100%;max-height:80vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.3);animation:slideUp 0.3s ease-out">
        <div style="padding:24px;border-bottom:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:white;z-index:1">
          <h2 style="font-size:1.5rem;font-weight:700;color:#1f2937">${title}</h2>
          <button onclick="this.closest('div[style*=fixed]').remove()" style="background:none;border:none;cursor:pointer;padding:8px;color:#6c757d;transition:color 0.2s" onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='#6c757d'">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div style="padding:24px;color:#374151;line-height:1.6">
          ${content}
        </div>
      </div>
    `;
    
    modal.onclick = (e) => {
      if (e.target === modal) modal.remove();
    };
    
    document.body.appendChild(modal);
  }

  debouncedPasswordCheck(input) {
    clearTimeout(this.passwordStrengthTimeout);
    this.passwordStrengthTimeout = setTimeout(() => {
      this.checkPasswordStrength(input);
    }, 300);
  }

  checkPasswordStrength(input) {
    const password = input.value;
    const strengthBars = input.closest('.form-group').querySelectorAll('.password-strength span');
    if (!strengthBars.length) return;
    
    let strength = 0;

    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) strength++;

    strengthBars.forEach((bar, i) => {
      bar.className = '';
      if (i < strength) {
        if (strength <= 1) bar.classList.add('active-weak');
        else if (strength <= 2) bar.classList.add('active-medium');
        else bar.classList.add('active-strong');
      }
    });
  }

  showError(input, message) {
    input.classList.add('error');
    const errorSpan = input.closest('.form-group').querySelector('.error-message');
    errorSpan.textContent = message;
    errorSpan.style.display = 'block';
  }

  clearError(input) {
    input.classList.remove('error');
    const errorSpan = input.closest('.form-group').querySelector('.error-message');
    if (errorSpan) errorSpan.style.display = 'none';
  }

  showSuccess(message) {
    const toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;top:20px;right:20px;background:#10b981;color:white;padding:16px 24px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);z-index:10000;animation:slideIn 0.3s ease-out';
    toast.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>${message}</span>
      </div>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  /* ---------- FAILED ATTEMPT TRACKING ---------- */
  _isAccountLocked() {
    const lockoutData = localStorage.getItem('login_lockout');
    if (!lockoutData) return false;

    try {
      const { lockedUntil } = JSON.parse(lockoutData);
      return Date.now() < lockedUntil;
    } catch {
      localStorage.removeItem('login_lockout');
      return false;
    }
  }

  _getLockoutMessage() {
    const lockoutData = localStorage.getItem('login_lockout');
    if (!lockoutData) return '';

    try {
      const { lockedUntil } = JSON.parse(lockoutData);
      const remainingMs = lockedUntil - Date.now();
      const remainingMins = Math.ceil(remainingMs / 60000);
      return `⚠️ Too many failed attempts. Please try again in ${remainingMins} minute${remainingMins !== 1 ? 's' : ''}.`;
    } catch {
      return '';
    }
  }

  _recordFailedAttempt() {
    this.failedAttempts++;
    
    if (this.failedAttempts >= this.maxFailedAttempts) {
      const lockedUntil = Date.now() + this.lockoutTime;
      localStorage.setItem('login_lockout', JSON.stringify({ lockedUntil }));
      this.renderAuthScreen();
    }
  }

  _resetFailedAttempts() {
    this.failedAttempts = 0;
    localStorage.removeItem('login_lockout');
  }

  /* ---------- GOOGLE ---------- */
  async handleGoogleLogin() {
    if (this._isAccountLocked()) return;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin, queryParams: { access_type: 'offline', prompt: 'consent' } }
    });
    if (error) { 
      console.error('Google login error:', error); 
      this.showError(document.querySelector('.btn-google'), 'Failed to sign in with Google'); 
    }
  }

  async handleGoogleSignup() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin, queryParams: { access_type: 'offline', prompt: 'consent' } }
    });
    if (error) { 
      console.error('Google signup error:', error); 
      alert('Failed to sign up with Google: ' + error.message);
    }
  }

  /* ---------- EMAIL ---------- */
  async handleLogin(e) {
    e.preventDefault();
    
    if (this.isSubmitting) return;
    if (this._isAccountLocked()) return;

    this.isSubmitting = true;
    
    const btn = e.target.querySelector('button[type="submit"]');
    const btnText = btn.querySelector('.btn-text');
    const btnSpinner = btn.querySelector('.btn-spinner');
    
    btn.disabled = true;
    btnText.style.display = 'none';
    btnSpinner.style.display = 'block';

    const emailInput = e.target.querySelector('input[type="email"]');
    const passInput = e.target.querySelector('input[type="password"]');
    const email = emailInput.value.trim();
    const pass = passInput.value;
    
    this.clearError(emailInput);
    this.clearError(passInput);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    
    this.isSubmitting = false;
    btn.disabled = false;
    btnText.style.display = 'block';
    btnSpinner.style.display = 'none';

    if (error) {
      this._recordFailedAttempt();
      
      if (error.message.includes('Invalid login')) {
        const attemptsLeft = this.maxFailedAttempts - this.failedAttempts;
        const message = attemptsLeft > 0 
          ? `Invalid email or password. ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining.`
          : 'Invalid email or password';
        this.showError(emailInput, message);
        this.showError(passInput, message);
      } else {
        this.showError(emailInput, error.message);
      }
      return;
    }

    this._resetFailedAttempts();

    // Remember me functionality
    const rememberMe = document.getElementById('remember-me')?.checked;
    if (rememberMe) {
      localStorage.setItem('remember_me', 'true');
    }

    await this._setAuthenticated(data.user);
  }

  async handleSignup(e) {
    e.preventDefault();
    
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    
    const btn = e.target.querySelector('button[type="submit"]');
    const btnText = btn.querySelector('.btn-text');
    const btnSpinner = btn.querySelector('.btn-spinner');
    
    btn.disabled = true;
    btnText.style.display = 'none';
    btnSpinner.style.display = 'block';

    const nameInput = e.target.querySelector('input[type="text"]');
    const emailInput = e.target.querySelector('input[type="email"]');
    const passInput = e.target.querySelector('input[type="password"]');
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const pass = passInput.value;
    
    this.clearError(nameInput);
    this.clearError(emailInput);
    this.clearError(passInput);

    // Validate password strength
    if (pass.length < 6) {
      this.showError(passInput, 'Password must be at least 6 characters');
      this.isSubmitting = false;
      btn.disabled = false;
      btnText.style.display = 'block';
      btnSpinner.style.display = 'none';
      return;
    }

    const { data, error } = await supabase.auth.signUp({ email, password: pass, options: { data: { name } } });
    
    this.isSubmitting = false;
    btn.disabled = false;
    btnText.style.display = 'block';
    btnSpinner.style.display = 'none';

    if (error) {
      if (error.message.includes('already registered')) {
        this.showError(emailInput, 'Email already registered');
      } else {
        this.showError(emailInput, error.message);
      }
      return;
    }

    if (data.user) {
      if (data.user.identities && data.user.identities.length === 0) {
        this.showSuccess('Check your email to verify your account!');
        setTimeout(() => this.renderAuthScreen(), 2000);
      } else {
        await this._initUserProgress(data.user.id);
        await this._setAuthenticated(data.user);
      }
    }
  }

  async handleForgotPassword(e) {
    e.preventDefault();
    
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    
    const btn = e.target.querySelector('button[type="submit"]');
    const btnText = btn.querySelector('.btn-text');
    const btnSpinner = btn.querySelector('.btn-spinner');
    
    btn.disabled = true;
    btnText.style.display = 'none';
    btnSpinner.style.display = 'block';

    const emailInput = e.target.querySelector('input[type="email"]');
    const email = emailInput.value.trim();
    
    this.clearError(emailInput);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    this.isSubmitting = false;
    btn.disabled = false;
    btnText.style.display = 'block';
    btnSpinner.style.display = 'none';

    if (error) {
      this.showError(emailInput, error.message);
      return;
    }

    this.showSuccess('Password reset link sent! Check your email.');
    setTimeout(() => this.renderAuthScreen(), 2000);
  }

  /* ---------- INTERNAL ---------- */
  async _initUserProgress(uid) {
    const payload = this.app.state.emptyModel();
    const { error } = await supabase.from('user_progress').insert({ user_id: uid, payload, updated_at: new Date().toISOString() });
    if (error) console.error('Failed to init user_progress:', error);
  }

  async _ensureUserProgress(uid) {
    const { data } = await supabase.from('user_progress').select('user_id').eq('user_id', uid).single();
    if (!data) await this._initUserProgress(uid);
  }

  async _setAuthenticated(u) {
    const isGoogle = u.app_metadata?.provider === 'google';

    // fetch admin flag
    let isAdmin = false;
    try {
      const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', u.id).single();
      isAdmin = profile?.is_admin || false;
    } catch (e) { console.warn('admin check failed', e); }

    const user = {
      id: u.id,
      name: u.user_metadata?.full_name || u.user_metadata?.name || u.email.split('@')[0],
      email: u.email,
      phone: u.user_metadata?.phone || '',
      birthday: u.user_metadata?.birthday || '',
      emoji: u.user_metadata?.emoji || '👤',
      avatarUrl: u.user_metadata?.avatar_url || u.user_metadata?.avatarUrl || null,
      tier: 'Premium',
      joinDate: u.created_at,
      provider: isGoogle ? 'google' : 'email',
      isAdmin
    };
    this.app.state.currentUser = user;
    this.app.state.isAuthenticated = true;
    localStorage.setItem('pc_user', JSON.stringify(user));

    const scr = document.getElementById('auth-screen');
    if (scr) { scr.style.display = 'none'; scr.innerHTML = ''; }

    if (isGoogle) this._ensureUserProgress(user.id);

    // CRITICAL: mark theme as loaded so app shell becomes visible
    document.documentElement.classList.add('theme-loaded');

    await this.app.initializeApp();
  }

  _clearLocalUser() {
    localStorage.removeItem('pc_user');
    this.app.state.currentUser = null;
    this.app.state.isAuthenticated = false;
  }

  async signOut() {
    await supabase.auth.signOut();
    this._clearLocalUser();
    ['pc_appdata','pc_active_tab','lastDailyReset','last_quest_reset','daily_tarot_card','activeTheme','remember_me','login_lockout']
      .forEach(k => localStorage.removeItem(k));
    console.log('✅ Logged out and cleared local data');
    location.reload();
  }
}

/* =====  PROFILE HELPERS  (late-attach so window.app exists)  ===== */
function attachProfileHelpers() {
  if (!window.app) { requestAnimationFrame(attachProfileHelpers); return; }

  window.app.saveQuickProfile = async function () {
    const uid = this.state?.currentUser?.id;
    if (!uid) return this.showToast('Not logged in', 'error');

    const payload = {
      name:        document.getElementById('profile-name')?.value.trim()   || null,
      email:       document.getElementById('profile-email')?.value.trim()  || null,
      phone:       document.getElementById('profile-phone')?.value.trim()  || null,
      birthday:    document.getElementById('profile-birthday')?.value      || null,
      emoji:       document.getElementById('profile-emoji')?.value         || '👤',
      avatarUrl:   document.getElementById('profile-avatar-img')?.src || ''
    };

    let savedOnServer = false;
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: uid, ...payload }, { onConflict: 'id' });
      if (!error) savedOnServer = true;
    } catch (e) { console.warn('Profile server save failed', e); }

    localStorage.setItem(`profile_${uid}`, JSON.stringify(payload));
    Object.assign(this.state.currentUser, payload);
    this.userTab?.syncAvatar();
    this.showToast(
      savedOnServer ? '✅ Profile saved & synced' : '⚠️ Saved locally (offline)',
      savedOnServer ? 'success' : 'warning'
    );
  };

  window.app.hydrateUserProfile = async function () {
    const uid = this.state?.currentUser?.id;
    if (!uid) return;

    const localKey = `profile_${uid}`;
    let data = null;

    try {
      const { data: row, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single();
      if (!error && row) data = row;
    } catch (e) { console.warn('Profile fetch error', e); }

    if (!data) {
      try { data = JSON.parse(localStorage.getItem(localKey)); } catch (e) {}
    }

    if (data) {
      const target = this.state.currentUser;
      ['name','email','phone','birthday','emoji','avatarUrl'].forEach(k => {
        if (data[k] !== undefined) target[k] = data[k];
      });
      this.userTab?.syncAvatar();
    }
  };
}

attachProfileHelpers();   // kick off once