import React, { useState, useEffect } from 'react';

interface CategoryFormProps {
  onSave: (category: { name: string; type: 'income' | 'expense' }) => void;
  onClose: () => void;
  initialCategory: { name: string; type: 'income' | 'expense' } | null;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ onSave, onClose, initialCategory }) => {
  const [categoryName, setCategoryName] = useState('');
  const [categoryType, setCategoryType] = useState<'income' | 'expense'>('income');

  useEffect(() => {
    if (initialCategory) {
      setCategoryName(initialCategory.name);
      setCategoryType(initialCategory.type);
    }
  }, [initialCategory]);

  const handleSave = () => {
    const category = { name: categoryName, type: categoryType };
    onSave(category);
  };

  return (
    <div>
      <div className="mb-3">
        <label htmlFor="categoryName" className="form-label">Category Name</label>
        <input
          type="text"
          id="categoryName"
          className="form-control"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Enter Category Name"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="categoryType" className="form-label">Category Type</label>
        <select
          id="categoryType"
          className="form-select"
          value={categoryType}
          onChange={(e) => setCategoryType(e.target.value as 'income' | 'expense')}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>
      <div className="d-flex justify-content-between">
        <button className="btn btn-secondary" onClick={onClose}>Close</button>
        <button className="btn btn-primary" onClick={handleSave}>Save Category</button>
      </div>
    </div>
  );
};

export default CategoryForm;
