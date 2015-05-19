'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Compartment Schema
 */
var CompartmentSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Compartment name',
		trim: true
	},
	supplier: {
		type: Schema.ObjectId,
		ref: 'Supplier'
	},
	plantation: {
		type: Schema.ObjectId,
		ref: 'Plantation'
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

mongoose.model('Compartment', CompartmentSchema);