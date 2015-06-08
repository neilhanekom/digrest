'use strict';

describe('Tallies E2E Tests:', function() {
	describe('Test Tallies page', function() {
		it('Should not include new Tallies', function() {
			browser.get('http://localhost:3000/#!/tallies');
			expect(element.all(by.repeater('tally in tallies')).count()).toEqual(0);
		});
	});
});
