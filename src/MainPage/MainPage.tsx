import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import TransactionsPage from '../components/TransactionsPage/TransactionsPage.tsx';

const HomePage: React.FC = () => {
  const transactions = useSelector((state: RootState) => state.transactions.transactions);
  console.log(transactions);

  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [isEmpty, setIsEmpty] = useState<boolean>(transactions.length === 0);

  useEffect(() => {
    const total = transactions.reduce((acc, transaction) => {
      if (transaction.type === 'income') {
        return acc + transaction.amount;
      } else if (transaction.type === 'expense') {
        return acc - transaction.amount;
      }
      return acc;
    }, 0);
    setTotalAmount(total);

    setIsEmpty(transactions.length === 0);
  }, [transactions]);

  return (
    <>
      <h3>Total: {totalAmount.toFixed(2)} KGS</h3>

      {isEmpty && <p>Add a transaction to get started</p>}

      <TransactionsPage />
    </>
  );
};

export default HomePage;
