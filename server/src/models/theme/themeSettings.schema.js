const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Theme Settings sub-model
 *
 * Mirrors the Theme permission sub-module "Theme Settings" (nav-icons/widget.svg)
 * and the frontend page `admin/src/app/pages/Theme/Settings/Settings.jsx`.
 * Holds notification behavior, animations and locale settings.
 *
 * NOTE: named "themeSettings" (not "settings") to avoid clashing with the
 * top-level flat `settings` field used by the API contract.
 */
const ThemeSettingsSchema = new Schema(
  {
    icon: { type: String, default: 'nav-icons/widget.svg' },

    // Toast notification behavior
    notification: {
      type: Schema.Types.Mixed,
      default: {
        isExpanded: false,
        position: 'top-center',
        visibleToasts: 4,
      },
    },

    // Motion / transition behavior
    animations: {
      type: Schema.Types.Mixed,
      default: {
        enabled: true,
        speed: 'normal',
      },
    },

    // Locale settings
    defaultLang: { type: String, default: 'en' },
    fallbackLang: { type: String, default: 'en' },
  },
  { _id: false },
);

module.exports = ThemeSettingsSchema;
