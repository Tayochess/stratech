const bcrypt = require('bcryptjs');
const sequelize = require('../utils/db');
const User = require('./user');
const Wallet = require('./wallet');
const Transaction = require('./transaction');

User.hasMany(Wallet, { foreignKey: 'userId', as: 'wallets' });
Wallet.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Wallet.hasMany(Transaction, { foreignKey: 'fromWalletId', as: 'outgoingTransactions' });
Wallet.hasMany(Transaction, { foreignKey: 'toWalletId', as: 'incomingTransactions' });
Transaction.belongsTo(Wallet, { foreignKey: 'fromWalletId', as: 'fromWallet' });
Transaction.belongsTo(Wallet, { foreignKey: 'toWalletId', as: 'toWallet' });

User.addHook('beforeCreate', async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
});

Wallet.addHook('beforeCreate', async (wallet) => {
    const existingWallet = await Wallet.findOne({
        where: {
            userId: wallet.userId,
            currency: wallet.currency,
        },
    });
    if (existingWallet) {
        throw new Error('User already has a wallet for this currency');
    }
});

Transaction.addHook('beforeCreate', async (transaction) => {
    if (transaction.transfer && transaction.fromWalletId) {
        const fromWallet = await Wallet.findByPk(transaction.fromWalletId);
        if (fromWallet.balance < transaction.sum) {
            throw new Error('Insufficient balance for transfer');
        }
    }
});

module.exports = {
    sequelize,
    User,
    Wallet,
    Transaction,
};
