'use strict';

describe('Employees E2E Tests:', function() {
	describe('Test Employees page', function() {
		it('Should not include new Employees', function() {
			browser.get('http://localhost:3000/#!/employees');
			expect(element.all(by.repeater('employee in employees')).count()).toEqual(0);
		});
	});
});
