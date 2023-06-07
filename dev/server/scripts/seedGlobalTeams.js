/* eslint-disable-next-line import/no-extraneous-dependencies */
const config = require('config')

const { logger } = require('@coko/server')
const Team = require('@coko/server/src/models/team/team.model')

const ids = {
  admin: '4832688f-1a46-4f22-be37-fc29a5ca1e58',
  reviewer: 'c69f15db-3835-4b40-b695-ba22d5ae47b5',
  editor: '7faa1281-d0fe-453b-900a-62e33e4c9b10',
}

const seedGlobalTeams = async () => {
  logger.info('Seeding global teams...')

  if (!config.has('teams.global')) {
    logger.info('No global teams declared in config')
  }

  const configGlobalTeams = config.get('teams.global')

  await Promise.all(
    Object.keys(configGlobalTeams).map(async k => {
      const teamData = configGlobalTeams[k]

      const exists = await Team.findOne({
        global: true,
        role: teamData.role,
      })

      if (exists) {
        logger.info(`Global team "${teamData.role}" already exists`)
        return
      }

      await Team.insert({
        ...teamData,
        global: true,
        id: ids[teamData.role],
      })

      logger.info(`Added global team "${teamData.role}"`)
    }),
  )

  await Team.knex().destroy()
}

seedGlobalTeams()
