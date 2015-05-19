'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Pole Schema
 */
var PoleSchema = new Schema({
	product: {
		type: String,
		default: '',
		required: 'Please fill Pole name',
		trim: true
	},
	sizes: [
		{ min: { type: Number}, max: { type: Number} }
	],
	lengths: [

	],
	unit: {
		type: String,
		default: 'mm'
	},	
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Pole', PoleSchema);