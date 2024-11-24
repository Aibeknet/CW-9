import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store';
import { Transaction } from '../../types';
import Modal from '../UI/Modal/Modal';
import { deleteTransaction, fetchTransactions } from '../../store/slices/transactionsSlice.ts';
import axiosApi from '../../axiosAPI.ts';
import TransactionForm from './TransactionForm.tsx';

const TransactionsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { transactions, loading } = useSelector((state: RootState) => state.transactions);
  const categories = useSelector((state: RootState) => state.categories.categories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const openModal = (transaction: Transaction | null = null) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this transaction?');
    if (confirmed) {
      await axiosApi.delete(`/transactions/${transactionId}.json`);
      dispatch(deleteTransaction(transactionId));
    }
  };

  return (
    <div className="container mt-5">
      {loading && <div className="text-center">Loading...</div>}

      <ul className="list-group">
        {transactions.map((transaction) => {
          const category = categories.find((category) => category.id === transaction.categoryId);
          return (
            <li key={transaction.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <p className="mb-1"><strong>Date:</strong> {transaction.createdAt}</p>
                <p className="mb-1"><strong>Category:</strong> {category ? category.name : 'Category not found'}</p>
                <p className="mb-1"><strong>Amount:</strong> {transaction.amount} KGS</p>
              </div>
              <div>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => openModal(transaction)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteTransaction(transaction.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {isModalOpen && (
        <Modal
          onClose={closeModal}
          show={isModalOpen}
          title={selectedTransaction ? 'Edit Transaction' : 'Add New Transaction'}
        >
          <TransactionForm
            onClose={closeModal}
            initialTransaction={selectedTransaction}
          />
        </Modal>
      )}
    </div>
  );
};

export default TransactionsPage;

