import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Switch from '@radix-ui/react-switch';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: boolean;
}

export function UsersView() {
  const [users, setUsers] = useState<User[]>([
    { id: 'U001', name: 'Admin User', email: 'admin@coreiu.com', role: 'admin', status: true },
    { id: 'U002', name: 'John Doe', email: 'john@coreiu.com', role: 'repartidor', status: true },
    { id: 'U003', name: 'Jane Smith', email: 'jane@coreiu.com', role: 'repartidor', status: false },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'repartidor',
    status: true,
  });

  const handleAdd = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'repartidor', status: true });
    setDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role, status: user.status });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
    } else {
      const newId = `U${String(users.length + 1).padStart(3, '0')}`;
      setUsers([...users, { id: newId, ...formData }]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <div className="p-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-[20px] text-[#1a1a1a] mb-1">Users</h2>
          <p className="text-[14px] text-[#737373]">Manage system users</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#002FA7] text-white rounded-md text-[14px] hover:bg-[#002080] transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          Add User
        </button>
      </div>

      <div className="space-y-2">
        {users.map(user => (
          <div key={user.id} className="bg-white border border-[#e5e5e5] rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-mono text-[12px] text-[#737373]">{user.id}</p>
                <p className="text-[16px] text-[#1a1a1a] mt-1">{user.name}</p>
                <p className="text-[14px] text-[#737373]">{user.email}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(user)}
                  className="p-2 hover:bg-[#f5f5f5] rounded-md transition-colors"
                >
                  <Pencil className="w-4 h-4 text-[#1a1a1a]" strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="p-2 hover:bg-[#fee2e2] rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-[#dc2626]" strokeWidth={1.5} />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-[#737373] capitalize">{user.role}</span>
              <span className={`text-[12px] px-2 py-1 rounded ${user.status ? 'bg-[#d1fae5] text-[#065f46]' : 'bg-[#fee2e2] text-[#991b1b]'}`}>
                {user.status ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/20" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-[90vw] max-w-[400px] shadow-lg">
            <Dialog.Title className="text-[18px] text-[#1a1a1a] mb-4">
              {editingUser ? 'Edit User' : 'Add User'}
            </Dialog.Title>

            <div className="space-y-4">
              <div>
                <label className="block text-[14px] text-[#1a1a1a] mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#f5f5f5] border border-[#e5e5e5] rounded-md text-[14px] focus:outline-none focus:ring-2 focus:ring-[#002FA7]"
                />
              </div>

              <div>
                <label className="block text-[14px] text-[#1a1a1a] mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-[#f5f5f5] border border-[#e5e5e5] rounded-md text-[14px] focus:outline-none focus:ring-2 focus:ring-[#002FA7]"
                />
              </div>

              <div>
                <label className="block text-[14px] text-[#1a1a1a] mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 bg-[#f5f5f5] border border-[#e5e5e5] rounded-md text-[14px] focus:outline-none focus:ring-2 focus:ring-[#002FA7]"
                >
                  <option value="admin">Admin</option>
                  <option value="repartidor">Repartidor</option>
                </select>
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
