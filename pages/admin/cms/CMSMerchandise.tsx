
import React, { useState } from 'react';
import { Database, Product } from '../../../types';

interface CMSMerchandiseProps {
  db: Database;
  onUpdate: (db: Database) => void;
}

const CMSMerchandise: React.FC<CMSMerchandiseProps> = ({ db, onUpdate }) => {
  const [editing, setEditing] = useState<Partial<Product> | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const readers = Array.from(files).map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });
      Promise.all(readers).then(images => {
        setEditing(prev => ({ ...prev, images: [...(prev?.images || []), ...images] }));
      });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    let newList = [...db.merchandise];
    if (editing.id) {
      newList = newList.map(p => p.id === editing.id ? (editing as Product) : p);
    } else {
      newList.push({ ...editing, id: 'm' + Date.now().toString() } as Product);
    }
    onUpdate({ ...db, merchandise: newList });
    setEditing(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black uppercase tracking-tighter">Manage <span className="text-[#ff4500]">Merchandise</span></h2>
        {!editing && (
          <button 
            onClick={() => setEditing({ name: '', images: [], price: 0, status: 'open', description: '', specifications: '', sizes: '', poPeriod: '', productionEstimation: '', gformLink: '', whatsappLink: '', poNotes: '' })}
            className="bg-[#ff4500] hover:bg-[#e63e00] px-6 py-3 rounded-xl font-bold"
          >
            + Tambah Produk
          </button>
        )}
      </div>

      {editing ? (
        <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-white/5 mb-10 shadow-2xl">
          <h3 className="text-xl font-bold mb-6 text-[#ff4500]">Produk Detail</h3>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-full">
              <label className="block text-sm text-gray-400 font-bold mb-2">Nama Produk</label>
              <input type="text" required className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white" 
                value={editing.name} onChange={e => setEditing({...editing, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm text-gray-400 font-bold mb-2">Harga (Rp)</label>
              <input type="number" required className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white" 
                value={editing.price} onChange={e => setEditing({...editing, price: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-sm text-gray-400 font-bold mb-2">Status</label>
              <select className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white" 
                value={editing.status} onChange={e => setEditing({...editing, status: e.target.value as any})}>
                <option value="open">Open Pre-Order</option>
                <option value="close">Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 font-bold mb-2">Ukuran (misal: S, M, L, XL)</label>
              <input type="text" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white" 
                value={editing.sizes} onChange={e => setEditing({...editing, sizes: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm text-gray-400 font-bold mb-2">Periode Pre-Order</label>
              <input type="text" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white" 
                value={editing.poPeriod} onChange={e => setEditing({...editing, poPeriod: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm text-gray-400 font-bold mb-2">Estimasi Produksi</label>
              <input type="text" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white" 
                value={editing.productionEstimation} onChange={e => setEditing({...editing, productionEstimation: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm text-gray-400 font-bold mb-2">Link GForm (Pesan Sekarang)</label>
              <input type="url" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white" 
                value={editing.gformLink} onChange={e => setEditing({...editing, gformLink: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm text-gray-400 font-bold mb-2">Link WhatsApp (Chat Admin)</label>
              <input type="url" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white" 
                value={editing.whatsappLink} onChange={e => setEditing({...editing, whatsappLink: e.target.value})} />
            </div>
            <div className="col-span-full">
              <label className="block text-sm text-gray-400 font-bold mb-2">Upload Gambar Produk</label>
              <input type="file" multiple accept="image/*" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white file:bg-[#ff4500] file:border-0 file:rounded-full file:text-white file:px-4 file:py-1 file:mr-4" 
                onChange={handleFileChange} />
              <div className="flex gap-4 mt-4">
                {editing.images?.map((img, idx) => (
                  <img key={idx} src={img} className="h-20 w-20 object-cover rounded-lg border border-white/10" alt="" />
                ))}
              </div>
            </div>
            <div className="col-span-full">
              <label className="block text-sm text-gray-400 font-bold mb-2">Catatan Pre-Order</label>
              <textarea className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white" rows={2} 
                value={editing.poNotes} onChange={e => setEditing({...editing, poNotes: e.target.value})} />
            </div>
            <div className="col-span-full">
              <label className="block text-sm text-gray-400 font-bold mb-2">Deskripsi Produk</label>
              <textarea className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white" rows={3} 
                value={editing.description} onChange={e => setEditing({...editing, description: e.target.value})} />
            </div>
            <div className="col-span-full flex gap-4">
              <button type="submit" className="bg-[#ff4500] px-10 py-4 rounded-xl font-black text-white">SIMPAN PRODUK</button>
              <button type="button" onClick={() => setEditing(null)} className="bg-gray-800 px-10 py-4 rounded-xl font-bold">BATAL</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {db.merchandise.map(item => (
            <div key={item.id} className="bg-[#1a1a1a] p-6 rounded-2xl flex flex-col border border-white/5">
              <img src={item.images[0]} className="w-full h-48 object-cover rounded-xl mb-4" alt="" />
              <h4 className="font-bold text-lg">{item.name}</h4>
              <p className="text-[#ff4500] font-black mb-4">Rp {item.price.toLocaleString('id-ID')}</p>
              <div className="flex gap-2 mt-auto">
                <button onClick={() => setEditing(item)} className="flex-1 py-2 bg-blue-600 rounded-lg text-xs font-bold">Edit</button>
                <button onClick={() => {if(confirm('Hapus?')) onUpdate({...db, merchandise: db.merchandise.filter(m => m.id !== item.id)})}} className="flex-1 py-2 bg-red-600 rounded-lg text-xs font-bold">Hapus</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CMSMerchandise;
