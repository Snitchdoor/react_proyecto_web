import { useState, useRef } from 'react';
import { Camera, Upload, Image as ImageIcon } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

interface Evidence {
  id: string;
  orderId: string;
  imageUrl: string;
  uploadedAt: string;
  uploadedBy: string;
}

interface EvidencesViewProps {
  onEvidenceUpload?: (orderId: string) => void;
}

export function EvidencesView({ onEvidenceUpload }: EvidencesViewProps) {
  const [evidences, setEvidences] = useState<Evidence[]>([
    { id: 'EV001', orderId: 'ORD001', imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400', uploadedAt: '2026-04-20 14:30', uploadedBy: 'repartidor' },
    { id: 'EV002', orderId: 'ORD002', imageUrl: 'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=400', uploadedAt: '2026-04-22 10:15', uploadedBy: 'repartidor' },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    orderId: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setSelectedImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (selectedImage && formData.orderId) {
      const newEvidence: Evidence = {
        id: `EV${String(evidences.length + 1).padStart(3, '0')}`,
        orderId: formData.orderId,
        imageUrl: selectedImage,
        uploadedAt: new Date().toLocaleString('en-CA', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }).replace(',', ''),
        uploadedBy: 'repartidor',
      };

      setEvidences([...evidences, newEvidence]);

      if (onEvidenceUpload) {
        onEvidenceUpload(formData.orderId);
      }

      setDialogOpen(false);
      setSelectedImage(null);
      setFormData({ orderId: '' });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCameraClick = () => {
    setSelectedImage(null);
    setFormData({ orderId: '' });
    setDialogOpen(true);
  };

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-[20px] text-[#1a1a1a] mb-1">Evidences</h2>
        <p className="text-[14px] text-[#737373]">Upload delivery evidences</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-20">
        {evidences.map(evidence => (
          <div key={evidence.id} className="bg-white border border-[#e5e5e5] rounded-lg overflow-hidden">
            <div className="aspect-square bg-[#f5f5f5] relative">
              <img
                src={evidence.imageUrl}
                alt={`Evidence ${evidence.id}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3">
              <p className="font-mono text-[12px] text-[#737373]">{evidence.id}</p>
              <p className="font-mono text-[12px] text-[#002FA7] mt-1">{evidence.orderId}</p>
              <p className="text-[11px] text-[#a3a3a3] mt-1">{evidence.uploadedAt}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleCameraClick}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#002FA7] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#002080] transition-colors"
      >
        <Camera className="w-6 h-6" strokeWidth={1.5} />
      </button>

      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/20" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-[90vw] max-w-[400px] shadow-lg">
            <Dialog.Title className="text-[18px] text-[#1a1a1a] mb-4">Upload Evidence</Dialog.Title>

            <div className="space-y-4">
              <div>
                <label className="block text-[14px] text-[#1a1a1a] mb-2">Order ID</label>
                <input
                  type="text"
                  value={formData.orderId}
                  onChange={e => setFormData({ ...formData, orderId: e.target.value })}
                  placeholder="ORD001"
                  className="w-full px-3 py-2 bg-[#f5f5f5] border border-[#e5e5e5] rounded-md text-[14px] font-mono focus:outline-none focus:ring-2 focus:ring-[#002FA7]"
                />
              </div>

              <div>
                <label className="block text-[14px] text-[#1a1a1a] mb-2">Photo</label>
                {selectedImage ? (
                  <div className="relative">
                    <img
                      src={selectedImage}
                      alt="Selected"
                      className="w-full h-48 object-cover rounded-lg border border-[#e5e5e5]"
                    />
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="absolute top-2 right-2 px-3 py-1 bg-white text-[#1a1a1a] rounded-md text-[12px] shadow-sm hover:bg-[#f5f5f5] transition-colors"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-[#e5e5e5] rounded-lg p-8">
                    <div className="flex flex-col items-center gap-3">
                      <ImageIcon className="w-12 h-12 text-[#d4d4d4]" strokeWidth={1.5} />
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="flex items-center gap-2 px-4 py-2 bg-[#002FA7] text-white rounded-md text-[14px] hover:bg-[#002080] transition-colors cursor-pointer"
                      >
                        <Upload className="w-4 h-4" strokeWidth={1.5} />
                        Select Photo
                      </label>
                      <p className="text-[12px] text-[#737373]">or take a new photo</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Dialog.Close asChild>
                <button className="flex-1 px-4 py-2 bg-[#e5e5e5] text-[#1a1a1a] rounded-md text-[14px] hover:bg-[#d4d4d4] transition-colors">
                  Cancel
                </button>
              </Dialog.Close>
              <button
                onClick={handleUpload}
                disabled={!selectedImage || !formData.orderId}
                className="flex-1 px-4 py-2 bg-[#002FA7] text-white rounded-md text-[14px] hover:bg-[#002080] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upload
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
