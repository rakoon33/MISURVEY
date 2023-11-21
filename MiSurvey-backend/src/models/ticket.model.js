const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Ticket = db.sequelize.define('Ticket', {
    TicketID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    TicketStatus: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            isIn: [['Open', 'Closed']]
        }
    },
    CreatedBy: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    CreatedAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    UpdatedAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    SurveyID: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Survey',
            key: 'SurveyID'
        },
        allowNull: true
    },
    ResponseID: {
        type: DataTypes.INTEGER,
        references: {
            model: 'SurveyResponse',
            key: 'ResponseID'
        },
        allowNull: true
    }
}, {
    tableName: 'Tickets',
    timestamps: false
});

module.exports = Ticket;
