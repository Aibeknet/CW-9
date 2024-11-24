import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axiosAPI';
import { Category } from '../../types';

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,
};


export const fetchAllCategories = createAsyncThunk<Category[]>(
  'categories/fetchAllCategories',
  async () => {
    const response = await axiosApi.get('categories.json');

    const categories = response.data;

    return Object.keys(categories).map(key => ({
      id: key,
      ...categories[key],
    }));
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAllCategories.pending, state => {
        state.loading = true;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load categories';
      });
  },
});

export const selectCategories = (state: { categories: CategoriesState }) => state.categories.categories;
export const selectCategoriesLoading = (state: { categories: CategoriesState }) => state.categories.loading;
export const selectCategoriesError = (state: { categories: CategoriesState }) => state.categories.error;

export default categoriesSlice.reducer;



