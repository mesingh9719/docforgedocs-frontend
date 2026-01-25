import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import { getPublicPostBySlug } from '../../api/cms';
import SEO from '../../components/SEO';

const BlogPost = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPost();
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

    return (
        <article className="min-h-screen bg-white pt-32 pb-24">
            <SEO
                title={post.seo_title || post.title}
                description={post.seo_description || post.summary}
                url={`/blog/${post.slug}`}
                image={post.featured_image}
                type="article"
                keywords={post.meta_keywords}
            />

            <div className="max-w-4xl mx-auto px-6">
                <Link to="/blog" className="inline-flex items-center gap-2 text-slate-500 font-bold text-sm hover:text-indigo-600 mb-8 transition-colors">
                    <ArrowLeft size={16} /> Back to Blog
                </Link>

                {post.category && (
                    <span className="inline-block bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                        {post.category.name}
                    </span>
                )}

                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                    {post.title}
                </h1>

                <div className="flex items-center gap-6 text-slate-500 border-b border-slate-100 pb-8 mb-8">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                            {post.author?.avatar_url ? (
                                <img src={post.author.avatar_url} alt={post.author.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="font-bold text-xs text-slate-500">{post.author?.name?.[0]}</span>
                            )}
                        </div>
                        <span className="font-medium text-slate-900 text-sm">{post.author?.name}</span>
                    </div>
                    <span className="flex items-center gap-2 text-sm">
                        <Calendar size={16} />
                        {new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>

                {post.featured_image && (
                    <div className="aspect-video w-full rounded-2xl overflow-hidden mb-12 shadow-lg">
                        <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                )}

                <div
                    className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-indigo-600 hover:prose-a:text-indigo-500 prose-img:rounded-xl"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Footer / Share / Tags could go here */}
            </div>
        </article>
    );
};

export default BlogPost;
