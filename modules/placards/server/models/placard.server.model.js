'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Placard Schema
 */
var PlacardSchema = new Schema({
	no: {
		type: Number,
		default: 1
	},
	supplier: {
		type: Schema.ObjectId,
		ref: 'Supplier'
	},
	plantation: {
		type: Schema.ObjectId,
		ref: 'Plantation'
	},
	compartment: {
		type: Schema.ObjectId,
		ref: 'Compartment'
	},
	trees: {
		type: Number,
		default: 0
	},
	enumeration: {
		type: Schema.ObjectId,
		ref: 'Enumeration'
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

mongoose.model('Placard', PlacardSchema);