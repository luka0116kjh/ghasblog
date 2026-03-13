import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { format } from 'date-fns';
import { Calendar, User, ChevronRight } from 'lucide-react';
import RepresentativeImage from '../components/RepresentativeImage';

const BlogList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const postsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setPosts(postsData);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>Loading...</div>;
    }

    return (
        <div className="container animate-fade-in">
            <h1 className="gradient-text">Journal</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>
                새로운 기술과 일상의 생각들을 공유합니다.
            </p>

            <div className="posts-grid">
                {posts.length > 0 ? (
                    posts.map(post => {
                        const preview = post.content
                            ? `${post.content.substring(0, 120)}...`
                            : '내용이 없습니다.';
                        return (
                            <Link key={post.id} to={`/blog/${post.id}`} className="card post-card">
                                {post.thumbnailUrl && (
                                    <div style={{ marginBottom: '1.5rem', width: '150px', height: '150px', margin: '0 auto 1.5rem' }}>
                                        <RepresentativeImage imageUrl={post.thumbnailUrl} />
                                    </div>
                                )}
                                <div className="post-meta">
                                    <span className="post-date">
                                        <Calendar size={14} />
                                        {post.createdAt ? format(post.createdAt.toDate(), 'yyyy. MM. dd') : 'Just now'}
                                    </span>
                                    <span className="post-author">
                                        <User size={14} />
                                        {post.author}
                                    </span>
                                </div>
                                <h2 className="post-title">{post.title}</h2>
                                <p className="post-excerpt">
                                    {preview}
                                </p>
                                <div className="post-tags">
                                    {post.tags?.map((tag, index) => (
                                        <span key={`${tag}-${index}`} className="tag">#{tag}</span>
                                    ))}
                                </div>
                                <div className="post-footer">
                                    Read More <ChevronRight size={16} />
                                </div>
                            </Link>
                        );
                    })
                ) : (
                    <div className="no-posts">
                        등록된 글이 아직 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogList;
