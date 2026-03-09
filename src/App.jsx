import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import Home from './pages/Home';
import Characters from './pages/Characters';
import CharacterDetail from './pages/CharacterDetail';
import Houses from './pages/Houses';
import HouseDetail from './pages/HouseDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="characters" element={<Characters />} />
          <Route path="characters/:id" element={<CharacterDetail />} />
          <Route path="houses" element={<Houses />} />
          <Route path="houses/:id" element={<HouseDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
