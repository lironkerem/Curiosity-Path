// AuthManager.js — Google + email login, optimised, no new files
/* global window, document, location, localStorage, alert */

import { supabase } from './Supabase.js';

export default class AuthManager {
  constructor(app) { this.app = app; }

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
    const html = `
<div class="min-h-screen flex items-center justify-center p-4">
  <div class=auth-card style="border:1px solid #000">
    <div class=text-center mb-8>
      <div class="logo-icon mx-auto mb-4" style="width:144px;height:144px;display:flex;align-items:center;justify-content:center">
        <img src=https://raw.githubusercontent.com/lironkerem/self-analysis-pro/main/assets/Watermarks/Logo.svg alt=Aanandoham style="width:120px;height:120px;object-fit:contain">
      </div>
      <h1 class="text-3xl font-bold mb-2">The Curiosity Path</h1>
      <p style="color:#6c757d;font-weight:bold;font-size:1.1rem">by Aanandoham</p>
    </div>

    <div class="flex gap-2 mb-6" style="justify-content:space-between;margin-top:2.5rem">
      <button onclick="window.app.auth.showTab('login')" class="auth-tab active" data-tab=login style="flex:1">Sign In</button>
      <button onclick="window.app.auth.showTab('signup')" class=auth-tab data-tab=signup style="flex:1">Sign Up</button>
    </div>

    <!-- GOOGLE -->
    <button onclick="window.app.auth.handleGoogleLogin()" class="btn btn-primary w-full mb-4">
      <svg width="18" height="18" viewBox="0 0 48 48" class="mr-2"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.03h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.66z"/><path fill="#4285F4" d="M8.08 27.31A14.5 14.5 0 0 1 8.08 20.7V13.5H.18a24.04 24.04 0 0 0 0 21.96l7.9-6.15z"/><path fill="#FBBC05" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
      Continue with Google
    </button>

    <div class=divider><span>or</span></div>

    <form id=login-form onsubmit="window.app.auth.handleLogin(event)" class="space-y-4">
      <div class=form-group><label class=form-label>Email</label><input type=email class=form-input placeholder="your@email.com" required></div>
      <div class=form-group><label class=form-label>Password</label><input type=password class=form-input placeholder="••••••••" required></div>
      <button type=submit class="btn btn-primary w-full">Sign In</button>
    </form>

    <form id=signup-form onsubmit="window.app.auth.handleSignup(event)" class="space-y-4 hidden">
      <div class=form-group><label class=form-label>Name</label><input type=text class=form-input placeholder="Your spiritual name" required></div>
      <div class=form-group><label class=form-label>Email</label><input type=email class=form-input placeholder="your@email.com" required></div>
      <div class=form-group><label class=form-label>Password</label><input type=password class=form-input placeholder="••••••••" minlength=6 required></div>
      <button type=submit class="btn btn-primary w-full">Sign Up</button>
    </form>

    <p class="text-center mt-6 text-sm" style="color:#6c757d">Your account is securely stored in Supabase Cloud</p>
  </div>
</div>
<style>
.divider{display:flex;align-items:center;text-align:center;margin:20px 0;color:#9ca3af;font-size:.875rem}
.divider::before,.divider::after{content:'';flex:1;border-bottom:1px solid #e5e7eb}
.divider span{padding:0 12px}
</style>`;
    document.getElementById('auth-screen').innerHTML = html;
  }

  showTab(name) {
    document.querySelectorAll('.auth-tab').forEach(btn => {
      const on = btn.dataset.tab === name;
      btn.classList.toggle('active', on);
      btn.classList.toggle('bg-primary-600 text-white', on);
      btn.classList.toggle('bg-white/10 text-purple-200', !on);
    });
    document.getElementById('login-form').classList.toggle('hidden', name !== 'login');
    document.getElementById('signup-form').classList.toggle('hidden', name !== 'signup');
  }

  /* ---------- GOOGLE ---------- */
  async handleGoogleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin, queryParams: { access_type: 'offline', prompt: 'consent' } }
    });
    if (error) { console.error('Google login error:', error); alert('Failed to sign in with Google: ' + error.message); }
  }

  /* ---------- EMAIL ---------- */
  async handleLogin(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]'), orig = btn.textContent;
    btn.textContent = 'Signing in...'; btn.disabled = true;
    const email = e.target.querySelector('input[type="email"]').value.trim();
    const pass  = e.target.querySelector('input[type="password"]').value;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    btn.textContent = orig; btn.disabled = false;
    if (error) return alert(error.message);
    await this._setAuthenticated(data.user);
  }

  async handleSignup(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]'), orig = btn.textContent;
    btn.textContent = 'Creating account...'; btn.disabled = true;
    const name  = e.target.querySelector('input[type="text"]').value.trim();
    const email = e.target.querySelector('input[type="email"]').value.trim();
    const pass  = e.target.querySelector('input[type="password"]').value;
    const { data, error } = await supabase.auth.signUp({ email, password: pass, options: { data: { name } } });
    btn.textContent = orig; btn.disabled = false;
    if (error) return alert(error.message);
    if (data.user) await this._initUserProgress(data.user.id);
    await this._setAuthenticated(data.user);
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
    
    // Fetch isAdmin from profiles
    let isAdmin = false;
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', u.id)
        .single();
      isAdmin = profile?.is_admin || false;
    } catch (error) {
      console.error('Failed to check admin status:', error);
    }
    
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
      isAdmin: isAdmin
    };
    this.app.state.currentUser = user;
    this.app.state.isAuthenticated = true;
    localStorage.setItem('pc_user', JSON.stringify(user));

    const scr = document.getElementById('auth-screen');
    if (scr) { scr.style.display = 'none'; scr.innerHTML = ''; }

    if (isGoogle) this._ensureUserProgress(user.id);
  }

  _clearLocalUser() {
    localStorage.removeItem('pc_user');
    this.app.state.currentUser = null;
    this.app.state.isAuthenticated = false;
  }

  async signOut() {
    await supabase.auth.signOut();
    this._clearLocalUser();
    ['pc_appdata','pc_active_tab','lastDailyReset','last_quest_reset','daily_tarot_card','activeTheme']
      .forEach(k => localStorage.removeItem(k));
    console.log('✅ Logged out and cleared local data');
    location.reload();
  }
}