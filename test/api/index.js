const InMemoryRepository = require('../../dist/lib/repositories/InMemoryRepository').default
const routeHandler = require('./routeHandler')
const visualize = require('micro-visualize')

module.exports = visualize(routeHandler(new InMemoryRepository()))
