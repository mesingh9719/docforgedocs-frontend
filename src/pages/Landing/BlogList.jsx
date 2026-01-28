import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Clock, Star, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { getPublicPosts } from '../../api/cms';
import SEO from '../../components/SEO';

const BlogList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchPosts();
    }, [page]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const data = await getPublicPosts({ page });
            setPosts(data.data);
            setPagination({
                current_page: data.current_page,
                last_page: data.last_page,
                total: data.total
            });
        } catch (error) {
            console.error("Failed to fetch blog posts", error);
        } finally {
            setLoading(false);
        }
    };

    // Use the first post as detailed featured post if available
    const featuredPost = posts.length > 0 ? posts[0] : null;
    const gridPosts = posts.length > 0 ? posts.slice(1) : [];

    // Structured Data for Blog List
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "DocForge Blog",
        "description": "Insights on document workflows, agency growth, and product updates.",
        "url": "https://docforgedocs.com/blog",
        "blogPost": posts.map(post => ({
            "@type": "BlogPosting",
            "headline": post.title,
            "image": post.featured_image,
            "datePublished": post.published_at,
            "author": {
                "@type": "Person",
                "name": post.author?.name || 'DocForge Team'
            }
        }))
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <SEO
                title="Blog"
                description="Latest updates, guides, and insights from the DocForge team."
                url="/blog"
                jsonLd={jsonLd}
            />

            {/* Hero Section */}
            <div className="bg-white pt-32 pb-20 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-100">
                            The DocForge Log
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
                            Insights for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-500">Modern Agencies</span>
                        </h1>
                        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                            Discover strategies for efficient document workflows, business growth, and product updates straight from our team.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-slate-200 h-64 rounded-2xl mb-4"></div>
                                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Featured Post */}
                        {featuredPost && page === 1 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-16 group relative rounded-3xl overflow-hidden shadow-2xl bg-white grid lg:grid-cols-2"
                            >
                                <div className="absolute top-4 left-4 z-10">
                                    <span className="bg-white/90 backdrop-blur text-indigo-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                                        <Star size={12} className="fill-indigo-600" /> Featured
                                    </span>
                                </div>
                                <div className="relative h-64 lg:h-full overflow-hidden">
                                    {featuredPost.featured_image ? (
                                        <img
                                            src={featuredPost.featured_image}
                                            alt={featuredPost.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-indigo-50 flex items-center justify-center">
                                            <span className="text-indigo-200 font-bold text-6xl">DocForge</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-8 lg:p-12 flex flex-col justify-center">
                                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                                        <span className="text-indigo-600 font-bold">{featuredPost.category?.name || 'Update'}</span>
                                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                        <span>{new Date(featuredPost.published_at).toLocaleDateString()}</span>
                                    </div>
                                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">
                                        <Link to={`/blog/${featuredPost.slug}`}>
                                            {featuredPost.title}
                                        </Link>
                                    </h2>
                                    <p className="text-slate-600 text-lg mb-8 line-clamp-3">
                                        {featuredPost.summary || "Read the full article to learn more regarding this topic..."}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                                {featuredPost.author?.name?.[0] || 'D'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{featuredPost.author?.name || 'DocForge Team'}</p>
                                                <p className="text-xs text-slate-500">Author</p>
                                            </div>
                                        </div>
                                        <Link
                                            to={`/blog/${featuredPost.slug}`}
                                            className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-600 transition-colors"
                                        >
                                            Read Article <ArrowRight size={18} />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Recent Posts Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                            {(page === 1 ? gridPosts : posts).map((post, idx) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Link
                                        to={`/blog/${post.slug}`}
                                        className="group flex flex-col h-full bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                    >
                                        <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                                            {post.featured_image ? (
                                                <img
                                                    src={post.featured_image}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-300">
                                                    <span className="text-4xl font-bold opacity-20">DocForge</span>
                                                </div>
                                            )}
                                            {post.category && (
                                                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-600 shadow-sm border border-indigo-50">
                                                    {post.category.name}
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-6 flex flex-col flex-1">
                                            <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    {new Date(post.published_at).toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={14} />
                                                    5 min read
                                                </span>
                                            </div>
                                            <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                                {post.title}
                                            </h2>
                                            <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1 line-clamp-3 break-words">
                                                {post.summary?.replace(/&nbsp;/g, ' ') || "Read the full article to learn more..."}
                                            </p>
                                            <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
                                                <span className="text-slate-700 text-xs font-medium flex items-center gap-2">
                                                    By {post.author?.name || 'DocForge'}
                                                </span>
                                                <span className="text-indigo-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                                                    Read <ArrowRight size={16} />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* Newsletter CTA */}
                        <div className="mb-20 bg-slate-900 rounded-3xl p-8 md:p-12 relative overflow-hidden text-center md:text-left grid md:grid-cols-2 gap-8 items-center">
                            <div className="relative z-10">
                                <h3 className="text-3xl font-bold text-white mb-4">Stay ahead of the curve</h3>
                                <p className="text-slate-400 mb-8 text-lg">
                                    Join 5,000+ agency owners receiving our weekly insights on workflow optimization and growth.
                                </p>
                                <form className="flex flex-col sm:flex-row gap-3">
                                    <input
                                        type="email"
                                        placeholder="Enter your work email"
                                        className="bg-white/10 border border-white/20 text-white placeholder:text-slate-500 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1"
                                    />
                                    <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                                        <Mail size={18} /> Subscribe
                                    </button>
                                </form>
                            </div>
                            <div className="relative z-10 hidden md:block">
                                {/* Abstract pattern or illustration */}
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                            </div>
                        </div>


                        {/* Pagination */}
                        {pagination.last_page > 1 && (
                            <div className="flex justify-center gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 font-medium hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Previous
                                </button>
                                <span className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold min-w-[3rem] text-center">
                                    {pagination.current_page}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(pagination.last_page, p + 1))}
                                    disabled={page === pagination.last_page}
                                    className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 font-medium hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default BlogList;
