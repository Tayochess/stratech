'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('transactions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      fromWalletId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'wallets',
          key: 'id',
        },
        allowNull: true,
      },
      toWalletId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'wallets',
          key: 'id',
        },
        allowNull: false,
      },
      sum: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      transfer: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('transactions');
  },
};
