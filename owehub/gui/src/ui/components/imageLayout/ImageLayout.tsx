import React from 'react';
import './ImageLayout.css'; // Import your CSS file for styling
import { relative } from 'path';

interface ImageLayoutProps {
  images: string[]; // Array of image URLs
}

const ImageLayout: React.FC<ImageLayoutProps> = ({ images }) => {
  return (
    <div className="grid-container">
      <div className="leftView">
        {images.slice(0, 2).map((image, index) => (
          <div style={{ position: 'relative' }}>
            <object
              key={index}
              className="leftView"
              type="image/svg+xml"
              data={image}
              aria-label={`Left ${index + 1}`}
            ></object>
            <div className="bottamTextView">
              <div>
                <span>
                  {index === 1
                    ? 'Energy Bill Reduction'
                    : 'Easy, Transparent Partnership'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="centerView">
        <div style={{ position: 'relative' }}>
          <object
            type="image/svg+xml"
            data={images[2]}
            aria-label="Center"
          ></object>
          <div className="centerTextView">
            <div>
              <span>Best-in-Class Technology</span>
            </div>
          </div>
        </div>
      </div>
      <div className="rightView">
        {images.slice(3, 5).map((image, index) => (
          <div style={{ position: 'relative' }}>
            <object
              type="image/svg+xml"
              className="rightView"
              key={index}
              data={image}
              aria-label={`Right ${index + 1}`}
            ></object>
            <div className="bottamTextView">
              <div>
                <span>
                  {index === 1
                    ? 'Industry Leading Warranty'
                    : 'Expert Installation'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageLayout;
