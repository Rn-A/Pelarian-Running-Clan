
import React, { useState } from 'react';
import { Database, Article } from '../../../types';
import ReactQuill from 'react-quill-new';

interface CMSArticlesProps {
  db: Database;
  onUpdate: (db: Database) => void;
}

const CMSArticles: React.FC<CMSArticlesProps> = ({ db, onUpdate }) => {
  const [editing, setEditing] = useState<Partial<Article> | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'author' | 'main') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'author') {
           setEditing(prev => ({ ...prev, authorPhoto: reader.result as string }));
        } else {
           setEditing(prev => ({ ...prev, images: [reader.result as string, ...(prev?.images?.slice(1) || [])] }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    let newList = [...db.articles];
    if (editing.id) {
      newList = newList.map(a => a.id === editing.id ? (editing as Article) : a);
    } else {
      newList.push({ ...editing, id: 'a' + Date.now().toString() } as Article);
    }
    onUpdate({ ...db, articles: newList });
    setEditing(null);
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black uppercase tracking-tighter">Manage <span className="text-[#ff4500]">Articles</span></h2>
        {!editing && (
          <button 
            onClick={() => setEditing({ title: '', date: new Date().toISOString().split('T')[0], category: 'Tips Lari', authorName: '', authorPhoto: '', authorRole: 'Member', images: [], description: '' })}
            className="bg-[#ff4500] hover:bg-[#e63e00] px-6 py-3 rounded-xl font-bold transition-all transform active:scale-95"
          >
            + Tulis Artikel
          </button>
        )}
      </div>

      {editing ? (
        <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-white/5 mb-10 shadow-2xl">
          <h3 className="text-xl font-bold mb-6 text-[#ff4500]">Drafting Artikel</h3>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-full">
              <label className="block text-sm text-gray-400 font-bold mb-2">Judul Artikel</label>
              <input type="text" required className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#ff4500] outline-none" 
                value={editing.title} onChange={e => setEditing({...editing, title: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm text-gray-400 font-bold mb-2">Penulis</label>
              <input type="text" required className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#ff4500] outline-none" 
                value={editing.authorName} onChange={e => setEditing({...editing, authorName: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm text-gray-400 font-bold mb-2">Role Penulis</label>
              <input type="text" required className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#ff4500] outline-none" 
                value={editing.authorRole} onChange={e => setEditing({...editing, authorRole: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm text-gray-400 font-bold mb-2">Upload Foto Penulis</label>
              <input type="file" accept="image/*" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white file:bg-[#ff4500] file:rounded-full file:border-0 file:text-white file:px-4 file:py-1 file:mr-4" 
                onChange={(e) => handleFileChange(e, 'author')} />
              {editing.authorPhoto && (
                <img src={editing.authorPhoto} className="mt-2 h-16 w-16 rounded-full object-cover border border-white/10" alt="Preview" />
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-400 font-bold mb-2">Upload Gambar Utama Artikel</label>
              <input type="file" accept="image/*" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white file:bg-[#ff4500] file:rounded-full file:border-0 file:text-white file:px-4 file:py-1 file:mr-4" 
                onChange={(e) => handleFileChange(e, 'main')} />
              {editing.images?.[0] && (
                <img src={editing.images[0]} className="mt-2 h-20 w-32 rounded-xl object-cover border border-white/10" alt="Preview" />
              )}
            </div>

            {/* Container Editor dengan margin bottom yang besar */}
            <div className="col-span-full mb-12">
              <label className="block text-sm text-gray-400 font-bold mb-2">Konten Artikel (WYSIWYG Editor)</label>
              <div className="bg-black rounded-xl overflow-hidden min-h-[400px]">
                <ReactQuill 
                  theme="snow"
                  value={editing.description}
                  onChange={(content: string) => setEditing({...editing, description: content})}
                  modules={quillModules}
                />
              </div>
            </div>

            {/* Kontainer Tombol Aksi */}
            <div className="col-span-full flex gap-4 pt-8 border-t border-white/5">
              <button 
                type="submit" 
                className="flex-1 bg-[#ff4500] px-10 py-4 rounded-xl font-black text-white shadow-lg hover:bg-[#e63e00] transition-all transform active:scale-95"
              >
                TERBITKAN ARTIKEL
              </button>
              <button 
                type="button" 
                onClick={() => setEditing(null)} 
                className="flex-1 bg-gray-800 px-10 py-4 rounded-xl font-bold hover:bg-gray-700 transition-all transform active:scale-95"
              >
                BATAL
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {db.articles.map(article => (
            <div key={article.id} className="bg-[#1a1a1a] p-6 rounded-2xl flex items-center justify-between border border-white/5 group hover:border-[#ff4500]/50 transition-all shadow-md">
              <div className="flex items-center gap-4">
                <img src={article.images[0]} className="w-16 h-16 rounded-lg object-cover border border-white/10" alt="" />
                <div>
                  <h4 className="font-bold text-lg group-hover:text-[#ff4500] transition-colors">{article.title}</h4>
                  <p className="text-gray-500 text-xs uppercase tracking-widest">{article.date} • {article.authorName}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(article)} className="p-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-lg text-xs font-bold uppercase">Edit</button>
                <button onClick={() => {if(confirm('Hapus artikel?')) onUpdate({...db, articles: db.articles.filter(a => a.id !== article.id)})}} className="p-3 bg-red-600 rounded-xl hover:bg-red-700 transition-all shadow-lg text-xs font-bold uppercase">Hapus</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CMSArticles;
