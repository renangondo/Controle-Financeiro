import React from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from 'react-router-dom';

import Login from './pages/Login/Login';
import Cadastro from './pages/Cadastro/Cadastro';
import Dashboard from './pages/Dashboard/Dashboard';
import ContasPagar from './pages/ContasPagar/ContasPagar';
import ContasReceber from './pages/ContasReceber/ContasReceber';
import Categorias from './pages/Categorias/Categorias';
import Relatorios from './pages/Relatorios/Relatorios';
import Layout from './components/Layout/Layout';
import PrivateRoute from './components/PrivateRoute';

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />

                <Route
                    element={
                        <PrivateRoute>
                            <Layout />
                        </PrivateRoute>
                    }
                >
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/contas-pagar" element={<ContasPagar />} />
                    <Route path="/contas-receber" element={<ContasReceber />} />
                    <Route path="/categorias" element={<Categorias />} />
                    <Route path="/relatorios" element={<Relatorios />} />
                </Route>

                <Route path="*" element={<Navigate to="/login" />} />

            </Routes>

        </BrowserRouter>

    );

}

export default App;