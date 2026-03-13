import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, limit, orderBy, getDocs } from 'firebase/firestore';
import { ArrowRight, Layout as LayoutIcon, Code } from 'lucide-react';
import RepresentativeImage from '../components/RepresentativeImage';

const Home = () => {
    const [recentPosts, setRecentPosts] = useState([]);

    useEffect(() => {
        const fetchRecentPosts = async () => {
            try {
                const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(3));
                const querySnapshot = await getDocs(q);
                const postsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setRecentPosts(postsData);
            } catch (error) {
                console.error('Error fetching recent posts:', error);
            }
        };
        fetchRecentPosts();
    }, []);

    return (
        <div className="home-container animate-fade-in">
            <section className="hero container">
                <h1 className="hero-title">
                    Gyeonggi High School <br />
                    <span className="gradient-text">of Automotive Science</span>
                </h1>
                <p className="hero-subtitle">
                    경기자동차과학고등학교 학생들을 위한 기술 블로그입니다. <br />
                    학교관련 소식과 다양한 정보들을 공유합니다.
                </p>
                <div className="hero-actions">
                    <Link to="/blog" className="btn btn-primary btn-lg">
                        시작하기
                        <ArrowRight size={20} />
                    </Link>
                    <a href="https://ghas-h.goesh.kr/ghas-h/main.do" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-lg" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <LayoutIcon size={20} /> 경자고 홈페이지
                    </a>
                </div>
            </section>

            <section className="features container">
                <div className="feature-card">
                    <LayoutIcon className="feature-icon" size={32} />
                    <h3>Modern UI</h3>
                    <p>Glassmorphism 스타일과 세련된 애니메이션으로 사용자 경험을 극대화했습니다.</p>
                </div>
                <div className="feature-card">
                    <Code className="feature-icon" size={32} />
                    <h3>Markdown Ready</h3>
                    <p>글 작성 시 Markdown 형식을 지원하여 코드와 텍스트를 깔끔하게 표현할 수 있습니다.</p>
                </div>
            </section>

            {recentPosts.length > 0 && (
                <section className="recent-posts container">
                    <div className="section-header">
                        <h2>Recent Posts</h2>
                        <Link to="/blog" className="view-all">View all <ArrowRight size={16} /></Link>
                    </div>
                    <div className="posts-grid">
                        {recentPosts.map(post => {
                            const preview = post.content
                                ? `${post.content.substring(0, 80)}...`
                                : '내용이 없습니다.';
                            return (
                                <Link key={post.id} to={`/blog/${post.id}`} className="card post-card compact">
                                    {post.thumbnailUrl && (
                                        <div style={{ marginBottom: '1rem', width: '100px', height: '100px', margin: '0 auto 1rem' }}>
                                            <RepresentativeImage imageUrl={post.thumbnailUrl} />
                                        </div>
                                    )}
                                    <span className="post-date" style={{ textAlign: 'center', display: 'block' }}>
                                        {post.createdAt ? new Date(post.createdAt.toDate()).toLocaleDateString() : 'Just now'}
                                    </span>
                                    <h3 style={{ textAlign: 'center' }}>{post.title}</h3>
                                    <p style={{ textAlign: 'center' }}>{preview}</p>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            )}
        </div>
    );
};

export default Home;
