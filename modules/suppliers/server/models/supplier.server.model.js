'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Supplier Schema
 */
var SupplierSchema = new Schema({
	name: {
		type: String,
		trim: true
	},
	plantations : [{ type: Schema.Types.ObjectId, ref: 'Plantation' }],
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Supplier', SupplierSchema);