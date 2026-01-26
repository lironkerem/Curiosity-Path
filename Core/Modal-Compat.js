/**
 * Modal Compatibility Layer
 * 
 * Provides backward-compatible wrappers for legacy code that relies on global window.app.
 * New code should import from './Modal.js' directly and pass the app instance.
 * 
 * Migration guide:
 * OLD: import { openSettings } from './Modal-Compat.js'; openSettings();
 * NEW: import { openSettings } from './Modal.js'; openSettings(app);
 * 
 * @deprecated This file exists for backward compatibility only
 */

import * as modal from './Modal.js';

/**
 * Get app instance safely from window
 * @returns {Object|null} App instance or null
 */
function getApp() {
  if (typeof window === 'undefined') {
    console.error('Modal-Compat: window is undefined (running in Node?)');
    return null;
  }
  
  if (!window.app) {
    console.error('Modal-Compat: window.app is undefined. Ensure app is initialized.');
    return null;
  }
  
  return window.app;
}

/**
 * Safe wrapper for modal functions that require app
 * @param {Function} fn - Modal function to wrap
 * @param {...any} args - Additional arguments
 */
function safeModalCall(fn, ...args) {
  const app = getApp();
  if (!app) return;
  return fn(app, ...args);
}

/* --------------------------------------------------
   MODAL OPENERS
   -------------------------------------------------- */

/**
 * Open settings modal (legacy wrapper)
 * @deprecated Use modal.openSettings(app) directly
 */
export const openSettings = () => safeModalCall(modal.openSettings);

/**
 * Open about modal (legacy wrapper)
 * @deprecated Use modal.openAbout(app) directly
 */
export const openAbout = () => safeModalCall(modal.openAbout);

/**
 * Open contact modal (legacy wrapper)
 * @deprecated Use modal.openContact(app) directly
 */
export const openContact = () => safeModalCall(modal.openContact);

/**
 * Open billing modal (legacy wrapper)
 * @deprecated Use modal.openBilling(app) directly
 */
export const openBilling = () => safeModalCall(modal.openBilling);

/* --------------------------------------------------
   PROFILE & AVATAR HANDLERS
   -------------------------------------------------- */

/**
 * Save quick profile (legacy wrapper)
 * @deprecated Use modal.saveQuickProfile(app) directly
 */
export const saveQuickProfile = () => safeModalCall(modal.saveQuickProfile);

/**
 * Refresh avatar (legacy wrapper)
 * @deprecated Use modal.refreshAvatar(app) directly
 */
export const refreshAvatar = () => safeModalCall(modal.refreshAvatar);

/**
 * Handle avatar upload (legacy wrapper)
 * @deprecated Use modal.avatarUploadHandler(app) directly
 */
export const avatarUploadHandler = () => safeModalCall(modal.avatarUploadHandler);

/* --------------------------------------------------
   OTHER MODAL FUNCTIONS
   -------------------------------------------------- */

/**
 * Select billing plan (legacy wrapper)
 * @param {string} planId - Plan ID (first param unused for compatibility)
 * @deprecated Use modal.selectPlan(app, planId) directly
 */
export const selectPlan = (planId) => safeModalCall(modal.selectPlan, planId);

/**
 * Switch settings tab (no app needed)
 * @param {Event} ev - Click event
 * @param {string} tab - Tab ID to switch to
 * @deprecated Use data-tab attributes with modal.attachSettingsHandlers instead
 */
export const switchSettingTab = modal.switchSettingTab;