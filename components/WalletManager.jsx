import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';
import TransactionsList from '../components/TransactionsList';

const WalletManager = ({ wallet, session, onClose, onUpdate }) => {
    const [showTopUp, setShowTopUp] = useState(false);
    const [showTransfer, setShowTransfer] = useState(false);
    const [showTransactions, setShowTransactions] = useState(false);
    const [amount, setAmount] = useState('');
    const [transferSize, setTransferSize] = useState('');
    const [recipient, setRecipient] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleTopUp = async () => {
        if (!amount) return;
        try {
            const res = await fetch('/api/commit-transaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.accessToken}`,
                },
                body: JSON.stringify({
                    fromWalletId: null,
                    toWalletId: wallet.id,
                    sum: parseFloat(amount),
                    transfer: false,
                }),
            });
            if (res.ok) {
                setSuccess('Wallet topped up successfully');
                const data = await res.json();
                wallet.balance = wallet.balance + data.sum;
                setTimeout(() => {
                    setSuccess('');
                    setShowTopUp(false);
                    onUpdate();
                }, 5000);
            } else {
                const errorData = await res.json();
                setError('Failed to top up wallet');
            }
        } catch (error) {
            setError('Failed to top up wallet');
        }
    };

    const handleSearchUsers = async (email) => {
        try {
            const res = await fetch(`/api/search-users?currency=${wallet.currency}&email=${email}`, {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                },
            });
            if (res.ok) {
                const data = await res.json();
                setSearchResults(data);
            } else {
                const errorData = await res.json();
                setError('Failed to search users');
            }
        } catch (error) {
            setError('Failed to search users');
        }
    };

    const debouncedSearch = useCallback(
        debounce((email) => handleSearchUsers(email), 500),
        []
    );

    useEffect(() => {
        if (recipient) {
            debouncedSearch(recipient);
        }
    }, [recipient, debouncedSearch]);

    const handleTransfer = async (toWalletId) => {
        if (!transferSize) return;
        try {
            const res = await fetch('/api/commit-transaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.accessToken}`,
                },
                body: JSON.stringify({
                    fromWalletId: wallet.id,
                    toWalletId,
                    sum: parseFloat(transferSize),
                    transfer: true,
                }),
            });
            if (res.ok) {
                setSuccess('Transfer successful');
                const data = await res.json();
                wallet.balance = wallet.balance - data.sum;
                setTimeout(() => {
                    setSuccess('');
                    setShowTransfer(false);
                    onUpdate();
                }, 5000);
            } else {
                const errorData = await res.json();
                setError('Failed to transfer funds');
            }
        } catch (error) {
            setError('Failed to transfer funds');
        }
    };

    const openTopUp = () => {
        setShowTopUp(!showTopUp);
        setShowTransfer(false);
    };

    const openTransfer = () => {
        setShowTransfer(!showTransfer);
        setShowTopUp(false);
    };

    return (
        <div className="modal">
            <div className='modal__header'>
                <h2 className='subtitle modal__title'>{wallet.currency} Wallet</h2>
                <button className='button round' onClick={onClose} aria-label='Back'>x</button>
            </div>

            <div className='wrapper'>
                <div className='wallet'>
                    <div className='wallet__currency'>Balance</div>
                    <div className='wallet__balance'>{wallet.balance}</div>
                </div>
            </div>
            <div className='wrapper'>
                <div className='row'>
                    <button className='row__item button' onClick={openTopUp}>Top Up</button>
                    <button className='row__item button' onClick={openTransfer}>Transfer</button>
                    <button className='row__item button' onClick={() => setShowTransactions(true)}>Transactions</button>
                </div>
            </div>

            {showTopUp && (
                <div className='wrapper'>
                    <div className='form'>
                        <input
                            className='input'
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Amount"
                        />
                        <button className='button' onClick={handleTopUp}>Submit</button>
                    </div>
                </div>
            )}

            {showTransfer && (
                <div className='wrapper'>
                    <div className='form'>
                        <input
                            className='input'
                            type="number"
                            value={transferSize}
                            onChange={(e) => setTransferSize(e.target.value)}
                            placeholder="Amount"
                        />
                        <input
                            className='input'
                            type="text"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            placeholder="Recipient Email"
                        />
                        <ul className='list'>
                            {searchResults.map((user) => (
                                <li className='list__item user' key={user.id}>
                                    <span>{user.email}</span>
                                    <button className='button' onClick={() => handleTransfer(user.walletId)}>Send</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {showTransactions && (
                <TransactionsList session={session} walletId={wallet.id} onClose={() => setShowTransactions(false)} />
            )}

            {error && <div className='message error'>{error}</div>}
            {success && <div className='message success'>{success}</div>}
        </div>
    );
};

export default WalletManager;
