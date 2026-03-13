import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { Calendar, User, ArrowLeft, Tag as TagIcon, Trash2, Edit3 } from 'lucide-react';
import RepresentativeImage from '../components/RepresentativeImage';
import { useAuth } from '../context/AuthContext';

const BlogDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const docRef = doc(db, 'posts', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setPost({ id: docSnap.id, ...docSnap.data() });
                } else {
                    console.log("No such document!");
                    navigate('/blog');
                }
            } catch (error) {
                console.error("Error fetching post:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id, navigate]);

    const handleDelete = async () => {
        if (!window.confirm('정말로 이 게시물을 삭제하시겠습니까?')) return;

        setIsDeleting(true);
        try {
            await deleteDoc(doc(db, 'posts', id));
            alert('게시물이 삭제되었습니다.');
            navigate('/blog');
        } catch (error) {
            console.error("Error deleting post:", error);
            alert('삭제 중 오류가 발생했습니다.');
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) {
        return <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>Loading...</div>;
    }

    if (!post) return null;

    return (
        <div className="container animate-fade-in">
            <button onClick={() => navigate(-1)} className="btn-icon" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ArrowLeft size={20} />
                Back to list
            </button>

            <article className="blog-post">
                {post.thumbnailUrl && (
                    <div style={{ maxWidth: '600px', margin: '0 auto 3rem' }}>
                        <RepresentativeImage imageUrl={post.thumbnailUrl} />
                    </div>
                )}

                <header className="post-header-detail">
                    <div className="post-meta">
                        <span>
                            <Calendar size={16} />
                            {post.createdAt ? format(post.createdAt.toDate(), 'MMMM dd, yyyy') : 'Just now'}
                        </span>
                        <span>
                            <User size={16} />
                            {post.author}
                        </span>
                    </div>
                    <h1 className="post-title-detail gradient-text">{post.title}</h1>
                    <div className="post-tags">
                        {post.tags?.map((tag, index) => (
                            <span key={`${tag}-${index}`} className="tag">
                                <TagIcon size={12} style={{ marginRight: '4px' }} />
                                {tag}
                            </span>
                        ))}
                    </div>
                </header>

                <div className="card markdown-body">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>

                {user && (
                    <div className="post-actions" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <Link
                            to={`/edit/${id}`}
                            className="btn btn-ghost"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <Edit3 size={18} />
                            Edit Post
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="btn btn-ghost"
                            style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            disabled={isDeleting}
                        >
                            <Trash2 size={18} />
                            {isDeleting ? 'Deleting...' : 'Delete Post'}
                        </button>
                    </div>
                )}
            </article>
        </div>
    );
};

export default BlogDetail;
