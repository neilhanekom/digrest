'use strict';

describe('Enumerations E2E Tests:', function() {
	describe('Test Enumerations page', function() {
		it('Should not include new Enumerations', function() {
			browser.get('http://localhost:3000/#!/enumerations');
			expect(element.all(by.repeater('enumeration in enumerations')).count()).toEqual(0);
		});
	});
});
