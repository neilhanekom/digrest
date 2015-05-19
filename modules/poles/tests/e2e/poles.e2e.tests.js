'use strict';

describe('Poles E2E Tests:', function() {
	describe('Test Poles page', function() {
		it('Should not include new Poles', function() {
			browser.get('http://localhost:3000/#!/poles');
			expect(element.all(by.repeater('pole in poles')).count()).toEqual(0);
		});
	});
});
