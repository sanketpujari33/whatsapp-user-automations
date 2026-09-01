const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Appearance sub-model
 *
 * Mirrors the Theme permission sub-module "Appearance" (nav-icons/widget.svg)
 * and the frontend page `admin/src/app/pages/Theme/Apperance/Apperance.jsx`.
 * Holds the visual mode, accent color and interface density settings.
 */
const AppearanceSchema = new Schema(
  {
    icon: { type: String, default: 'nav-icons/widget.svg' },

    // Visual mode: light | dark | system
    themeMode: { type: String, default: 'system', enum: ['light', 'dark', 'system'] },

    // Interface density: bordered | shadow-sm
    cardSkin: { type: String, default: 'bordered', enum: ['bordered', 'shadow-sm'] },

    // High contrast / monochrome palette
    isMonochrome: { type: Boolean, default: false },

    // Accent color scheme (named object, e.g. { name: 'purple', ...colors })
    primaryColorScheme: { type: Schema.Types.Mixed, default: { name: 'purple' } },

    // Light mode color scheme
    lightColorScheme: { type: Schema.Types.Mixed, default: { name: 'slate' } },

    // Dark mode color scheme
    darkColorScheme: { type: Schema.Types.Mixed, default: { name: 'cinder' } },
  },
  { _id: false },
);

module.exports = AppearanceSchema;
