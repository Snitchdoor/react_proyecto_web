import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Switch from '@radix-ui/react-switch';

interface Cliente {
  id: string;
  name: string;
  contact: string;
  phone: string;
  address: string;
  status: boolean;
}

export function ClientesView() {
  const [clientes, setClientes] = useState<Cliente[]>([
    { id: 'C001', name: 'ABC Corporation', contact: 'Sarah Johnson', phone: '555-0101', address: '123 Main St', status: true },
    { id: 'C002', name: 'XYZ Industries', contact: 'Mike Chen', phone: '555-0102', address: '456 Oak Ave', status: true },
    { id: 'C003', name: 'Tech Solutions', contact: 'Lisa Wang', phone: '555-0103', address: '789 Pine Rd', status: false },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    phone: '',
    address: '',
    status: true,
  });

  const handleAdd = () => {
    setEditingCliente(null);
    setFormData({ name: '', contact: '', phone: '', address: '', status: true });
    setDialogOpen(true);
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setFormData({ name: cliente.name, contact: cliente.contact, phone: cliente.phone, address: cliente.address, status: cliente.status });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editingCliente) {
      setClientes(clientes.map(c => c.id === editingCliente.id ? { ...c, ...formData } : c));
    } else {
      const newId = `C${String(clientes.length + 1).padStart(3, '0')}`;
      setClientes([...clientes, { id: newId, ...formData }]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setClientes(clientes.filter(c => c.id !== id));
  };

  return (
    <div className="p-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-[20px] text-[#1a1a1a] mb-1">Clientes</h2>
          <p className="text-[14px] text-[#737373]">Manage customer accounts</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#002FA7] text-white rounded-md text-[14px] hover:bg-[#002080] transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          Add Cliente
        </button>
      </div>

      <div className="space-y-2">
        {clientes.map(cliente => (
          <div key={cliente.id} className="bg-white border border-[#e5e5e5] rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <p className="font-mono text-[12px] text-[#737373]">{cliente.id}</p>
                <p className="text-[16px] text-[#1a1a1a] mt-1">{cliente.name}</p>
                <p className="text-[14px] text-[#737373]">{cliente.contact}</p>
                <p className="text-[14px] text-[#737373]">{cliente.phone}</p>
                <p className="text-[12px] text-[#a3a3a3] mt-1">{cliente.address}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(cliente)}
                  className="p-2 hover:bg-[#f5f5f5] rounded-md transition-colors"
                >
                  <Pencil className="w-4 h-4 text-[#1a1a1a]" strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => handleDelete(cliente.id)}
                  className="p-2 hover:bg-[#fee2e2] rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-[#dc2626]" strokeWidth={1.5} />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <span className={`text-[12px] px-2 py-1 rounded ${cliente.status ? 'bg-[#d1fae5] text-[#065f46]' : 'bg-[#fee2e2] text-[#991b1b]'}`}>
                {cliente.status ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/20" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-[90vw] max-w-[400px] shadow-lg max-h-[80vh] overflow-y-auto">
            <Dialog.Title className="text-[18px] text-[#1a1a1a] mb-4">
              {editingCliente ? 'Edit Cliente' : 'Add Cliente'}
            </Dialog.Title>

            <div className="space-y-4">
              <div>
                <label className="block text-[14px] text-[#1a1a1a] mb-2">Company Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#f5f5f5] border border-[#e5e5e5] rounded-md text-[14px] focus:outline-none focus:ring-2 focus:ring-[#002FA7]"
                />
              </div>

              <div>
                <label className="block text-[14px] text-[#1a1a1a] mb-2">Contact Person</label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={e => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-3 py-2 bg-[#f5f5f5] border border-[#e5e5e5] rounded-md text-[14px] focus:outline-none focus:ring-2 focus:ring-[#002FA7]"
                />
              </div>

              <div>
                <label className="block text-[14px] text-[#1a1a1a] mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-[#f5f5f5] border border-[#e5e5e5] rounded-md text-[14px] focus:outline-none focus:ring-2 focus:ring-[#002FA7]"
                />
              </div>

              <div>
                <label className="block text-[14px] text-[#1a1a1a] mb-2">Address</label>
                <textarea
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-[#f5f5f5] border border-[#e5e5e5] rounded-md text-[14px] focus:outline-none focus:ring-2 focus:ring-[#002FA7] resize-none"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-[14px] text-[#1a1a1a]">Status</label>
                <Switch.Root
                  checked={formData.status}
                  onCheckedChange={checked => setFormData({ ...formData, status: checked })}
                  className="w-11 h-6 bg-[#d4d4d4] rounded-full relative data-[state=checked]:bg-[#002FA7] transition-colors"
                >
                  <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-[22px]" />
                </Switch.Root>
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
    </div>
  );
}
