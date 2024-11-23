export interface Category {
  id: string;
  type: 'income' | 'expense';
  name: string;
  createdAt: string;
}

export interface NewCategory {
  type: 'income' | 'expense';
  name: string;
}


