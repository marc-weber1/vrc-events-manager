const Sequelize = require('sequelize')
const { sq } = require("./db")

const Subscription = sq.define('subscriptions', {

    event_id: { // lol this doesn't exist yet
        type: Sequelize.INTEGER,
        allowNull: false,
    },

    telegram_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
    },

})

module.exports = Subscription;