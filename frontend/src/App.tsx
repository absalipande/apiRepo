import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import Home from './components/Home';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Toaster />
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path='/home' element={<Home />} />
          </Route>
          <Route path='/' element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
