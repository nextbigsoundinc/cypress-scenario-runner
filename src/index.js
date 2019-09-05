const debug = require('debug')
const get = require('lodash.get')
const { given } = require('cypress-cucumber-preprocessor/steps')
const faker = require('faker')
const defaultOptions = require('./defaults/config')
const cosmiconfig = require('cosmiconfig')
const customOptions = get(cosmiconfig('cypress-scenario-runner').searchSync(), 'config', {})

function addSteps({ steps: customSteps = {}, routes = {}, options: customOptionOverrides = {} } = {}) {
	const defaultSteps = require('./steps')
	const steps = Object.assign({}, defaultSteps, customSteps)
	const options = Object.assign({}, defaultOptions, customOptions, customOptionOverrides)
	const normalizeStep = step => step.replace(/\{(route|element)\}/g, '{string}')

	const log = debug('cypress-scenario-runner:addSteps')
	log('steps', JSON.stringify(steps))
	log('routes', JSON.stringify(routes))
	log('options', JSON.stringify(options))

	for (const [step, fn] of Object.entries(steps)) {
		given(normalizeStep(step), function() {
			if (options.defaultCommandWait) {
				cy.wait(options.defaultCommandWait)
			}
			return fn.call(this, ...arguments, { steps, routes, options })
		})
	}
}

function addCommands(customOptionOverrides) {
	const options = Object.assign({}, defaultOptions, customOptions, customOptionOverrides)

	const log = debug('cypress-scenario-runner:addCommands')
	log('options', JSON.stringify(options))

	Cypress.Commands.add('getElement', element => getElement(element, options))
	Cypress.Commands.add('getInputElement', element => getInputElement(element, options))
	Cypress.Commands.add('setInputElement', (element, value) => setInputElement(element, value, options))
}

function getElement(element, options) {
	return cy.get(`[${options.elementAttr}="${element}"]`)
}

function getInputElement(element, options) {
	return cy.get(`[${options.elementAttr}="${element}"]:input, [${options.elementAttr}="${element}"] :input`)
}

function setInputElement(element, value, options) {
	const randomValueRegex = /<random ([^>]+)>/g

	if (randomValueRegex.test(value)) {
		value = value.replace(randomValueRegex, (match, type) => getRandomValue(type))
	}

	cy.getInputElement(element).then($element => {
		const elementOptions = getElementOptions($element, options)

		if ($element.is(':checkbox') || $element.is(':radio')) {
			if (value === 'checked') {
				cy.wrap($element).check(elementOptions)
			} else if (value === 'unchecked') {
				cy.wrap($element).uncheck(elementOptions)
			} else {
				// Select by value
				const selectors = value
					.split(',')
					.map(val => val.trim())
					.map(val => `[${options.elementValueAttr}="${val}"], [value="${val}"]`)

				cy.wrap($element)
					.filter(selectors.join(', '))
					.check(elementOptions)
			}
		} else if ($element.is('select')) {
			const values = value.split(',').map(s => s.trim())
			cy.wrap($element).select(values, elementOptions)
		} else {
			cy.wrap($element)
				.clear(elementOptions)
				.type(value, elementOptions)
		}
	})
}

function getElementOptions($element, options) {
	var opts
	return Object.assign(
		{},
		options.elementOptions,
		$element.attr(options.elementOptionsAttr) ? eval(`opts = ${$element.attr(options.elementOptionsAttr)}`) : {}
	)
}

function getRandomValue(type) {
	if (type === 'first name') {
		return faker.name.firstName()
	} else if (type === 'last name') {
		return faker.name.lastName()
	} else if (type === 'full name') {
		return faker.name.findName()
	} else if (type === 'phone') {
		return faker.phone.phoneNumberFormat()
	} else if (type === 'email') {
		return faker.internet.email()
	} else if (type === 'password') {
		return faker.internet.password()
	} else if (type === 'street address') {
		return faker.address.streetAddress()
	} else if (type === 'city') {
		return faker.address.city()
	} else if (type === 'state') {
		return faker.address.state()
	} else if (type === 'zip') {
		return faker.address.zipCode('#####')
	} else if (type === 'number') {
		return faker.random.number()
	} else if (type === 'dollar value') {
		return faker.finance.amount()
	} else {
		return faker.random.word()
	}
}

module.exports = { addSteps, addCommands, getElementOptions }
