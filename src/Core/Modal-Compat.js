/**
 * Modal Compatibility Layer
 *
 * Backward-compatible wrappers for legacy code that calls modal functions via
 * window.app. New code should import from './Modal.js' directly.
 *
 * Migration guide:
 *   OLD: import { openSettings } from './Modal-Compat.js'; openSettings();
 *   NEW: import { openSettings } from './Modal.js'; openSettings(app);
 *
 * @deprecated This file exists for backward compatibility only.
 */

import * as modal from './Modal.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns window.app, or null with a console warning. */
function getApp() {
  if (typeof window === 'undefined') return null;
  if (!window.app) {
    console.warn('[Modal-Compat] window.app is not yet initialised.');
    return null;
  }
  return window.app;
}

/**
 * Calls a modal function that requires an app instance.
 * Silently no-ops if app is unavailable.
 */
function safeModalCall(fn, ...args) {
  const app = getApp();
  if (!app) return;
  return fn(app, ...args);
}

// ─── Modal openers ────────────────────────────────────────────────────────────

/** @deprecated Use modal.openSettings(app) */
export const openSettings = () => safeModalCall(modal.openSettings);

/** @deprecated Use modal.openAbout(app) */
export const openAbout    = () => safeModalCall(modal.openAbout);

/** @deprecated Use modal.openContact(app) */
export const openContact  = () => safeModalCall(modal.openContact);

/** @deprecated Use modal.openBilling(app) */
export const openBilling  = () => safeModalCall(modal.openBilling);

// ─── Profile & avatar ─────────────────────────────────────────────────────────

/** @deprecated Use modal.saveQuickProfile(app) */
export const saveQuickProfile    = () => safeModalCall(modal.saveQuickProfile);

/** @deprecated Use modal.refreshAvatar(app) */
export const refreshAvatar       = () => safeModalCall(modal.refreshAvatar);

/** @deprecated Use modal.avatarUploadHandler(app) */
export const avatarUploadHandler = () => safeModalCall(modal.avatarUploadHandler);

// ─── Other ────────────────────────────────────────────────────────────────────

/** @deprecated Use modal.selectPlan(app, planId) */
export const selectPlan = (planId) => safeModalCall(modal.selectPlan, planId);

/** @deprecated Use data-tab attributes with modal.attachSettingsHandlers instead */
export const switchSettingTab = modal.switchSettingTab;
