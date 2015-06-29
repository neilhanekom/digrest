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
		_id: {
			type: Schema.ObjectId,
			ref: 'User'
		},
		name: {
			type: String,
			trim: true
		}
		
	},
	plantation: {
		_id: {
			type: Schema.ObjectId,
			ref: 'User'
		},
		name: {
			type: String,
			trim: true
		}
		
	},
	compartment: {
		{
		_id: {
			type: Schema.ObjectId,
			ref: 'User'
		},
		name: {
			type: String,
			trim: true
		}
		
	},
	placard: {
		{
		_id: {
			type: Schema.ObjectId,
			ref: 'User'
		},
		no: {
			type: Number
		}
		
	},
	felling_date: {
		type: Date
	},
	trees: [
		{ dbh: { type: Number }, length: { type: Number }, dtw: { type: Number, default: 50 }, vol: {type: Number}, sections: [ { product: { type: String }, min: { type: Number }, max: { type: Number }, length: { type: Number }, vol: { type: Number } }] }
	],
	avg_vol: {
		type: Number
	},
	started: {
		type: Date
	},
	total_trees: {
		type: Number
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