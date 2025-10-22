import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
const Home = lazy(() => import('./Components/Pages/Home'));
const Details = lazy(() => import('./Components/Details/Details'));

const App = () => {
  return (
    <>
      
     <Suspense fallback={<div className="mt-10 text-center">Loading Page...</div>}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/details' element={<Details />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
