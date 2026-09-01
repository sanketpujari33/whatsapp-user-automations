const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Themes sub-model
 *
 * Mirrors the Theme permission sub-module "Themes" (nav-icons/widget.svg)
 * and the frontend page `admin/src/app/pages/Theme/Themes/Themes.jsx`.
 * Holds the color scheme / branding of the workspace.
 */
const ThemesSchema = new Schema(
  {
    icon: { type: String, default: 'nav-icons/widget.svg' },

    // Primary (accent) color scheme
    primaryColorScheme: { type: Schema.Types.Mixed, default: { name: 'purple' } },

    // Dark mode color scheme
    darkColorScheme: { type: Schema.Types.Mixed, default: { name: 'cinder' } },

    // Light mode color scheme
    lightColorScheme: { type: Schema.Types.Mixed, default: { name: 'slate' } },

    // High contrast / monochrome palette
    isMonochrome: { type: Boolean, default: false },
  },
  { _id: false },
);

module.exports = ThemesSchema;
