import React from 'react';
import './RepresentativeImage.css';

const RepresentativeImage = ({ imageUrl, className = "" }) => {
    return (
        <div className={`rep-image-container ${className}`}>
            <img src={imageUrl} alt="Representative image" className="rep-image" />
        </div>
    );
};

export default RepresentativeImage;
