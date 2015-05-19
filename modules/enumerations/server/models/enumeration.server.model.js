'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Enumeration Schema
 */
var EnumerationSchema = new Schema({
	supplier: {
		type: String,
		trim: true
	},
	plantation: {
		type: String,
		trim: true
	},
	compartment: {
		type: String,
		trim: true
	},
	placard_number: {
		type: Number
	},
	felling_date: {
		type: Date
	},
	trees: [
		{ dbh: { type: Number }, length: { type: Number }, dtw: { type: Number, default: 50 }, sections: [ { product: { type: String }, min: { type: Number }, max: { type: Number }, length: { type: Number } }] }
	],
	started: {
		type: Date
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

mongoose.model('Enumeration', EnumerationSchema);