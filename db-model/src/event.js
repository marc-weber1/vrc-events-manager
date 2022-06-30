const Sequelize = require('sequelize')
const { sq } = require("./db")

const Event = sq.define('events', {

    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    description: {
        type: Sequelize.STRING,
        allowNull: true,
    },

    creator: {
        type: Sequelize.UUID,
        allowNull: false,
    },

    start_date: {
        type: Sequelize.DATE,
        allowNull: false,
    },

    end_date: {
        type: Sequelize.DATE,
        allowNull: true,
    },

    entry_link: {
        type: Sequelize.STRING,
        allowNull: true,
    },

    group: {
        type: Sequelize.UUID,
        allowNull: true,
    },

    public: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },

    over_18: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },


})


module.exports = Event;