import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login'/>
        <Route element={<ProtectedRoute />}> </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
