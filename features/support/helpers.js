const faker = require('faker')

const person = {
  name: faker.name.firstName() + ' ' + faker.name.lastName(),
  email: faker.internet.email(),
  phone: faker.phone.phoneNumber(),
  message: faker.random.words()
}

const factory = {
  anonymousUser: () => ({
    id: null,
    profile: { ... person },
  })
}

module.exports = { factory }
