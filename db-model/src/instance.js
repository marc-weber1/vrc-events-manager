const Sequelize = require('sequelize')
const { sq } = require("./db")

const Instance = sq.define('instances', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
    },

    instance_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },

    world_id: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    region: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    owner_vrchat_id: {
        type: Sequelize.STRING,
    },

});

module.exports = Instance;