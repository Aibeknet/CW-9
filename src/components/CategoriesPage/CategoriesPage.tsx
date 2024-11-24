import React, { useState, useEffect } from 'react';
import CategoryForm from './CategoryForm';
import Modal from '../UI/Modal/Modal.tsx';
import axiosApi from '../../axiosAPI';
import { Category } from '../../types.ts';

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosApi.get('/categories.json');
        const categoriesList = response.data;
        if (categoriesList) {
          const categoriesArray = Object.keys(categoriesList).map((key) => ({
            id: key,
            name: categoriesList[key].name,
            type: categoriesList[key].type,
          }));
          setCategories(categoriesArray);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSaveCategory = async (newCategory: { name: string; type: 'income' | 'expense' }) => {
    if (isEditing && currentCategory) {
      await axiosApi.put(`/categories/${currentCategory.id}.json`, newCategory);
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === currentCategory.id
            ? { ...category, ...newCategory }
            : category
        )
      );
    } else {
      const response = await axiosApi.post('/categories.json', newCategory);
      const newCategoryWithId = { ...newCategory, id: response.data.name };
      setCategories((prevCategories) => [...prevCategories, newCategoryWithId]);
    }
    closeModal();
  };

  const handleEditCategory = (category: Category) => {
    setCurrentCategory(category);
    setIsEditing(true);
    openModal();
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this category?');
    if (confirmed) {
      await axiosApi.delete(`/categories/${categoryId}.json`);
      setCategories((prevCategories) => prevCategories.filter((category) => category.id !== categoryId));
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between">
        <h3>Categories</h3>
        <button
          className="btn btn-primary mb-3"
          onClick={() => {
            setIsEditing(false);
            openModal();
          }}
        >
          Add New Category
        </button>
      </div>

      <ul className="list-group mt-3">
        {categories.length > 0 ? (
          categories.map((category) => (
            <li key={category.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <h5>{category.name}</h5>
                <p>{category.type === 'income' ? 'Income' : 'Expense'}</p>
              </div>
              <div>
                <button
                  className="btn btn-warning me-2"
                  onClick={() => handleEditCategory(category)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <li className="list-group-item">No categories yet</li>
        )}
      </ul>

      <Modal show={isModalOpen} title={isEditing ? 'Edit Category' : 'Add New Category'} onClose={closeModal}>
        <CategoryForm
          onSave={handleSaveCategory}
          onClose={closeModal}
          initialCategory={currentCategory}
        />
      </Modal>
    </div>
  );
};

export default CategoriesPage;

