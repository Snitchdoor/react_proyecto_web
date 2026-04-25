import { useState } from 'react';
import { AuthProvider, useAuth } from './components/AuthContext';
import { Login } from './components/Login';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { UsersView } from './components/UsersView';
import { ClientesView } from './components/ClientesView';
import { OrdersView, Order } from './components/OrdersView';
import { MaterialsView } from './components/MaterialsView';
import { EvidencesView } from './components/EvidencesView';

function AppContent() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');

  const [orders, setOrders] = useState<Order[]>([
    { id: 'ORD001', cliente: 'ABC Corporation', description: '50 units Product A', status: 'delivered', date: '2026-04-20', deleted: false },
    { id: 'ORD002', cliente: 'XYZ Industries', description: '30 units Product B', status: 'in-process', date: '2026-04-22', deleted: false },
    { id: 'ORD003', cliente: 'Tech Solutions', description: '20 units Product C', status: 'ordered', date: '2026-04-24', deleted: false },
    { id: 'ORD004', cliente: 'Old Client', description: 'Cancelled order', status: 'ordered', date: '2026-04-15', deleted: true },
  ]);

  const handleEvidenceUpload = (orderId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId && order.status === 'in-process'
          ? { ...order, status: 'delivered' as const }
          : order
      )
    );
  };

  if (!user) {
    return <Login />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return user.role === 'admin' ? <UsersView /> : <Dashboard />;
      case 'clientes':
        return user.role === 'admin' ? <ClientesView /> : <Dashboard />;
      case 'orders':
        return <OrdersView showDeleted={false} orders={orders} setOrders={setOrders} />;
      case 'deleted-orders':
        return user.role === 'admin' ? (
          <OrdersView showDeleted={true} orders={orders} setOrders={setOrders} />
        ) : <Dashboard />;
      case 'materials':
        return user.role === 'admin' ? <MaterialsView /> : <Dashboard />;
      case 'evidences':
        return <EvidencesView onEvidenceUpload={handleEvidenceUpload} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView}>
      {renderView()}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="size-full">
        <AppContent />
      </div>
    </AuthProvider>
  );
}