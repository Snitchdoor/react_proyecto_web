import { useState } from 'react';
import { Plus, Search, Eye, Pencil, Trash2 } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { useAuth } from './AuthContext';

export interface Order {
  id: string;
  cliente: string;
  description: string;
  status: 'ordered' | 'in-process' | 'delivered';
  date: string;
  deleted?: boolean;
}

interface OrdersViewProps {
  showDeleted?: boolean;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

export function OrdersView({ showDeleted = false, orders, setOrders }: OrdersViewProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState({
    cliente: '',
    description: '',
    status: 'ordered' as Order['status'],
  });

  const isClient = user?.role === 'client';

  const filteredOrders = orders.filter(order => {
    const matchesDeleted = showDeleted ? order.deleted === true : order.deleted !== true;
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.cliente.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDeleted && matchesSearch;
  });

  const handleAdd = () => {
    setEditingOrder(null);
    setFormData({ cliente: '', description: '', status: 'ordered' });
    setDialogOpen(true);
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setFormData({ cliente: order.cliente, description: order.description, status: order.status });
    setDialogOpen(true);
  };

  const handleView = (order: Order) => {
    setViewingOrder(order);
    setViewDialogOpen(true);
  };

  const handleSave = () => {
    if (editingOrder) {
      setOrders(orders.map(o => o.id === editingOrder.id ? { ...o, ...formData } : o));
    } else {
      const newId = `ORD${String(orders.filter(o => !o.deleted).length + 1).padStart(3, '0')}`;
      const newOrder: Order = {
        id: newId,
        ...formData,
        date: new Date().toISOString().split('T')[0],
        deleted: false,
      };
      setOrders([...orders, newOrder]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, deleted: true } : o));
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'ordered': return 'bg-[#dbeafe] text-[#1e40af]';
      case 'in-process': return 'bg-[#fef3c7] text-[#92400e]';
      case 'delivered': return 'bg-[#d1fae5] text-[#065f46]';
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'ordered': return 'Ordered';
      case 'in-process': return 'In Process';
      case 'delivered': return 'Delivered';
    }
  };

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-[20px] text-[#1a1a1a] mb-1">
          {showDeleted ? 'Deleted Orders' : 'Orders'}
        </h2>
        <p className="text-[14px] text-[#737373]">
          {showDeleted ? 'View deleted orders' : 'Manage sales orders'}
        </p>
      </div>

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" strokeWidth={1.5} />
        <input
          type="text"
          placeholder="Search orders..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white border border-[#e5e5e5] rounded-md text-[14px] placeholder:text-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#002FA7]"
        />
      </div>

      <div className="space-y-2">
        {filteredOrders.map(order => (
          <div key={order.id} className="bg-white border border-[#e5e5e5] rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <p className="font-mono text-[12px] text-[#737373]">{order.id}</p>
                <p className="text-[16px] text-[#1a1a1a] mt-1">{order.cliente}</p>
                <p className="text-[14px] text-[#737373]">{order.description}</p>
                <p className="text-[12px] text-[#a3a3a3] mt-1">{order.date}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleView(order)}
                  className="p-2 hover:bg-[#f5f5f5] rounded-md transition-colors"
                >
                  <Eye className="w-4 h-4 text-[#1a1a1a]" strokeWidth={1.5} />
                </button>
                {!showDeleted && !isClient && (
                  <>
                    <button
                      onClick={() => handleEdit(order)}
                      className="p-2 hover:bg-[#f5f5f5] rounded-md transition-colors"
                    >
                      <Pencil className="w-4 h-4 text-[#1a1a1a]" strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="p-2 hover:bg-[#fee2e2] rounded-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-[#dc2626]" strokeWidth={1.5} />
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end">
              <span className={`text-[12px] px-2 py-1 rounded ${getStatusColor(order.status)}`}>
                {getStatusLabel(order.status)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {!showDeleted && (
        <button
          onClick={handleAdd}
          className="fixed bottom-6 right-6 w-14 h-14 bg-[#002FA7] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#002080] transition-colors"
        >
          <Plus className="w-6 h-6" strokeWidth={1.5} />
        </button>
      )}

      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/20" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-[90vw] max-w-[400px] shadow-lg">
            <Dialog.Title className="text-[18px] text-[#1a1a1a] mb-4">
              {editingOrder ? 'Edit Order' : 'New Order'}
            </Dialog.Title>

            <div className="space-y-4">
              <div>
                <label className="block text-[14px] text-[#1a1a1a] mb-2">Cliente</label>
                <input
                  type="text"
                  value={formData.cliente}
                  onChange={e => setFormData({ ...formData, cliente: e.target.value })}
                  className="w-full px-3 py-2 bg-[#f5f5f5] border border-[#e5e5e5] rounded-md text-[14px] focus:outline-none focus:ring-2 focus:ring-[#002FA7]"
                />
              </div>

              <div>
                <label className="block text-[14px] text-[#1a1a1a] mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-[#f5f5f5] border border-[#e5e5e5] rounded-md text-[14px] focus:outline-none focus:ring-2 focus:ring-[#002FA7] resize-none"
                />
              </div>

              <div>
                <label className="block text-[14px] text-[#1a1a1a] mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as Order['status'] })}
                  className="w-full px-3 py-2 bg-[#f5f5f5] border border-[#e5e5e5] rounded-md text-[14px] focus:outline-none focus:ring-2 focus:ring-[#002FA7]"
                >
                  <option value="ordered">Ordered</option>
                  <option value="in-process">In Process</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Dialog.Close asChild>
                <button className="flex-1 px-4 py-2 bg-[#e5e5e5] text-[#1a1a1a] rounded-md text-[14px] hover:bg-[#d4d4d4] transition-colors">
                  Cancel
                </button>
              </Dialog.Close>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-[#002FA7] text-white rounded-md text-[14px] hover:bg-[#002080] transition-colors"
              >
                Save
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/20" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-[90vw] max-w-[400px] shadow-lg">
            <Dialog.Title className="text-[18px] text-[#1a1a1a] mb-4">Order Details</Dialog.Title>

            {viewingOrder && (
              <div className="space-y-3">
                <div>
                  <p className="text-[12px] text-[#737373]">Order ID</p>
                  <p className="font-mono text-[14px] text-[#1a1a1a]">{viewingOrder.id}</p>
                </div>
                <div>
                  <p className="text-[12px] text-[#737373]">Cliente</p>
                  <p className="text-[14px] text-[#1a1a1a]">{viewingOrder.cliente}</p>
                </div>
                <div>
                  <p className="text-[12px] text-[#737373]">Description</p>
                  <p className="text-[14px] text-[#1a1a1a]">{viewingOrder.description}</p>
                </div>
                <div>
                  <p className="text-[12px] text-[#737373]">Date</p>
                  <p className="text-[14px] text-[#1a1a1a]">{viewingOrder.date}</p>
                </div>
                <div>
                  <p className="text-[12px] text-[#737373]">Status</p>
                  <span className={`inline-block text-[12px] px-2 py-1 rounded ${getStatusColor(viewingOrder.status)}`}>
                    {getStatusLabel(viewingOrder.status)}
                  </span>
                </div>
              </div>
            )}

            <div className="mt-6">
              <Dialog.Close asChild>
                <button className="w-full px-4 py-2 bg-[#002FA7] text-white rounded-md text-[14px] hover:bg-[#002080] transition-colors">
                  Close
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}