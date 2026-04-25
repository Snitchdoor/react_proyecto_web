import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { useAuth } from './AuthContext';

interface Material {
  id: string;
  clave: string;
  description: string;
  stock: number;
}

export function MaterialsView() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([
    { id: 'M001', clave: 'PRD-A-001', description: 'Product A - Premium Grade', stock: 150 },
    { id: 'M002', clave: 'PRD-B-002', description: 'Product B - Standard Grade', stock: 230 },
    { id: 'M003', clave: 'PRD-C-003', description: 'Product C - Economy Grade', stock: 75 },
    { id: 'M004', clave: 'RAW-X-001', description: 'Raw Material X', stock: 500 },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [formData, setFormData] = useState({
    clave: '',
    description: '',
    stock: 0,
  });

  const isClient = user?.role === 'client';

  const handleAdd = () => {
    setEditingMaterial(null);
    setFormData({ clave: '', description: '', stock: 0 });
    setDialogOpen(true);
  };

  const handleEdit = (material: Material) => {
    setEditingMaterial(material);
    setFormData({ clave: material.clave, description: material.description, stock: material.stock });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editingMaterial) {
      setMaterials(materials.map(m => m.id === editingMaterial.id ? { ...m, ...formData } : m));
    } else {
      const newId = `M${String(materials.length + 1).padStart(3, '0')}`;
      setMaterials([...materials, { id: newId, ...formData }]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setMaterials(materials.filter(m => m.id !== id));
  };

  const getStockColor = (stock: number) => {
    if (stock < 100) return 'text-[#dc2626]';
    if (stock < 200) return 'text-[#f59e0b]';
    return 'text-[#10b981]';
  };

  return (
    <div className="p-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-[20px] text-[#1a1a1a] mb-1">Materials</h2>
          <p className="text-[14px] text-[#737373]">Inventory management</p>
        </div>
        {!isClient && (
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-[#002FA7] text-white rounded-md text-[14px] hover:bg-[#002080] transition-colors"
          >
            <Plus className="w-4 h-4" strokeWidth={1.5} />
            Add Material
          </button>
        )}
      </div>

      <div className="bg-white border border-[#e5e5e5] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#f5f5f5] border-b border-[#e5e5e5]">
              <th className="text-left px-4 py-3 text-[12px] text-[#737373] font-mono">ID</th>
              <th className="text-left px-4 py-3 text-[12px] text-[#737373] font-mono">CLAVE</th>
              <th className="text-left px-4 py-3 text-[12px] text-[#737373]">DESCRIPTION</th>
              <th className="text-right px-4 py-3 text-[12px] text-[#737373] font-mono">STOCK</th>
              <th className="text-right px-4 py-3 text-[12px] text-[#737373]">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {materials.map(material => (
              <tr key={material.id} className="border-b border-[#e5e5e5] last:border-0">
                <td className="px-4 py-3 text-[14px] font-mono text-[#737373]">{material.id}</td>
                <td className="px-4 py-3 text-[14px] font-mono text-[#1a1a1a]">{material.clave}</td>
                <td className="px-4 py-3 text-[14px] text-[#1a1a1a]">{material.description}</td>
                <td className={`px-4 py-3 text-[16px] font-mono text-right ${getStockColor(material.stock)}`}>
                  {material.stock}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-end">
                    {!isClient && (
                      <button
                        onClick={() => handleEdit(material)}
                        className="p-2 hover:bg-[#f5f5f5] rounded-md transition-colors"
                      >
                        <Pencil className="w-4 h-4 text-[#1a1a1a]" strokeWidth={1.5} />
                      </button>
                    )}
                    {!isClient && (
                      <button
                        onClick={() => handleDelete(material.id)}
                        className="p-2 hover:bg-[#fee2e2] rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-[#dc2626]" strokeWidth={1.5} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/20" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-[90vw] max-w-[400px] shadow-lg">
            <Dialog.Title className="text-[18px] text-[#1a1a1a] mb-4">
              {editingMaterial ? 'Edit Material' : 'Add Material'}
            </Dialog.Title>

            <div className="space-y-4">
              <div>
                <label className="block text-[14px] text-[#1a1a1a] mb-2">Clave</label>
                <input
                  type="text"
                  value={formData.clave}
                  onChange={e => setFormData({ ...formData, clave: e.target.value })}
                  placeholder="PRD-X-000"
                  className="w-full px-3 py-2 bg-[#f5f5f5] border border-[#e5e5e5] rounded-md text-[14px] font-mono focus:outline-none focus:ring-2 focus:ring-[#002FA7]"
                />
              </div>

              <div>
                <label className="block text-[14px] text-[#1a1a1a] mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-[#f5f5f5] border border-[#e5e5e5] rounded-md text-[14px] focus:outline-none focus:ring-2 focus:ring-[#002FA7] resize-none"
                />
              </div>

              <div>
                <label className="block text-[14px] text-[#1a1a1a] mb-2">Stock</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="w-full px-3 py-2 bg-[#f5f5f5] border border-[#e5e5e5] rounded-md text-[14px] font-mono focus:outline-none focus:ring-2 focus:ring-[#002FA7]"
                />
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