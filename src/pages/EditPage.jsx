import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Send, Tag as TagIcon, Image as ImageIcon, Upload } from 'lucide-react';

const EditPage = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();
    const textareaRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

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

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const docRef = doc(db, 'posts', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (user && user.uid !== data.authorId && !isAdmin) {
                        alert('게시물을 수정할 권한이 없습니다.');
                        navigate(`/blog/${id}`);
                        return;
                    }
                    setTitle(data.title);
                    setContent(data.content);
                    setTags(data.tags ? data.tags.join(', ') : '');
                    setThumbnailUrl(data.thumbnailUrl || '');
                } else {
                    alert('게시물을 찾을 수 없습니다.');
                    navigate('/blog');
                }
            } catch (error) {
                console.error('Error fetching post:', error);
                alert('게시물을 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchPost();
        }
    }, [id, navigate, user, isAdmin]);

    if (!user) {
        return (
            <div className="container">
                <div className="card" style={{ textAlign: 'center' }}>
                    <h2>Access Denied</h2>
                    <p>로그인한 사용자만 글을 수정할 수 있습니다.</p>
                    <button onClick={() => navigate('/login')} className="btn btn-primary">Go to Login</button>
                </div>
            </div>
        );
    }

    if (loading) {
        return <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>Loading...</div>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !content) return alert('제목과 내용을 입력해주세요.');

        setSaving(true);
        try {
            const docRef = doc(db, 'posts', id);
            await updateDoc(docRef, {
                title,
                content,
                tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                thumbnailUrl,
                updatedAt: new Date(),
            });
            alert('글이 성공적으로 수정되었습니다!');
            navigate(`/blog/${id}`);
        } catch (error) {
            console.error('Error updating document: ', error);
            alert('글 수정 중 오류가 발생했습니다.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="container animate-fade-in">
            <div className="card">
                <h1 className="gradient-text">Edit Post</h1>
                <form onSubmit={handleSubmit} className="write-form">
                    <div className="form-layout">
                        <div className="form-main">
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
                                    placeholder="내용을 기록해보세요..."
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
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            <Send size={18} />
                            {saving ? 'Saving...' : 'Update Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPage;
