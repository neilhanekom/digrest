'use strict';

describe('Plantations E2E Tests:', function() {
	describe('Test Plantations page', function() {
		it('Should not include new Plantations', function() {
			browser.get('http://localhost:3000/#!/plantations');
			expect(element.all(by.repeater('plantation in plantations')).count()).toEqual(0);
		});
	});
});
