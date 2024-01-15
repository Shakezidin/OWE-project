import React from "react";
import "./ImageLayout.css"; // Import your CSS file for styling

interface ImageLayoutProps {
  images: string[]; // Array of image URLs
}

const ImageLayout: React.FC<ImageLayoutProps> = ({ images }) => {
  return (
    <div className="grid-container">
      <div className="leftView">
        {images.slice(0, 2).map((image, index) => (
          <img
            className="leftView"
            key={index}
            src={image}
            alt={`Left Image ${index + 1}`}
          />
        ))}
      </div>
      <div className="centerView">
        <img src={images[2]} alt="Center Image" />
      </div>
      <div className="rightView">
        {images.slice(3, 5).map((image, index) => (
          <img
            className="rightView"
            key={index}
            src={image}
            alt={`Right Image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageLayout;
