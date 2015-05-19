'use strict';

describe('Suppliers E2E Tests:', function() {
	describe('Test Suppliers page', function() {
		it('Should not include new Suppliers', function() {
			browser.get('http://localhost:3000/#!/suppliers');
			expect(element.all(by.repeater('supplier in suppliers')).count()).toEqual(0);
		});
	});
});
