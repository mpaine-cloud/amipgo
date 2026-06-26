import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { auth, db } from "../firebase";
import SEO from "../components/SEO";
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from "firebase/auth";
import { collection, query, getDocs, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { Plus, Edit2, Trash2, LogOut, Eye, ArrowLeft, Upload, Loader2, Download } from "lucide-react";
import Markdown from "react-markdown";

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverUrl: string;
  authorName: string;
  published: boolean;
  views: number;
  createdAt: number;
  updatedAt: number;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  acceptsPrivacy: boolean;
  acceptsMarketing: boolean;
  createdAt: number;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState({ visitors: 0 });

  const [editingPost, setEditingPost] = useState<Partial<Post> | null>(null);
  const [saveStatus, setSaveStatus] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "leads">("posts");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Auto-provision mpaine@amipgo.com as admin
        if (currentUser.email === "mpaine@amipgo.com") {
          try {
            await setDoc(doc(db, "users", currentUser.uid), {
              email: currentUser.email,
              role: 'admin',
              createdAt: Date.now()
            }, { merge: true });
          } catch (e) {
            console.error("Could not provision admin", e);
          }
        }
        
        // Check if admin
        const adminDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (adminDoc.exists() && adminDoc.data().role === 'admin') {
          setIsAdmin(true);
          fetchData();
        } else {
          setIsAdmin(false);
        }
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const fetchData = async () => {
    try {
      const q = query(collection(db, "posts"));
      const snapshot = await getDocs(q);
      const fetchedPosts = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Post));
      fetchedPosts.sort((a, b) => b.createdAt - a.createdAt);
      setPosts(fetchedPosts);

      const leadsSnap = await getDocs(collection(db, "leads"));
      const fetchedLeads = leadsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Lead));
      fetchedLeads.sort((a, b) => b.createdAt - a.createdAt);
      setLeads(fetchedLeads);

      const statSnap = await getDoc(doc(db, "siteStats", "main"));
      if (statSnap.exists()) {
        setStats({ visitors: statSnap.data().visitors });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setEditingPost({ ...editingPost, coverUrl: dataUrl });
        setUploadingImage(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      alert("Error al leer la imagen.");
      setUploadingImage(false);
    };
    
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!editingPost?.title || !editingPost?.content) return;
    
    setSaveStatus("Guardando...");
    try {
      const now = Date.now();
      const isNew = !editingPost.id;
      const slug = editingPost.slug || generateSlug(editingPost.title!);
      const postId = isNew ? generateSlug(editingPost.title) + '-' + now.toString().slice(-4) : editingPost.id!;

      const postData = {
        title: editingPost.title,
        slug: slug,
        content: editingPost.content,
        coverUrl: editingPost.coverUrl || "",
        authorName: editingPost.authorName || "Equipo amipGO",
        published: editingPost.published || false,
        authorId: user!.uid,
        updatedAt: now,
        ...(isNew && { views: 0, createdAt: now })
      };

      await setDoc(doc(db, "posts", postId), postData, { merge: true });
      
      setSaveStatus("Guardado con éxito");
      setEditingPost(null);
      fetchData();
      
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (err) {
      console.error("Error saving doc:", err);
      setSaveStatus("Error al guardar");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Seguro que deseas eliminar este artículo?")) {
      try {
        await deleteDoc(doc(db, "posts", id));
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (window.confirm("¿Seguro que deseas eliminar este lead? Esta acción no se puede deshacer.")) {
      try {
        await deleteDoc(doc(db, "leads", id));
        fetchData();
      } catch (err) {
        console.error(err);
        alert("Error al eliminar el lead");
      }
    }
  };

  const exportLeadsToCSV = () => {
    const headers = ['Fecha', 'Nombre', 'Email', 'WhatsApp', 'Acepta Privacidad', 'Acepta Marketing'];
    const csvContent = [
      headers.join(','),
      ...leads.map(l => [
        new Date(l.createdAt).toLocaleString(),
        `"${l.name.replace(/"/g, '""')}"`,
        l.email,
        l.whatsapp || '',
        l.acceptsPrivacy ? 'Si' : 'No',
        l.acceptsMarketing ? 'Si' : 'No'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `leads_amipgo_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <>
        <SEO title="Panel de Administración | Amipgo" description="Cargando panel de administración..." robots="noindex, nofollow" />
        <div className="h-screen bg-cream text-white flex items-center justify-center">Cargando...</div>
      </>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="h-screen bg-cream text-white flex flex-col items-center justify-center px-4">
        <SEO title="Acceso Restringido | Amipgo" description="Inicia sesión como administrador." robots="noindex, nofollow" />
        <h1 className="text-3xl font-heading font-bold mb-4">Administración</h1>
        {user ? (
          <p className="mb-6 opacity-60">Tu cuenta ({user.email}) no tiene permisos de administrador.</p>
        ) : (
          <p className="mb-6 opacity-60">Inicia sesión como administrador para continuar.</p>
        )}
        <button 
          onClick={handleLogin}
          className="bg-white text-moss px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
        >
          Iniciar sesión con Google
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream text-white pb-20">
      <SEO title="Panel de Administración | Amipgo" description="Panel de administración de Amipgo." robots="noindex, nofollow" />
      <Navbar />
      
      <main className="pt-32 px-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-heading font-bold">Dashboard</h1>
          <button 
            onClick={() => auth.signOut()}
            className="text-white/60 hover:text-white flex items-center gap-2"
          >
            <LogOut size={16} /> Salir
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <h3 className="text-white/50 text-sm mb-2 font-mono">Artículos</h3>
            <p className="text-4xl font-heading font-bold">{posts.length}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <h3 className="text-white/50 text-sm mb-2 font-mono">Visitas Totales Sitio</h3>
            <p className="text-4xl font-heading font-bold">{stats.visitors}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <h3 className="text-white/50 text-sm mb-2 font-mono">Vistas Blog Totales</h3>
            <p className="text-4xl font-heading font-bold">
              {posts.reduce((acc, p) => acc + (p.views || 0), 0)}
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <h3 className="text-white/50 text-sm mb-2 font-mono">Leads Workspace</h3>
            <p className="text-4xl font-heading font-bold">{leads.length}</p>
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveTab("posts")}
            className={`px-6 py-2 rounded-full font-semibold transition-colors ${activeTab === 'posts' ? 'bg-moss text-white' : 'bg-white/10 text-white/60 hover:bg-white/15'}`}
          >
            Artículos
          </button>
          <button 
            onClick={() => setActiveTab("leads")}
            className={`px-6 py-2 rounded-full font-semibold transition-colors ${activeTab === 'leads' ? 'bg-moss text-white' : 'bg-white/10 text-white/60 hover:bg-white/15'}`}
          >
            Leads Workspace
          </button>
        </div>

        {activeTab === 'leads' ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-heading font-bold">Leads (Workspace)</h2>
              <button 
                onClick={exportLeadsToCSV}
                className="bg-moss/20 text-moss px-5 py-2 rounded-full font-semibold hover:bg-moss/30 transition-colors flex items-center gap-2"
              >
                <Download size={16} /> Exportar CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 text-white/50">
                    <th className="py-3 px-4 font-mono font-normal">Fecha</th>
                    <th className="py-3 px-4 font-mono font-normal">Nombre</th>
                    <th className="py-3 px-4 font-mono font-normal">Email</th>
                    <th className="py-3 px-4 font-mono font-normal">WhatsApp</th>
                    <th className="py-3 px-4 font-mono font-normal">Permisos</th>
                    <th className="py-3 px-4 font-mono font-normal">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {leads.map(lead => (
                    <tr key={lead.id} className="hover:bg-white/5 transition-colors text-sm">
                      <td className="py-4 px-4 whitespace-nowrap opacity-70">
                        {new Date(lead.createdAt).toLocaleDateString()} {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-4 px-4 font-semibold">{lead.name}</td>
                      <td className="py-4 px-4">{lead.email}</td>
                      <td className="py-4 px-4">{lead.whatsapp}</td>
                      <td className="py-4 px-4 flex flex-col gap-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium w-fit ${lead.acceptsPrivacy ? 'bg-moss/20 text-moss' : 'bg-red-500/20 text-red-400'}`}>Privacidad: {lead.acceptsPrivacy ? 'Sí' : 'No'}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium w-fit ${lead.acceptsMarketing ? 'bg-moss/20 text-moss' : 'bg-white/10 text-white/50'}`}>Marketing: {lead.acceptsMarketing ? 'Sí' : 'No'}</span>
                      </td>
                      <td className="py-4 px-4">
                        <button 
                          onClick={() => handleDeleteLead(lead.id)}
                          className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                          title="Eliminar Lead"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {leads.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-white/50">No hay leads capturados aún.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : editingPost ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10">
            <button 
              onClick={() => setEditingPost(null)}
              className="text-white/50 hover:text-white flex items-center gap-2 mb-6"
            >
              <ArrowLeft size={16} /> Volver
            </button>
            <h2 className="text-2xl font-heading font-bold mb-6">
              {editingPost.id ? 'Editar Artículo' : 'Nuevo Artículo'}
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-white/50 mb-2">Título</label>
                <input 
                  type="text" 
                  value={editingPost.title || ''}
                  onChange={e => setEditingPost({...editingPost, title: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-moss"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-white/50 mb-2">URL del Cover (Imagen de Portada)</label>
                  <div className="flex gap-4">
                    <input 
                      type="text" 
                      value={editingPost.coverUrl || ''}
                      onChange={e => setEditingPost({...editingPost, coverUrl: e.target.value})}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-moss"
                      placeholder="https://ejemplo.com/imagen.jpg o sube un archivo ➡️"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="flex-shrink-0 bg-moss/20 hover:bg-moss/30 text-moss px-6 rounded-xl flex items-center gap-2 font-semibold transition-colors disabled:opacity-50"
                    >
                      {uploadingImage ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                      {uploadingImage ? 'Subiendo...' : 'Subir'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white/50 mb-2">Autor</label>
                  <input 
                    type="text" 
                    value={editingPost.authorName || ''}
                    onChange={e => setEditingPost({...editingPost, authorName: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-moss"
                    placeholder="Ej. Equipo amipGO"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-white/50 mb-2">Contenido (Markdown)</label>
                  <textarea 
                    value={editingPost.content || ''}
                    onChange={e => setEditingPost({...editingPost, content: e.target.value})}
                    className="w-full h-[500px] bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-moss font-mono text-sm resize-none"
                    placeholder="Escribe en formato markdown... Puedes poner urls as\u00ed: [texto](https://url.com)"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/50 mb-2">Vista Previa</label>
                  <div className="w-full h-[500px] bg-white/5 border border-white/10 rounded-xl p-6 overflow-y-auto prose prose-invert prose-moss prose-lg max-w-none font-sans prose-headings:font-heading prose-headings:font-bold prose-a:text-moss prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-p:leading-relaxed prose-p:text-white/80 prose-li:text-white/80">
                    <Markdown>{editingPost.content || '*Aún no hay contenido*'}</Markdown>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 py-4">
                <input 
                  type="checkbox" 
                  id="published"
                  checked={editingPost.published || false}
                  onChange={e => setEditingPost({...editingPost, published: e.target.checked})}
                  className="w-5 h-5 accent-moss"
                />
                <label htmlFor="published">Artículo publicado</label>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={handleSave}
                  className="bg-moss text-white px-8 py-3 rounded-full font-semibold hover:brightness-110 transition-all"
                >
                  Guardar
                </button>
                {saveStatus && <span className="text-white/60">{saveStatus}</span>}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-heading font-bold">Listado de Artículos</h2>
              <button 
                onClick={() => setEditingPost({ title: '', content: '', authorName: 'Equipo amipGO', published: false })}
                className="bg-moss/20 text-moss px-5 py-2 rounded-full font-semibold hover:bg-moss/30 transition-colors flex items-center gap-2"
              >
                <Plus size={16} /> Crear
              </button>
            </div>

            <div className="divide-y divide-white/10">
              {posts.map(post => (
                <div key={post.id} className="py-4 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-heading font-semibold text-lg">{post.title}</h3>
                    <div className="flex items-center gap-4 text-xs text-white/50 mt-1">
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Eye size={12} /> {post.views || 0}</span>
                      <span className={post.published ? 'text-green-400' : 'text-yellow-400'}>
                        {post.published ? 'Publicado' : 'Borrador'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setEditingPost(post)}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(post.id)}
                      className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {posts.length === 0 && (
                <p className="text-white/50 py-4">No hay artículos creados.</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
