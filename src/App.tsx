import { Route, Routes } from 'react-router-dom';
import CategoriesPage from './components/CategoriesPage/CategoriesPage.tsx';
import MainPage from './MainPage/MainPage.tsx';
import Layout from './components/Layout/Layout.tsx';

const App = () => {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
        </Routes>
      </Layout>
    </>
  );
};

export default App;
