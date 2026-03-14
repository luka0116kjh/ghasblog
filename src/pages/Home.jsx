import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, limit, orderBy, getDocs } from 'firebase/firestore';
import { ArrowRight, Layout as LayoutIcon, Utensils } from 'lucide-react';
import RepresentativeImage from '../components/RepresentativeImage';

const Home = () => {
    const [recentPosts, setRecentPosts] = useState([]);

    useEffect(() => {
        const fetchRecentPosts = async () => {
            try {
                const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(4));
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
                    <a href="https://ghas-h.goesh.kr/ghas-h/main.do" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-lg">
                        <LayoutIcon size={20} /> 경자고 홈페이지
                    </a>
                    <a href="https://ghaslunch1.web.app/" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-lg">
                        <Utensils size={20} /> 경자고 급식
                    </a>
                </div>
            </section>

            {recentPosts.length > 0 && (
                <section className="recent-posts container">
                    <div className="section-header">
                        <h2>Recent Posts</h2>
                        <Link to="/blog" className="view-all">View all <ArrowRight size={16} /></Link>
                    </div>
                    <div className="circle-post-grid home-circle-grid">
                        {recentPosts.map(post => {
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
                                    <span className="circle-post-date">
                                        {post.createdAt ? new Date(post.createdAt.toDate()).toLocaleDateString() : 'Just now'}
                                    </span>
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
