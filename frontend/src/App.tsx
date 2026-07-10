import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Charts from './pages/Charts';

function PlaceholderPage({ title }: { title: string }) {
  return (
    <section>
      <h1 className="text-2xl font-semibold text-gov-dark">{title}</h1>
    </section>
  );
}

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login/>} />
        
        <Route element={<ProtectedRoute />}> 
          <Route path='/' element={<Home />} />
          <Route path='/home' element={<Navigate to="/" replace />} />
          <Route path='/orcamentos' element={<PlaceholderPage title="Orçamentos" />} />
          <Route path='/graficos' element={<Charts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
