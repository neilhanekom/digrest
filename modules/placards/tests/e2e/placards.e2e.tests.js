'use strict';

describe('Placards E2E Tests:', function() {
	describe('Test Placards page', function() {
		it('Should not include new Placards', function() {
			browser.get('http://localhost:3000/#!/placards');
			expect(element.all(by.repeater('placard in placards')).count()).toEqual(0);
		});
	});
});
