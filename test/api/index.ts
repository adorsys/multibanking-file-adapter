import routeHandler from './routeHandler'
import InMemoryRepository from '../../src/repositories/InMemoryRepository'
const visualize = require('micro-visualize')

export default visualize(routeHandler(new InMemoryRepository()))
