const { Before, After, AfterAll } = require('cucumber')

const {
  factory,
} = require('./helpers')

Before(function () {
  this.factory = factory
})
