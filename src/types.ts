export interface Category {
  id: string;
  type: 'income' | 'expense';
  name: string;
}

export interface NewCategory {
  type: 'income' | 'expense';
  name: string;
}

export interface Transaction {
  id: string;
  amount: number;
  createdAt: string;
  categoryId: string;
  type: 'income' | 'expense';
}

