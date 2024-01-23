import React from "react";
import "./ImageLayout.css"; // Import your CSS file for styling
import { relative } from "path";

interface ImageLayoutProps {
  images: string[]; // Array of image URLs
}

const ImageLayout: React.FC<ImageLayoutProps> = ({ images }) => {
  return (
    <div className="grid-container">
      <div className="leftView">
        {images.slice(0, 2).map((image, index) => (
          <div style={{ position: "relative" }}>
            <img
              className="leftView"
              key={index}
              src={image}
              alt={`Left Image ${index + 1}`}
            />
            <div className="bottamTextView">
              <div>
                <span>
                  {index == 1
                    ? "Energy Bill Reduction"
                    : "Easy, Transparent Partnership"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="centerView">
        <div style={{ position: "relative" }}>
          <img src={images[2]} alt="Center Image" />
          <div className="centerTextView">
            <div>
              <span>Best-in-ClassTechnology</span>
            </div>
          </div>
        </div>
      </div>
      <div className="rightView">
        {images.slice(3, 5).map((image, index) => (
          <div style={{ position: "relative" }}>
            <img
              className="rightView"
              key={index}
              src={image}
              alt={`Right Image ${index + 1}`}
            />
            <div className="bottamTextView">
              <div>
                <span>
                  {index == 1
                    ? "Industry Leading Warranty"
                    : "Expert Installation"}
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
