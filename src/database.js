const Sequelize = require('sequelize')

const { DB } = process.env
const database = new Sequelize(DB, { logging: false })

class Postgres {
  constructor (logger = console) {
    this.logger = console
  }

  static get db () {
    return database
  }

  static start () {
    database.authenticate()
      .then(() => this.logger.info('[POSTGRES]: Connection to database has been established successfully.'))
      .then(() => this.logger.info('[POSTGRES]: Synchronizing database...'))
      .then(() => database.sync()
        .then(() => this.logger.info('[POSTGRES]: Done Synchronizing database!'))
        .catch(error => this.logger.error(`[POSTGRES]: Error synchronizing the database: \n${error}`))
      )
      .catch(error => {
        this.logger.error(`[POSTGRES]: Unable to connect to the database: \n${error}`)
        this.logger.error(`[POSTGRES]: Try reconnecting in 5 seconds...`)
        setTimeout(() => Postgres.start(), 5000)
      })
  }
}

module.exports = Postgres
