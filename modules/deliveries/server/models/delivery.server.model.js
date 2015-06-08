'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Delivery Schema
 */
var DeliverySchema = new Schema({
	supplier: {
		type: {
			type: String
		},
		_id: {
			type: Schema.ObjectId,
			ref: 'Supplier'
		},
		name: {
			type: String,
		},
		plantation: {
			type: String
		},
		compartment: {
			type: String
		},
		placards: [{
			 no: {
			 	type: Number
			}
		}]
	},
	type: {
		type: String,
		trim: true
	},
	vehicle_id: {
		type: Schema.ObjectId,
		ref: 'Vehicle'
	},
	trailor_id: {
		type: Schema.ObjectId,
		ref: 'Vehicle'
	},
	notes: [{
		_id: {
			type: Schema.ObjectId,
			ref: 'Deliverynote'
		}	
	}],
	vehicle: {
		reg_no: {
			type: String,
			trim: true
		},
		driver: {
			type: String
		},
		load: { 
			vol: {
				type: Number,
				default: 0
			},
			products: {
				name: {
					type: String
				},
				vol: {
					type: Number
				},
				size: {
					type: Number
				},
				length: {
					type: Number
				},	
				unit: {
					type: String
				}
			}
		}	
	},
	trailor: {
		exists: {
			type: Boolean,
			default: false
		},
		reg_no: {
			type: String,
			trim: true
		},
		load: { 
			vol: {
				type: Number,
				default: 0
			},
			products: {
				name: {
					type: String
				},
				vol: {
					type: Number
				},
				size: {
					type: Number
				},
				length: {
					type: Number
				},
				unit: {
					type: String
				}
			}
		}	
	},
	trip: {
		start: {
			latitude: {
				type: Number
			},
			longitude: {
				type: Number
			}
		},
		destinations: [{
			latitude: {
				type: Number
			},
			longitude: {
				type: Number
			}
		}],
		distance: {
			type: Number
		}
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


mongoose.model('Delivery', DeliverySchema);


