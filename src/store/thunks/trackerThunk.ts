import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axiosAPI';
import { Category, NewCategory, Transaction } from '../../types';

export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
  const response = await axiosApi.get('/categories.json');
  return response.data;
});

export const deleteOneCategory = createAsyncThunk<void, string>(
  'categories/deleteOneCategory',
  async (categoryId: string) => {
    await axiosApi.delete(`/categories/${categoryId}.json`);
  }
);


export const createCategory = createAsyncThunk<void, NewCategory>(
  'categories/createCategory',
  async (newCategory: NewCategory) => {
    await axiosApi.post('categories.json', newCategory); // POST запрос на сервер для создания категории
  }
);

export const getOneCategoryById = createAsyncThunk<Category | null, string>(
  'categories/getOneCategoryById',
  async (categoryId: string) => {
    const response = await axiosApi<Category | null>(`/categories/${categoryId}.json`);
    return response.data || null;
  }
);

export const editCategory = createAsyncThunk(
  'categories/editCategory',
  async (category: Category) => {
    const response = await axiosApi.put(`/categories/${category.id}.json`, { ...category });
    return response.data;
  }
);

// Получение всех транзакций
export const fetchTransactions = createAsyncThunk<Transaction[]>(
  'transactions/fetchTransactions',
  async (_, thunkAPI) => {
    try {
      const response = await axiosApi.get('/transactions.json');
      const transactionsList = response.data;

      if (!transactionsList) return [];

      const transactions = Object.keys(transactionsList).map((key) => ({
        id: key,
        ...transactionsList[key],
      }));

      return transactions;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return thunkAPI.rejectWithValue('Failed to fetch transactions');
    }
  }
);

// Добавление транзакции
export const createTransaction = createAsyncThunk<void, Transaction>(
  'transactions/createTransaction',
  async (transaction, thunkAPI) => {
    try {
      await axiosApi.post('/transactions.json', transaction);
    } catch (error) {
      console.error('Error creating transaction:', error);
      return thunkAPI.rejectWithValue('Failed to create transaction');
    }
  }
);

// Удаление транзакции
export const deleteTransaction = createAsyncThunk<void, string>(
  'transactions/deleteTransaction',
  async (transactionId, thunkAPI) => {
    try {
      await axiosApi.delete(`/transactions/${transactionId}.json`);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      return thunkAPI.rejectWithValue('Failed to delete transaction');
    }
  }
);

// Экшен для редактирования транзакции
export const editTransaction = createAsyncThunk(
  'transactions/editTransaction',
  async (updatedTransaction: Transaction, { rejectWithValue }) => {
    try {
      // Например, обновляем данные транзакции в Firebase
      const response = await axiosApi.put(`/transactions/${updatedTransaction.id}.json`, updatedTransaction);
      return response.data;
    } catch {
      return rejectWithValue('Failed to update transaction');
    }
  }
);

