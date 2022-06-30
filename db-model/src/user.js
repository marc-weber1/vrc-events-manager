const Sequelize = require('sequelize')
const { sq } = require("./db")

const User = sq.define('users', {

    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },

    telegram_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        unique: true,
    },

    discord_id: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
    },

    vrchat_id: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
    },

    over_18: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    
})

module.exports = User;