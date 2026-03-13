import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
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

            <div className="circle-post-grid">
                {posts.length > 0 ? (
                    posts.map(post => {
                        return (
                            <Link key={post.id} to={`/blog/${post.id}`} className="circle-post-card">
                                <div className={`circle-post-thumb${post.thumbnailUrl ? '' : ' no-image'}`}>
                                    {post.thumbnailUrl ? (
                                        <RepresentativeImage imageUrl={post.thumbnailUrl} className="circle-thumb" />
                                    ) : (
                                        <div className="circle-thumb-placeholder">이미지 없음</div>
                                    )}
                                </div>
                                <h3 className="circle-post-title">{post.title}</h3>
                                <div className="circle-post-date">
                                    <Calendar size={14} />
                                    {post.createdAt ? format(post.createdAt.toDate(), 'yyyy. MM. dd') : 'Just now'}
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
