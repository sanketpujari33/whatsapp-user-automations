const mongoose = require('mongoose');

const { Schema } = mongoose;

const themeSchema = new Schema(
	{
		adminId: {
			type: Schema.Types.ObjectId,
			ref: 'admin',
			required: true,
			unique: true,
			index: true,
		},
		settings: {
			type: Schema.Types.Mixed,
			default: {},
		},
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

themeSchema.index({ updatedAt: -1 });

module.exports = mongoose.model('Theme', themeSchema);
