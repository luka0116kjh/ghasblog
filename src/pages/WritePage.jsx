import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Send, Tag as TagIcon, Image as ImageIcon, Upload } from 'lucide-react';

const CATEGORIES = [
    'GHAS 학교 소개',
    'GHAS 보도자료',
    'GHAS 소식',
    'GHAS 인터뷰',
];

const WritePage = () => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [content, setContent] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const textareaRef = useRef(null);
    const [tags, setTags] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Firestore 문서 최대 크기는 1MB입니다. Base64 변환 시 용량이 약 33% 증가하므로 안전하게 500KB로 제한합니다.
        if (file.size > 500 * 1024) {
            alert('이미지 크기는 500KB 이하여야 합니다.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setThumbnailUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };

    if (!user) {
        return (
            <div className="container">
                <div className="card" style={{ textAlign: 'center' }}>
                    <h2>Access Denied</h2>
                    <p>로그인한 사용자만 글을 작성할 수 있습니다.</p>
                    <button onClick={() => navigate('/login')} className="btn btn-primary">Go to Login</button>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !content) return alert('제목과 내용을 입력해주세요.');

        setLoading(true);
        try {
            await addDoc(collection(db, 'posts'), {
                title,
                category,
                content,
                tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                thumbnailUrl,
                author: user.displayName || user.email.split('@')[0],
                authorId: user.uid,
                createdAt: serverTimestamp(),
            });
            alert('글이 성공적으로 등록되었습니다!');
            navigate('/blog');
        } catch (error) {
            console.error('Error adding document: ', error);
            alert('글 등록 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container animate-fade-in">
            <div className="card">
                <h1 className="gradient-text">Create Post</h1>
                <form onSubmit={handleSubmit} className="write-form">
                    <div className="form-layout">
                        <div className="form-main">
                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    className="form-select"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    placeholder="멋진 제목을 지어보세요"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Tags (Comma separated)</label>
                                <div className="input-with-icon">
                                    <TagIcon className="input-icon" size={18} />
                                    <input
                                        type="text"
                                        placeholder="React, Firebase, Web..."
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label style={{ marginBottom: '0.75rem' }}>Content (Markdown supported)</label>
                                <textarea
                                    ref={textareaRef}
                                    placeholder="기록하고 싶은 내용을 Markdown 형식으로 적어보세요..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    required
                                    style={{ minHeight: '400px' }}
                                />
                            </div>
                        </div>

                        <div className="form-sidebar">
                            <div className="form-group">
                                <label>Representative Image</label>
                                <div
                                    className="thumbnail-upload-area"
                                    onClick={() => document.getElementById('image-input').click()}
                                >
                                    {thumbnailUrl ? (
                                        <div className="thumbnail-preview-container">
                                            <img src={thumbnailUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            <div className="thumbnail-overlay">
                                                <Upload size={24} />
                                                <span>Change Image</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="upload-placeholder">
                                            <ImageIcon size={48} />
                                            <p>Click to upload</p>
                                            <p style={{ fontSize: '0.8rem' }}>Max 500KB</p>
                                        </div>
                                    )}
                                    <input
                                        id="image-input"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={() => navigate(-1)} className="btn btn-ghost">
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            <Send size={18} />
                            {loading ? 'Publishing...' : 'Publish Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WritePage;
