const mongoose = require('mongoose');

const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: 1000,
    },
    type: {
      type: String,
      enum: ['message', 'task', 'log', 'security'],
      default: 'message',
      index: true,
    },
    time: {
      type: String,
      default: '',
      trim: true,
      maxlength: 80,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'admin',
      default: null,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'admin',
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
