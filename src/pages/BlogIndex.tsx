import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import { Calendar, User, Eye, ArrowRight } from "lucide-react";
import SEO from "../components/SEO";

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverUrl: string;
  authorName?: string;
  views: number;
  createdAt: number;
}

// Simple in-memory cache to avoid loading spinner on frequent navigations
export let cachedPosts: Post[] | null = null;

export default function BlogIndex() {
  const [posts, setPosts] = useState<Post[]>(cachedPosts || []);
  const [loading, setLoading] = useState(!cachedPosts);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(
          collection(db, "posts"),
          where("published", "==", true)
        );
        
        const querySnapshot = await getDocs(q);
        const fetchedPosts: Post[] = [];
        querySnapshot.forEach((doc) => {
          fetchedPosts.push({ id: doc.id, ...doc.data() } as Post);
        });
        
        // Sort descending by createdAt
        fetchedPosts.sort((a, b) => b.createdAt - a.createdAt);
        
        cachedPosts = fetchedPosts;
        setPosts(fetchedPosts);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <SEO 
        title="Centro de Recursos Estratégicos | Blog de Amipgo"
        description="Accede a las guías definitivas y manuales prácticos para estructurar proyectos de innovación y entender los criterios de evaluación de fondos públicos."
        url="https://www.amipgo.com/blog"
        keywords="blog amipgo, recursos para emprendedores, guias de postulacion, fondos de innovacion, postular a corfo, subsidios de gobierno"
      />
      <Navbar />
      <main className="pt-32 pb-20 min-h-screen">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16">
            <h1 className="text-5xl md:text-7xl font-heading font-bold mb-4 tracking-tight text-balance">Centro de Recursos Estratégicos</h1>
            <p className="text-xl text-white/60 max-w-4xl leading-relaxed">
              No es solo información, es tu manual de ejecución. Accede a las guías definitivas para estructurar proyectos ganadores y asegurar el financiamiento que tu innovación merece.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((skeleton) => (
                <div key={skeleton} className="flex flex-col bg-white/5 border border-white/10 rounded-3xl overflow-hidden animate-pulse">
                  <div className="aspect-[16/10] bg-white/10 w-full" />
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="h-4 bg-white/10 rounded w-1/3 mb-4" />
                    <div className="h-6 bg-white/10 rounded w-full mb-2" />
                    <div className="h-6 bg-white/10 rounded w-2/3 mb-4" />
                    <div className="h-4 bg-white/10 rounded w-full mb-2" />
                    <div className="h-4 bg-white/10 rounded w-full mb-2" />
                    <div className="h-4 bg-white/10 rounded w-3/4 mt-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
              <p className="text-white/60">Aún no hay publicaciones disponibles.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map(post => (
                <Link to={`/blog/${post.slug}`} key={post.id} className="group flex flex-col bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-moss/50 transition-colors">
                  <div className="aspect-[16/10] bg-black/40 overflow-hidden relative">
                    {post.coverUrl ? (
                      <img src={post.coverUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-moss/20 text-moss">
                        <span className="font-heading font-semibold text-xl">amipGO</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-xs text-white/40 mb-3 font-mono">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(post.createdAt).toLocaleDateString()}</span>
                      {post.authorName && <span className="flex items-center gap-1"><User size={12} /> {post.authorName}</span>}
                      <span className="flex items-center gap-1"><Eye size={12} /> {post.views || 0}</span>
                    </div>
                    <h2 className="text-xl font-heading font-semibold mb-3 group-hover:text-moss transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-white/60 text-sm line-clamp-3 mb-6 flex-1">
                      {post.content.replace(/<[^>]+>/g, '').substring(0, 150)}...
                    </p>
                    <div className="flex items-center text-moss font-semibold text-sm mt-auto group-hover:gap-2 transition-all">
                      Leer artículo <ArrowRight size={16} className="ml-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
