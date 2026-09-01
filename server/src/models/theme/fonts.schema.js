const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Fonts sub-model
 *
 * Mirrors the Theme permission sub-module "Fonts" (nav-icons/typography.svg)
 * and the frontend page `admin/src/app/pages/Theme/Fonts/Fonts.jsx`.
 * Holds the typographic rhythm of the application.
 */
const FontsSchema = new Schema(
  {
    icon: { type: String, default: 'nav-icons/typography.svg' },

    // Heading font family
    headingFont: { type: String, default: 'Hanken Grotesk' },

    // Body font family
    bodyFont: { type: String, default: 'Inter' },

    // Mono / code font family
    monoFont: { type: String, default: 'JetBrains Mono' },

    // Base font size (px)
    baseFontSize: { type: Number, default: 16 },

    // Heading weight: 400 | 600 | 700
    headingWeight: { type: String, default: '700' },

    // Letter spacing (em)
    letterSpacing: { type: Number, default: -0.02 },

    // Line height mode: tight | standard | loose
    lineHeightMode: {
      type: String,
      default: 'standard',
      enum: ['tight', 'standard', 'loose'],
    },

    // Automatically resize for mobile
    adaptiveScaling: { type: Boolean, default: true },

    // Enhance text clarity on LCDs
    subpixelSmoothing: { type: Boolean, default: true },
  },
  { _id: false },
);

module.exports = FontsSchema;
