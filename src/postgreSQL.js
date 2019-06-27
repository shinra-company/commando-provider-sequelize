const Sequelize = require('sequelize')

const POSTGRES = 'postgres'

let _database = null
let _logger = console

class PostgreSQL {
  constructor (url, logger) {
    if (!_database) {
      _database = new Sequelize(url, { logging: false })
    }

    if (logger) {
      _logger = logger
    }

    this.database = _database
    this.logger = _logger
  }

  static get db () {
    return _database
  }

  static get logger () {
    return _logger
  }

  static start () {
    _database.authenticate()
      .then(() => _logger.info('[POSTGRES]: Connection to database has been established successfully.'))
      .then(() => _logger.info('[POSTGRES]: Synchronizing database...'))
      .then(() => _database.sync()
        .then(() => _logger.info('[POSTGRES]: Done Synchronizing database!'))
        .catch(error => _logger.error(`[POSTGRES]: Error synchronizing the database: \n${error}`))
      )
      .catch(error => {
        PostgreSQL.logger.error(`[POSTGRES]: Unable to connect to the database: \n${error}`)
        PostgreSQL.logger.error(`[POSTGRES]: Try reconnecting in 5 seconds...`)
        setTimeout(() => PostgreSQL.start(), 5000)
      })
  }
}

module.exports = PostgreSQL
