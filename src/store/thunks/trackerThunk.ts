import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axiosAPI';
import { Category, NewCategory } from '../../types';

export const fetchAllCategories = createAsyncThunk<Category[], void>(
  'categories/fetchAllCategories',  // action type
  async (_arg, thunkAPI) => {
    try {
      const response: { data: Record<string, Category> | null } = await axiosApi.get('/categories.json');
      const categoriesList = response.data;

      console.log("Fetched categories:", categoriesList);

      if (categoriesList === null) {
        return [];
      }
      const categories = Object.keys(categoriesList).map((key) => {
        return {
          ...categoriesList[key],
          id: key
        };
      });

      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return thunkAPI.rejectWithValue('Failed to fetch categories');
    }
  }
);

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
