const { DataTypes } = require('sequelize');
const db = require('../config/database');

const QuestionTemplate = db.sequelize.define('QuestionTemplate', {
  TemplateID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  TemplateCategory: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  TemplateText: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  SurveyTypeID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'SurveyType',
      key: 'SurveyTypeID'
    }
  },
  CreatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  CreatedBy: {
    type: DataTypes.INTEGER,
    references: {
      model: 'User',
      key: 'UserID'
    }
  },
  UpdatedAt: {
    type: DataTypes.DATE
  },
  UpdatedBy: {
    type: DataTypes.INTEGER,
    references: {
      model: 'User',
      key: 'UserID'
    }
  }
}, {
  tableName: 'QuestionTemplates',
  timestamps: false
});

module.exports = QuestionTemplate;
