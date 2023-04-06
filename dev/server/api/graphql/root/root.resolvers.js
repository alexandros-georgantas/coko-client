const { faker } = require('@faker-js/faker')

const getRootData = () =>
  Array.from({ length: 10 }).map(() => faker.lorem.sentences(2))

module.exports = {
  Query: {
    getRootData,
  },
}
