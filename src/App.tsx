/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { AppProvider } from './store/AppContext';
import { FlyingCartProvider } from './components/FlyingCartAnimation';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { AdminDashboard } from './components/AdminDashboard';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { FabricCatalogPage } from './pages/FabricCatalogPage';
import { AIChatWidget } from './components/AIChatWidget';
import { WhatsAppWidget } from './components/WhatsAppWidget';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route path="/" element={<HomePage key="home" />} />
        <Route path="/category/:type" element={<CategoryPage key={location.pathname} />} />
        <Route path="/product/:productId" element={<ProductDetailPage key={location.pathname} />} />
        <Route path="/fabrics" element={<FabricCatalogPage key="fabrics" />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AppProvider>
      <FlyingCartProvider>
        <Router>
        <div className="flex flex-col min-h-screen bg-[#FAF9F6] font-sans text-[#1E293B]">
          <Header />
          <main className="flex-1">
            <AnimatedRoutes />
          </main>
          
          <Footer />

          <AIChatWidget />
          <WhatsAppWidget />
          {/* Modals & Overlays */}
          <CartDrawer />
          <AdminDashboard />
        </div>
        </Router>
      </FlyingCartProvider>
    </AppProvider>
  );
}
