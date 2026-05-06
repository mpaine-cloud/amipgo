import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useParams, Link } from "react-router-dom";
import { Calendar, Eye, ArrowLeft, User } from "lucide-react";
import Markdown from "react-markdown";
import { cachedPosts } from "./BlogIndex";

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

export default function BlogPost() {
  const { slug } = useParams();
  
  const cachedPost = cachedPosts?.find(p => p.slug === slug) || null;
  
  const [post, setPost] = useState<Post | null>(cachedPost);
  const [loading, setLoading] = useState(!cachedPost);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!slug) return;
        
        // Ensure starting state if not cached
        if (!cachedPost) setLoading(true);

        const q = query(collection(db, "posts"), where("slug", "==", slug), where("published", "==", true));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          const postData = { id: docSnap.id, ...docSnap.data() } as Post;
          setPost(postData);
          
          // Increment views
          const viewedKey = `viewed_${postData.id}`;
          if (!localStorage.getItem(viewedKey)) {
            localStorage.setItem(viewedKey, 'true');
            // Allow unauthenticated update for views based on our rules
            await updateDoc(doc(db, "posts", postData.id), {
              views: (postData.views || 0) + 1
            }).catch(e => console.error("Could not update views", e));
          }
        } else {
          setError("Artículo no encontrado");
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Error cargando el artículo");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="pt-32 pb-20 min-h-screen">
          <article className="max-w-3xl mx-auto px-6 animate-pulse">
            <div className="w-32 h-4 bg-white/10 rounded mb-8"></div>
            
            <header className="mb-10 text-center flex flex-col items-center">
              <div className="w-3/4 h-12 md:h-16 bg-white/10 rounded-xl mb-6"></div>
              <div className="flex items-center justify-center gap-6">
                <div className="w-24 h-4 bg-white/10 rounded"></div>
                <div className="w-32 h-4 bg-white/10 rounded"></div>
                <div className="w-20 h-4 bg-white/10 rounded"></div>
              </div>
            </header>

            <div className="w-full aspect-[16/9] bg-white/10 rounded-3xl mb-12"></div>

            <div className="space-y-4">
              <div className="w-full h-6 bg-white/10 rounded"></div>
              <div className="w-full h-6 bg-white/10 rounded"></div>
              <div className="w-5/6 h-6 bg-white/10 rounded"></div>
              <div className="w-full h-6 bg-white/10 rounded mt-8"></div>
              <div className="w-full h-6 bg-white/10 rounded"></div>
              <div className="w-4/6 h-6 bg-white/10 rounded"></div>
            </div>
          </article>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-40 px-6 text-center">
          <h1 className="text-3xl font-heading font-bold mb-4">{error}</h1>
          <Link to="/blog" className="text-moss hover:underline">Volver al blog</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20 min-h-screen">
        <article className="max-w-3xl mx-auto px-6">
          <Link to="/blog" className="inline-flex items-center text-white/50 hover:text-moss text-sm mb-8 transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Volver al Blog
          </Link>

          <header className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 tracking-tight leading-tight text-balance">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm text-white/50 font-mono">
              <span className="flex items-center gap-2"><Calendar size={14} /> {new Date(post.createdAt).toLocaleDateString()}</span>
              {post.authorName && <span className="flex items-center gap-2"><User size={14} /> Escrito por: {post.authorName}</span>}
              <span className="flex items-center gap-2"><Eye size={14} /> {post.views} vistas</span>
            </div>
          </header>

          {post.coverUrl && (
            <div className="rounded-3xl overflow-hidden mb-12 border border-white/10 bg-black/40">
              <img src={post.coverUrl} alt={post.title} className="w-full object-cover" />
            </div>
          )}

          <div className="prose prose-invert prose-moss prose-lg md:prose-xl max-w-none font-sans prose-headings:font-heading prose-headings:font-bold prose-headings:text-balance prose-a:text-moss prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-p:leading-relaxed prose-p:text-white/80 prose-li:text-white/80">
            <Markdown>{post.content}</Markdown>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
