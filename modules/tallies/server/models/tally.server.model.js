'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Tally Schema
 */
var TallySchema = new Schema({
	source: {
		type: String
	},
	supplier: {
		// We will add this as soon as we have suppliers in the DB
		// _id: {
		// 	type: Schema.ObjectId,
		// 	ref: 'Supplier'
		// },
		type: String

	},
	plantation: {
		type: String
	},
	compartment: {
		type: String
	},
	placard: {
		type: Number
	},
	delivery_notes: [{
		type: {
			type: String
		},
		no: {
			type: String
		},
		imageURL: {
			type: String
		}
	}],
	crosscut_no: {
		type: Number
	},
	load: {
		type: {
			type: String
		},
		vehicleType: {
			type: String
		}
	},
	vehicle: {
		// We will add this as soon as DB for this is available
		// _id: {
		// 	type: Schema.ObjectId,
		// 	ref: 'Vehicle'
		// },
		reg_no: {
			type: String
		},
		driver: {
			type: String
		},
		description: {
			type: String
		}
	},
	stock: [{
		sabs: {
			type: String 
		},
		product: {
			type: String
		},
		min: {
			type: Number
		},
		max: {
			type: Number
		},
		length: {
			type: Number
		}
	}],
	received: {
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

mongoose.model('Tally', TallySchema);