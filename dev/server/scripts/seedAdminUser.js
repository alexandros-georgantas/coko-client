const { logger, useTransaction } = require('@coko/server')

const User = require('@coko/server/src/models/user/user.model')
const Identity = require('@coko/server/src/models/identity/identity.model')

const info = msg => {
  const prefix = `--- Seed scripts =>`
  logger.info(`${prefix} ${msg}`)
}

const seedAdminUser = async () => {
  try {
    info('Seeding admin user...')

    const data = {
      username: 'admin',
      email: 'admin@example.com',
      password: 'password',
      givenNames: 'Admin',
      surname: 'Adminius',
      agreedTc: true,
    }

    const exists = await User.findOne({
      username: data.username,
    })

    if (exists) {
      info('Admin user already exists')
      await User.knex().destroy()
    }

    const { email, ...restData } = data

    await useTransaction(async tr => {
      const newUser = await User.insert(
        {
          ...restData,
        },
        { trx: tr },
      )

      await Identity.insert(
        {
          userId: newUser.id,
          email,
          isSocial: false,
          isVerified: true,
          isDefault: true,
        },
        { trx: tr },
      )

      info(`Admin user with id ${newUser.id} successfully created`)
    })

    await User.knex().destroy()
  } catch (e) {
    throw new Error(e)
  }
}

seedAdminUser()
