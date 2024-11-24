import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axiosAPI';
import { Transaction } from '../../types';

// export const editTransaction = createAsyncThunk(
//   'transactions/editTransaction',
//   async (updatedTransaction: Transaction, { rejectWithValue }) => {
//     try {
//       const response = await axiosApi.put(`/transactions/${updatedTransaction.id}.json`, updatedTransaction);
//       return response.data;
//     } catch {
//       return rejectWithValue('Failed to update transaction');
//     }
//   }
// );

// Создание асинхронного экшн-креатора для редактирования транзакции
export const editTransaction = createAsyncThunk(
  'transactions/editTransaction', // Имя экшена
  async (updatedTransaction: Transaction, { rejectWithValue }) => {
    try {
      // Отправляем PUT-запрос на сервер для обновления транзакции
      const response = await axiosApi.put(`/transactions/${updatedTransaction.id}.json`, updatedTransaction);

      // Возвращаем данные, если запрос успешен
      return response.data;
    } catch {
      // Если произошла ошибка, возвращаем ошибку с сообщением
      return rejectWithValue('Failed to update transaction');
    }
  }
);