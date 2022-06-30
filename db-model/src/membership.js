const Sequelize = require('sequelize')
const { sq } = require("./db")

const Membership = sq.define('memberships', {

    group_id: {
        type: Sequelize.UUID,
        allowNull: false,
    },

    user_id: {
        type: Sequelize.UUID,
        allowNull: false,
    },

})

module.exports = Membership;