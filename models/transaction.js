const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/db');
const Wallet = require('./wallet');

const Transaction = sequelize.define('Transaction', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    fromWalletId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Wallet,
            key: 'id',
        },
    },
    toWalletId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Wallet,
            key: 'id',
        },
    },
    sum: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    transfer: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    tableName: 'transactions',
    timestamps: false,
});

module.exports = Transaction;
