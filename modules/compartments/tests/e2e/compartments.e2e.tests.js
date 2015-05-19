'use strict';

describe('Compartments E2E Tests:', function() {
	describe('Test Compartments page', function() {
		it('Should not include new Compartments', function() {
			browser.get('http://localhost:3000/#!/compartments');
			expect(element.all(by.repeater('compartment in compartments')).count()).toEqual(0);
		});
	});
});
