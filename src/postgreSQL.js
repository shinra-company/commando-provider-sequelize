const Sequelize = require('sequelize')

class Database {
  constructor (url, logger = console) {
    this.logger = console
    this.client = new Sequelize(DATBASE_URL, { logging: false })
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
        setTimeout(() => Database.start(), 5000)
      })
  }
}

module.exports = Database
