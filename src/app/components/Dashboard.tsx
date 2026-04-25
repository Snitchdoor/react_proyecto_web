import { useAuth } from './AuthContext';
import { LayoutDashboard, ShoppingCart, Package, Camera, TrendingUp } from 'lucide-react';

export function Dashboard() {
  const { user } = useAuth();

  const adminStats = [
    { label: 'Total Orders', value: '24', icon: ShoppingCart, color: 'bg-[#002FA7]' },
    { label: 'Active Orders', value: '12', icon: TrendingUp, color: 'bg-[#10b981]' },
    { label: 'Materials', value: '156', icon: Package, color: 'bg-[#f59e0b]' },
    { label: 'Evidences', value: '18', icon: Camera, color: 'bg-[#8b5cf6]' },
  ];

  const repartidorStats = [
    { label: 'Assigned Orders', value: '8', icon: ShoppingCart, color: 'bg-[#002FA7]' },
    { label: 'In Process', value: '3', icon: TrendingUp, color: 'bg-[#f59e0b]' },
    { label: 'Delivered Today', value: '5', icon: Camera, color: 'bg-[#10b981]' },
  ];

  const clientStats = [
    { label: 'My Orders', value: '15', icon: ShoppingCart, color: 'bg-[#002FA7]' },
    { label: 'In Process', value: '7', icon: TrendingUp, color: 'bg-[#f59e0b]' },
    { label: 'Available Materials', value: '156', icon: Package, color: 'bg-[#10b981]' },
  ];

  const stats = user?.role === 'admin' ? adminStats : user?.role === 'client' ? clientStats : repartidorStats;

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-[20px] text-[#1a1a1a] mb-1">Dashboard</h2>
        <p className="text-[14px] text-[#737373]">
          Welcome back, {user?.username}
        </p>
      </div>

      <div className="grid gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white border border-[#e5e5e5] rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[12px] text-[#737373] mb-1">{stat.label}</p>
                  <p className="text-[28px] text-[#1a1a1a] tracking-tight">{stat.value}</p>
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 bg-white border border-[#e5e5e5] rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <LayoutDashboard className="w-5 h-5 text-[#002FA7]" strokeWidth={1.5} />
          <h3 className="text-[16px] text-[#1a1a1a]">Quick Actions</h3>
        </div>
        <div className="text-[14px] text-[#737373]">
          Use the menu to navigate to different sections and manage your {user?.role === 'admin' ? 'system' : user?.role === 'client' ? 'orders and view materials' : 'orders'}.
        </div>
      </div>
    </div>
  );
}