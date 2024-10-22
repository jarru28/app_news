import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import NewsList from './components/NewsList';
import 'bootstrap/dist/css/bootstrap.min.css';

const App =() =>{
  return (
    <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<NewsList type="new" />} />
          <Route path="/archived" element={<NewsList type="archived" />} />
        </Routes>
    </Router>
  );
}

export default App;