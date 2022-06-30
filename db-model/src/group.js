const Sequelize = require('sequelize')
const { sq } = require("./db")

const Group = sq.define('groups', {

    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },

    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    telegram_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        unique: true,
    },
})

module.exports = Group;