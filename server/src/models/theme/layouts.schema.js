const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Layouts sub-model
 *
 * Mirrors the Theme permission sub-module "Layouts" (nav-icons/window.svg)
 * and the frontend page `admin/src/app/pages/Theme/Layouts/Layouts.jsx`.
 * Holds the page layout type, navigation dimensions and shape styling.
 */
const LayoutsSchema = new Schema(
  {
    icon: { type: String, default: 'nav-icons/window.svg' },

    // Page layout: sideblock | main-layout | horizontal | compact
    themeLayout: {
      type: String,
      default: 'sideblock',
      enum: ['sideblock', 'main-layout', 'horizontal', 'compact'],
    },

    // Sidebar width (px)
    sidebarWidth: { type: Number, default: 280 },

    // Header height (px)
    headerHeight: { type: Number, default: 64 },

    // Corner radius: rounded-none | rounded-sm | rounded-md | rounded-lg | rounded-full
    borderRadius: { type: String, default: 'rounded-lg' },

    // Card styling: bordered | shadow-sm
    cardSkin: { type: String, default: 'bordered', enum: ['bordered', 'shadow-sm'] },
  },
  { _id: false },
);

module.exports = LayoutsSchema;
