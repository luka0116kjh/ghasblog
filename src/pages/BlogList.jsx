import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { format } from 'date-fns';
import { Calendar, Search } from 'lucide-react';
import RepresentativeImage from '../components/RepresentativeImage';

const CATEGORIES = [
    'All',
    'GHAS 학교 소개',
    'GHAS 보도자료',
    'GHAS 소식',
    'GHAS 인터뷰',
];

const BlogList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

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

    const filteredPosts = posts.filter(post => {
        const searchLower = searchTerm.toLowerCase();
        const titleMatch = post.title.toLowerCase().includes(searchLower);
        const tagMatch = post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchLower));
        const matchesSearch = titleMatch || tagMatch;
        const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="container animate-fade-in">
            <h1 className="gradient-text">Journal</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                새로운 기술과 일상의 생각들을 공유합니다.
            </p>

            <div className="search-container">
                <div className="search-input-wrapper">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="제목이나 태그로 검색해보세요..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="category-tabs">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="circle-post-grid">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map(post => {
                        return (
                            <Link key={post.id} to={`/blog/${post.id}`} className="circle-post-card">
                                <div className={`circle-post-thumb${post.thumbnailUrl ? '' : ' no-image'}`}>
                                    {post.thumbnailUrl ? (
                                        <RepresentativeImage imageUrl={post.thumbnailUrl} className="circle-thumb" />
                                    ) : (
                                        <div className="circle-thumb-placeholder">이미지 없음</div>
                                    )}
                                </div>
                                <div className="circle-post-category">{post.category || '기타'}</div>
                                <h3 className="circle-post-title">{post.title}</h3>
                                <div className="circle-post-date">
                                    <Calendar size={14} />
                                    {post.createdAt ? format(post.createdAt.toDate(), 'yyyy. MM. dd') : 'Just now'}
                                </div>
                            </Link>
                        );
                    })
                ) : searchTerm ? (
                    <div className="no-posts" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                        검색 결과가 없습니다.
                    </div>
                ) : (
                    <div className="no-posts" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                        등록된 글이 아직 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogList;
