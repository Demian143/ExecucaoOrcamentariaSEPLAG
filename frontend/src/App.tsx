import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Charts from './pages/Charts';
import Orcamentos from './pages/Orcamentos';
import OrcamentoDetails from './pages/OrcamentoDetails';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login/>} />
        
        <Route element={<ProtectedRoute />}> 
          <Route path='/' element={<Home />} />
          <Route path='/home' element={<Navigate to="/" replace />} />
          <Route path='/orcamentos' element={<Orcamentos />} />
          <Route path='/orcamentos/:id' element={<OrcamentoDetails />} />
          <Route path='/graficos' element={<Charts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
