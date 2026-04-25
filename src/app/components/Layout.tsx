import { useState, ReactNode } from 'react';
import { Menu, X, LogOut, LayoutDashboard, Users, Building2, ShoppingCart, Trash2, Package, Camera } from 'lucide-react';
import { useAuth } from './AuthContext';

interface LayoutProps {
  children: ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
}

export function Layout({ children, currentView, onNavigate }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'clientes', label: 'Clientes', icon: Building2 },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'deleted-orders', label: 'Deleted Orders', icon: Trash2 },
    { id: 'materials', label: 'Materials', icon: Package },
    { id: 'evidences', label: 'Evidences', icon: Camera },
  ];

  const repartidorMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'evidences', label: 'Evidences', icon: Camera },
  ];

  const clientMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'materials', label: 'Materials', icon: Package },
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : user?.role === 'client' ? clientMenuItems : repartidorMenuItems;

  return (
    <div className="h-screen w-full bg-[#fafafa] flex flex-col">
      {/* Header */}
      <header className="h-14 bg-white border-b border-[#e5e5e5] flex items-center justify-between px-4 shrink-0">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-[#f5f5f5] rounded-md transition-colors"
        >
          <Menu className="w-5 h-5 text-[#1a1a1a]" strokeWidth={1.5} />
        </button>

        <h1 className="text-[16px] tracking-tight text-[#1a1a1a]">Coreiu</h1>

        <div className="w-9" />
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] bg-white border-r border-[#e5e5e5] z-50 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="h-14 border-b border-[#e5e5e5] flex items-center justify-between px-4">
            <h2 className="text-[16px] tracking-tight text-[#1a1a1a]">Menu</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 hover:bg-[#f5f5f5] rounded-md transition-colors"
            >
              <X className="w-5 h-5 text-[#1a1a1a]" strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-[14px] transition-colors ${
                      isActive
                        ? 'bg-[#002FA7] text-white'
                        : 'text-[#1a1a1a] hover:bg-[#f5f5f5]'
                    }`}
                  >
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="border-t border-[#e5e5e5] p-4">
            <div className="mb-3 px-3">
              <p className="text-[12px] text-[#737373]">Signed in as</p>
              <p className="text-[14px] text-[#1a1a1a]">{user?.username}</p>
              <p className="text-[12px] text-[#002FA7] capitalize">{user?.role}</p>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-[14px] text-[#dc2626] hover:bg-[#fee2e2] transition-colors"
            >
              <LogOut className="w-5 h-5" strokeWidth={1.5} />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}