import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Toolbar.css';
import Modal from '../UI/Modal/Modal';
import TransactionForm from '../TransactionsPage/TransactionForm.tsx';

const ToolBar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-primary">
        <div className="container">
          <NavLink to="/">
            <span className="navbar-brand mb-0 text-white fs-1">Finance Tracker</span>
          </NavLink>
          <div className="ms-auto">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link text-white" to="/categories">Categories</NavLink>
              </li>
              <li className="nav-item">
                <button onClick={openModal} className="btn btn-primary">
                  Add
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {isModalOpen && (
        <Modal onClose={closeModal} show={isModalOpen} title="Add Expense/Income">
          <TransactionForm onClose={closeModal} />
        </Modal>
      )}
    </>
  );
};

export default ToolBar;

