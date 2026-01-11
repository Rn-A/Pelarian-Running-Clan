
import React, { useState } from 'react';
import { Database, Event } from '../../../types';
import ReactQuill from 'react-quill-new';

interface CMSEventsProps {
  db: Database;
  onUpdate: (db: Database) => void;
}

const CMSEvents: React.FC<CMSEventsProps> = ({ db, onUpdate }) => {
  const [editingEvent, setEditingEvent] = useState<Partial<Event> | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const readers = Array.from(files).map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then(images => {
        setEditingEvent(prev => ({ ...prev, images: [...(prev?.images || []), ...images] }));
      });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    let newEvents = [...db.events];
    if (editingEvent.id) {
      newEvents = newEvents.map(ev => ev.id === editingEvent.id ? (editingEvent as Event) : ev);
    } else {
      newEvents.push({ ...editingEvent, id: Date.now().toString() } as Event);
    }

    onUpdate({ ...db, events: newEvents });
    setEditingEvent(null);
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image', 'clean'],
    ],
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black uppercase tracking-tighter">Manage <span className="text-[#0C61BC]">Events</span></h2>
        {!editingEvent && (
          <button 
            onClick={() => setEditingEvent({ title: '', category: 'General', images: [], date: '', time: '', location: '', description: '', status: 'ongoing', gformLink: '', slots: '' })}
            className="bg-[#0C61BC] hover:bg-white hover:text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg"
          >
            + Tambah Event
          </button>
        )}
      </div>

      {editingEvent ? (
        <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-white/5 mb-10 shadow-2xl">
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-full">
              <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-black mb-2">Judul Event</label>
              <input type="text" required className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#0C61BC] outline-none" 
                value={editingEvent.title} onChange={e => setEditingEvent({...editingEvent, title: e.target.value})} />
            </div>
            
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-black mb-2">Link Google Form (Registrasi)</label>
              <input type="url" placeholder="https://forms.gle/..." className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#0C61BC] outline-none" 
                value={editingEvent.gformLink} onChange={e => setEditingEvent({...editingEvent, gformLink: e.target.value})} />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-black mb-2">Kuota Slot (misal: 100 Peserta)</label>
              <input type="text" placeholder="100 Peserta / Unlimited" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#0C61BC] outline-none" 
                value={editingEvent.slots} onChange={e => setEditingEvent({...editingEvent, slots: e.target.value})} />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-black mb-2">Kategori</label>
              <input type="text" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#0C61BC] outline-none" 
                value={editingEvent.category} onChange={e => setEditingEvent({...editingEvent, category: e.target.value})} />
            </div>
            
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-black mb-2">Status</label>
              <select className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#0C61BC] outline-none" 
                value={editingEvent.status} onChange={e => setEditingEvent({...editingEvent, status: e.target.value as any})}>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="col-span-full">
              <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-black mb-2">Konten Deskripsi</label>
              <div className="bg-black rounded-xl overflow-hidden min-h-[300px]">
                <ReactQuill theme="snow" value={editingEvent.description} onChange={(c) => setEditingEvent({...editingEvent, description: c})} modules={quillModules} />
              </div>
            </div>

            <div className="col-span-full flex gap-4 pt-8 border-t border-white/5">
              <button type="submit" className="flex-1 bg-[#0C61BC] px-10 py-4 rounded-xl font-black text-white hover:bg-white hover:text-black transition-all uppercase tracking-widest text-sm">SIMPAN EVENT</button>
              <button type="button" onClick={() => setEditingEvent(null)} className="flex-1 bg-gray-800 px-10 py-4 rounded-xl font-black uppercase tracking-widest text-sm">BATAL</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          {db.events.map(event => (
            <div key={event.id} className="bg-[#1a1a1a] p-6 rounded-2xl flex items-center justify-between border border-white/5 group hover:border-[#0C61BC]/50 transition-all">
              <div className="flex items-center gap-4">
                <img src={event.images[0]} className="w-16 h-16 rounded-lg object-cover" alt="" />
                <div>
                  <h4 className="font-bold group-hover:text-[#0C61BC] transition-colors">{event.title}</h4>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{event.date} • Slot: {event.slots || '-'}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditingEvent(event)} className="p-3 bg-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Edit</button>
                <button onClick={() => {if(confirm('Hapus event?')) onUpdate({...db, events: db.events.filter(e => e.id !== event.id)})}} className="p-3 bg-red-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Hapus</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CMSEvents;
