'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Plantation Schema
 */
var PlantationSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Plantation name',
		trim: true
	},
	supplier: {
		type: Schema.ObjectId,
		ref: 'Supplier'
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

mongoose.model('Plantation', PlantationSchema);