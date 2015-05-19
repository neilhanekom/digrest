'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Employee Schema
 */
var EmployeeSchema = new Schema({
	firstName: {
		type: String,
		default: '',
		required: 'Please fill Employee name',
		trim: true
	},
	lastName: {
		type: String
	},
	gender: {
		type: String
	},
	title: {
		type: String
	},
	rsaId: {
		type: String
	},
	mobile: {
		type: String
	},
	email: {
		type: String
	},
	role: {
		type: String
	},
	team: {
		type: String
	},
	profileImageURL: {
		type: String,
		default: 'modules/users/img/profile/default.png'
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

mongoose.model('Employee', EmployeeSchema);