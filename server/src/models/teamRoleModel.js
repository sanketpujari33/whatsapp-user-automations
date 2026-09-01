const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema(
  {
    view: { type: Boolean, default: false },
    create: { type: Boolean, default: false },
    edit: { type: Boolean, default: false },
    delete: { type: Boolean, default: false },
  },
  { _id: false },
);

const subModuleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    path: { type: String, trim: true, default: '' },
    id: { type: String, trim: true, default: '' },
    icon: { type: String, trim: true, default: '' },
    sidebar: { type: Boolean, default: true },
    access: { type: Boolean, default: false },
    actions: { type: actionSchema, default: () => ({}) },
  },
  { _id: false },
);

const moduleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    path: { type: String, trim: true, default: '' },
    id: { type: String, trim: true, default: '' },
    icon: { type: String, trim: true, default: '' },
    sidebar: { type: Boolean, default: true },
    access: { type: Boolean, default: false },
    actions: { type: actionSchema, default: () => ({}) },
    subModules: { type: [subModuleSchema], default: [] },
  },
  { _id: false },
);

const teamRoleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    modules: { type: [moduleSchema], default: [] },
    is_active: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'admin', default: null },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'admin', default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

teamRoleSchema.index({ name: 1 }, { unique: true, partialFilterExpression: { is_deleted: false } });
teamRoleSchema.index({ is_active: 1, is_deleted: 1 });

module.exports = mongoose.model('teamRole', teamRoleSchema);
