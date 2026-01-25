import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Clock } from 'lucide-react';
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

    return (
        <div className="min-h-screen bg-white pt-32 pb-24">
            <SEO
                title="Blog"
                description="Latest updates, guides, and insights from the DocForge team."
                url="/blog"
            />

            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Our Blog</h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                        Insights on document workflows, agency growth, and product updates.
                    </p>
                </div>

                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-slate-200 h-48 rounded-2xl mb-4"></div>
                                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                            {posts.map((post) => (
                                <Link
                                    key={post.id}
                                    to={`/blog/${post.slug}`}
                                    className="group flex flex-col h-full bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className="aspect-[16/9] overflow-hidden bg-slate-200 relative">
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
                                            <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-600 shadow-sm">
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
                                        <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                                            {post.summary || "Read the full article to learn more..."}
                                        </p>
                                        <div className="flex items-center justify-between pt-6 border-t border-slate-200 mt-auto">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                                    {post.author?.name?.[0] || 'D'}
                                                </div>
                                                <span className="text-xs font-medium text-slate-700">{post.author?.name || 'DocForge Team'}</span>
                                            </div>
                                            <span className="text-indigo-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                                                Read Post <ArrowRight size={16} />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.last_page > 1 && (
                            <div className="flex justify-center gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="px-4 py-2 text-slate-500 font-medium">
                                    Page {pagination.current_page} of {pagination.last_page}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(pagination.last_page, p + 1))}
                                    disabled={page === pagination.last_page}
                                    className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
