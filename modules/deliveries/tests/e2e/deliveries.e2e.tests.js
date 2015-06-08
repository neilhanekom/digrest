'use strict';

describe('Deliveries E2E Tests:', function() {
	describe('Test Deliveries page', function() {
		it('Should not include new Deliveries', function() {
			browser.get('http://localhost:3000/#!/deliveries');
			expect(element.all(by.repeater('delivery in deliveries')).count()).toEqual(0);
		});
	});
});
