import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Clock, Share2, Facebook, Twitter, Linkedin, ChevronRight } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { getPublicPostBySlug } from '../../api/cms';
import SEO from '../../components/SEO';

const BlogPost = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Reading Progress
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        fetchPost();
        window.scrollTo(0, 0);
    }, [slug]);

    const fetchPost = async () => {
        setLoading(true);
        try {
            const data = await getPublicPostBySlug(slug);
            setPost(data);
        } catch (err) {
            console.error("Failed to fetch blog post", err);
            setError("Post not found");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-white pt-32 pb-24 flex justify-center">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
    );

    if (error || !post) return (
        <div className="min-h-screen bg-white pt-32 pb-24 text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Post Not Found</h1>
            <Link to="/blog" className="text-indigo-600 font-bold hover:underline">Return to Blog</Link>
        </div>
    );

    // Structured Data for Article
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "image": post.featured_image ? [post.featured_image] : [],
        "datePublished": post.published_at,
        "dateModified": post.updated_at || post.published_at,
        "author": {
            "@type": "Person",
            "name": post.author?.name || 'DocForge Team'
        }
    };

    return (
        <article className="min-h-screen bg-white">
            <SEO
                title={post.seo_title || post.title}
                description={post.seo_description || post.summary}
                url={`/blog/${post.slug}`}
                image={post.featured_image}
                type="article"
                keywords={post.meta_keywords}
                jsonLd={jsonLd}
            />

            {/* Reading Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-indigo-600 origin-left z-50"
                style={{ scaleX }}
            />

            {/* Header / Hero */}
            <div className="bg-slate-50 pt-32 pb-12 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6">
                    <Link to="/blog" className="inline-flex items-center gap-2 text-slate-500 font-bold text-sm hover:text-indigo-600 mb-8 transition-colors">
                        <ArrowLeft size={16} /> Back to Blog
                    </Link>

                    <div className="max-w-4xl">
                        {post.category && (
                            <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                                {post.category.name}
                            </span>
                        )}
                        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-slate-500">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center overflow-hidden">
                                    {post.author?.avatar_url ? (
                                        <img src={post.author.avatar_url} alt={post.author.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="font-bold text-xs text-slate-500">{post.author?.name?.[0] || 'D'}</span>
                                    )}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">{post.author?.name || 'DocForge Team'}</p>
                                    <p className="text-xs">Author</p>
                                </div>
                            </div>
                            <span className="w-px h-8 bg-slate-300 hidden sm:block"></span>
                            <div className="flex items-center gap-4 text-sm font-medium">
                                <span className="flex items-center gap-2">
                                    <Calendar size={18} className="text-slate-400" />
                                    {new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Clock size={18} className="text-slate-400" />
                                    5 min read
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-8">
                        {post.featured_image && (
                            <div className="rounded-2xl overflow-hidden mb-12 shadow-lg border border-slate-100">
                                <img src={post.featured_image} alt={post.title} className="w-full h-auto" />
                            </div>
                        )}

                        <div
                            className="prose prose-lg prose-indigo prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-8 prose-li:text-slate-600 max-w-none break-words"
                            dangerouslySetInnerHTML={{ __html: post.content.replace(/&nbsp;/g, ' ') }}
                        />

                        {/* Article Footer */}
                        <div className="mt-16 pt-8 border-t border-slate-200">
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Share2 size={20} /> Share this article
                            </h3>
                            <div className="flex gap-3">
                                <button className="p-3 rounded-full bg-slate-100 text-slate-600 hover:bg-[#1877F2] hover:text-white transition-colors">
                                    <Facebook size={20} />
                                </button>
                                <button className="p-3 rounded-full bg-slate-100 text-slate-600 hover:bg-[#1DA1F2] hover:text-white transition-colors">
                                    <Twitter size={20} />
                                </button>
                                <button className="p-3 rounded-full bg-slate-100 text-slate-600 hover:bg-[#0A66C2] hover:text-white transition-colors">
                                    <Linkedin size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Table of Contents Placeholder - Logic would go here */}
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 sticky top-32">
                            <h3 className="font-bold text-slate-900 mb-4">In this article</h3>
                            <ul className="space-y-3 text-sm">
                                <li>
                                    <a href="#" className="flex items-center gap-2 text-indigo-600 font-medium">
                                        <ChevronRight size={14} /> Introduction
                                    </a>
                                </li>
                                {/* This would be dynamic based on actual headings */}
                                <li>
                                    <a href="#" className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors">
                                        <ChevronRight size={14} className="opacity-0" /> Key Takeaways
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors">
                                        <ChevronRight size={14} className="opacity-0" /> Implementation Guide
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors">
                                        <ChevronRight size={14} className="opacity-0" /> Conclusion
                                    </a>
                                </li>
                            </ul>

                            <div className="mt-8 pt-8 border-t border-slate-200">
                                <p className="font-bold text-slate-900 mb-2">Need help with documents?</p>
                                <p className="text-slate-500 text-sm mb-4">DocForge streamlines your proposals and contracts.</p>
                                <Link to="/register" className="block text-center bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                                    Get Started Free
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default BlogPost;
