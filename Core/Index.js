/**
 * Core Module Barrel Export
 * Central export point for all core application modules
 * Provides clean imports: import { AppState, AuthManager } from './Core'
 */

// State Management & Authentication
export { default as AppState } from './AppState.js';
export { default as AuthManager } from './AuthManager.js';

// Navigation & Dashboard
export { default as NavigationManager } from './NavigationManager.js';
export { default as DashboardManager } from './DashboardManager.js';

// Main Application
export { default as ProjectCuriosityApp } from './ProjectCuriosityApp.js';

// UI Components & Utilities
export * from './Toast.js';
export * from './Modal-Compat.js'; // Modal compatibility layer