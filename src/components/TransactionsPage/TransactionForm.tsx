import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { Transaction, Category } from '../../types';
import {
  selectCategories,
  selectCategoriesLoading,
  selectCategoriesError,
  fetchAllCategories
} from '../../store/slices/categoriesSlice';
import { createTransaction,  fetchTransactions } from '../../store/slices/transactionsSlice.ts';
import { editTransaction } from '../../store/thunks/trackerThunk.ts';

interface TransactionFormProps {
  onClose: () => void;
  initialTransaction?: Transaction | null;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onClose, initialTransaction }) => {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector((state: RootState) => selectCategories(state));
  const categoriesLoading = useSelector((state: RootState) => selectCategoriesLoading(state));
  const categoriesError = useSelector((state: RootState) => selectCategoriesError(state));

  const [type, setType] = useState<'income' | 'expense'>(initialTransaction?.type || 'income');
  const [categoryId, setCategoryId] = useState<string>(initialTransaction?.categoryId || '');
  const [amount, setAmount] = useState<number>(initialTransaction?.amount || 0);

  useEffect(() => {
    if (!categories.length) {
      dispatch(fetchAllCategories());
    }
  }, [dispatch, categories.length]);

  useEffect(() => {
    if (initialTransaction) {
      setType(initialTransaction.type);
      setCategoryId(initialTransaction.categoryId);
      setAmount(initialTransaction.amount);
    }
  }, [initialTransaction]);

  const filteredCategories = categories.filter((category: Category) => category.type === type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryId || amount <= 0) {
      alert("Please fill in all fields correctly!");
      return;
    }

    const transaction: Transaction = {
      amount,
      categoryId,
      createdAt: new Date().toISOString(),
      type,
      id: initialTransaction?.id || '',
    };

    try {
      if (initialTransaction) {
        await dispatch(editTransaction(transaction));
      } else {

        await dispatch(createTransaction(transaction));
      }
      onClose();

      dispatch(fetchTransactions());

      if (!initialTransaction) {
        setAmount(0);
        setCategoryId('');
        setType('income');
      }

    } catch (error) {
      console.error('Error handling transaction:', error);
    }
  };


  const isSaveDisabled = !categoryId || amount <= 0;

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Transaction Type</label>
        <select
          className="form-select"
          value={type}
          onChange={(e) => setType(e.target.value as 'income' | 'expense')}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Category</label>
        {categoriesLoading && <p>Loading categories...</p>}
        {categoriesError && <p style={{ color: 'red' }}>{categoriesError}</p>}

        <select
          className="form-select"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">Select Category</option>
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category: Category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))
          ) : (
            <option value="">No categories available</option>
          )}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Amount (KGS)</label>
        <input
          type="number"
          className="form-control"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          required
        />
      </div>

      <div className="text-end">
        <button
          type="submit"
          className="btn btn-primary me-2"
          disabled={isSaveDisabled}
        >
          Save
        </button>
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
