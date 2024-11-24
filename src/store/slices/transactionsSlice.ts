import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axiosAPI';
import { Transaction } from '../../types';
import { editTransaction } from '../thunks/trackerThunk.ts';

interface TransactionsState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  transactions: [],
  loading: false,
  error: null,
};

export const fetchTransactions = createAsyncThunk<Transaction[]>(
  '/fetchTransactions',
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

export const createTransaction = createAsyncThunk<Transaction, Transaction>(
  'transactions/createTransaction',
  async (transaction, thunkAPI) => {
    try {
      const response = await axiosApi.post('/transactions.json', transaction);
      console.log("Firebase response:", response);

      const newTransaction = {
        ...transaction,
        id: response.data.name,
      };

      return newTransaction;
    } catch (error) {
      console.error('Error creating transaction:', error);
      return thunkAPI.rejectWithValue('Failed to create transaction');
    }
  }
);


// export const editTransaction = createAsyncThunk<Transaction, Transaction>(
//   'transactions/editTransaction',
//   async (transaction, thunkAPI) => {
//     try {
//       await axiosApi.put(`/transactions/${transaction.id}.json`, transaction);
//       return transaction;
//     } catch (error) {
//       console.error('Error editing transaction:', error);
//       return thunkAPI.rejectWithValue('Failed to edit transaction');
//     }
//   }
// );

export const deleteTransaction = createAsyncThunk<string, string>(
  'transactions/deleteTransaction',
  async (transactionId, thunkAPI) => {
    try {
      await axiosApi.delete(`/transactions/${transactionId}.json`);
      return transactionId;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      return thunkAPI.rejectWithValue('Failed to delete transaction');
    }
  }
);

export const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createTransaction.fulfilled, (state, action) => {
        state.transactions.push(action.payload);
      })

      .addCase(editTransaction.fulfilled, (state, action) => {
        const index = state.transactions.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })

      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter((t) => t.id !== action.payload);
      });
  },
});

export default transactionsSlice.reducer;
