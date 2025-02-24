import React, { useState, useEffect } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { FaXmark } from 'react-icons/fa6';
import { RiDeleteBin6Line, RiDownloadCloudLine } from 'react-icons/ri';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import MicroLoader from '../../components/loader/MicroLoader';
import DeleteImagePopUp from './DeleteImagePopUp';
import styles from '../styles/StructuralPage.module.css';

interface ImageData {
  url: string;
  file: File;
}

interface ImageSectionProps {
  images: ImageData[];
  onRemove: (index: number) => void;
  onView: (url: string) => void;
  isUploading: boolean;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface ImageViewerProps {
    viewerImageInfo: {
      mainUrl: string;
      allImages: ImageData[];
    } | null;
    onClose: () => void;
    onRemove: (index: number) => void;
    onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }

  const ImageViewer: React.FC<ImageViewerProps> = ({
    viewerImageInfo,
    onClose,
    onRemove,
    onImageUpload
  }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [startIndex, setStartIndex] = useState(0);
    const [localImages, setLocalImages] = useState<ImageData[]>([]);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(null);
    const displayCount = 3;
  
    useEffect(() => {
      if (viewerImageInfo) {
        setLocalImages([...viewerImageInfo.allImages]);
        const index = viewerImageInfo.allImages.findIndex(
          img => img.url === viewerImageInfo.mainUrl
        );
        if (index !== -1) {
          setCurrentIndex(index);
          if (index < startIndex) {
            setStartIndex(index);
          } else if (index >= startIndex + displayCount) {
            setStartIndex(Math.max(0, index - displayCount + 1));
          }
        }
      }
    }, [viewerImageInfo?.allImages]);
  
    if (!viewerImageInfo || localImages.length === 0) return null;
  
    const handleDownload = async (imageData: ImageData) => {
      try {
        const response = await fetch(imageData.url);
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = imageData.file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      } catch (error) {
        console.error('Download failed:', error);
      }
    };
  
    const handleDelete = (index: number) => {
      setPendingDeleteIndex(index);
      setShowDeletePopup(true);
    };
  
    // const handleDeleteConfirm = (shouldDelete: boolean) => {
    //   if (shouldDelete && pendingDeleteIndex !== null) {
    //     const newImages = [...localImages];
    //     newImages.splice(pendingDeleteIndex, 1);
        
    //     if (newImages.length === 0) {
    //       onRemove(pendingDeleteIndex);
    //       onClose();
    //       return;
    //     }
        
    //     let newCurrentIndex = currentIndex;
    //     if (pendingDeleteIndex === currentIndex) {
    //       newCurrentIndex = pendingDeleteIndex < newImages.length ? pendingDeleteIndex : Math.max(0, newImages.length - 1);
    //     } else if (pendingDeleteIndex < currentIndex) {
    //       newCurrentIndex--;
    //     }
        
    //     setLocalImages(newImages);
    //     setCurrentIndex(Math.max(0, Math.min(newCurrentIndex, newImages.length - 1)));
    //     onRemove(pendingDeleteIndex);
    //   }
    //   setShowDeletePopup(false);
    //   setPendingDeleteIndex(null);
    // };

    const handleDeleteConfirm = async (shouldDelete: boolean) => {
        if (shouldDelete && pendingDeleteIndex !== null) {
          try {
            // Get the image URL
            const imageToDelete = localImages[pendingDeleteIndex];
            
            // Extract the key from the S3 URL
            // Assuming URL format: https://bucket-name.s3.region.amazonaws.com/datTool-images/filename
            const urlParts = imageToDelete.url.split('/datTool-images/');
            if (urlParts.length !== 2) {
              throw new Error('Invalid S3 URL format');
            }
            const key = `datTool-images/${urlParts[1]}`;
    
            // Call the parent onRemove which should handle the S3 deletion
            await onRemove(pendingDeleteIndex);
    
            // Update local state
            const newImages = [...localImages];
            newImages.splice(pendingDeleteIndex, 1);
            
            if (newImages.length === 0) {
              onClose();
              return;
            }
            
            let newCurrentIndex = currentIndex;
            if (pendingDeleteIndex === currentIndex) {
              newCurrentIndex = pendingDeleteIndex < newImages.length ? pendingDeleteIndex : Math.max(0, newImages.length - 1);
            } else if (pendingDeleteIndex < currentIndex) {
              newCurrentIndex--;
            }
            
            setLocalImages(newImages);
            setCurrentIndex(Math.max(0, Math.min(newCurrentIndex, newImages.length - 1)));
          } catch (error) {
            console.error('Failed to delete image:', error);
            // You might want to show an error toast here
          }
        }
        setShowDeletePopup(false);
        setPendingDeleteIndex(null);
      };
  
    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files ? Array.from(event.target.files) : [];
      if (files.length === 0) return;
    
      await onImageUpload(event);
    
      const newImages: ImageData[] = files.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));
    
      setLocalImages((prevImages) => [...prevImages, ...newImages]);
    };
  
    const moveCarousel = (direction: 'next' | 'prev'): void => {
      setStartIndex(prev => {
        if (direction === 'next') {
          return Math.min(prev + 1, localImages.length - displayCount);
        } else {
          return Math.max(prev - 1, 0);
        }
      });
    };
  
    const needsCarousel = localImages.length > displayCount;
    const canScrollPrev = startIndex > 0;
    const canScrollNext = startIndex < localImages.length - displayCount;
    const visibleThumbnails = needsCarousel
      ? localImages.slice(startIndex, startIndex + displayCount)
      : localImages;
  
    const currentImage = localImages[currentIndex];
    const mainUrl = currentImage ? currentImage.url : '';
  
    return (
      <>
        {showDeletePopup && (
          <DeleteImagePopUp setDeleteImage={handleDeleteConfirm} />
        )}
        <div className={styles.imageViewerContainer}>
          <div className={styles.imageViewer}>
            {currentImage && (
              <img
                className={`${styles.viewerImage} ${styles.currentlyViewedImage}`}
                src={mainUrl}
                alt="Enlarged view"
              />
            )}
            <div className={styles.imageViewerButtons}>
              <button
                className={styles.imageViewerButton}
                onClick={() => {
                  if (currentImage) {
                    handleDownload(currentImage);
                  }
                }}
              >
                <RiDownloadCloudLine />
              </button>
              <button
                className={styles.imageViewerButton}
                onClick={() => handleDelete(currentIndex)}
              >
                <RiDeleteBin6Line />
              </button>
              <button
                className={styles.imageViewerButton}
                onClick={onClose}
              >
                <FaXmark />
              </button>
            </div>
          </div>
  
          <div className={styles.carouselContainer}>
            <div
              onClick={() => canScrollPrev && moveCarousel('prev')}
              className={`${styles.iconContainer} ${!canScrollPrev && styles.iconContainerDisabled}`}
              aria-label="Previous images"
            >
              <FiChevronLeft />
            </div>
  
            <div className={styles.thumbnailsRow}>
              {visibleThumbnails.map((img, index) => {
                const isCurrentImage = currentIndex === startIndex + index;
                return (
                  <div 
                    key={`${img.url}-${startIndex + index}`} 
                    className={`${styles.thumbnail} ${isCurrentImage ? styles.activeThumbnail : ''}`}
                  >
                    <button
                      className={styles.thumbnailRemoveButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(startIndex + index);
                      }}
                    >
                      <FaXmark />
                    </button>
                    <img
                      src={img.url}
                      alt={`Thumbnail ${startIndex + index}`}
                      onClick={() => setCurrentIndex(startIndex + index)}
                      className={isCurrentImage ? styles.currentlyViewedThumbnail : ''}
                    />
                  </div>
                );
              })}
            </div>
  
            <div
              onClick={() => canScrollNext && moveCarousel('next')}
              className={`${styles.iconContainer} ${!canScrollNext && styles.iconContainerDisabled}`}
              aria-label="Next images"
            >
              <FiChevronRight />
            </div>
  
            <div>
              <label htmlFor="viewerImageUpload" style={{ cursor: 'pointer' }}>
                <div className={styles.UploadIconThumbnail}>
                  <IoMdAdd />
                </div>
              </label>
              <input
                id="viewerImageUpload"
                type="file"
                multiple
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
            </div>
          </div>
        </div>
      </>
    );
  };

// export default ImageViewer;

const ImageSection: React.FC<ImageSectionProps> = ({
  images,
  onRemove,
  onView,
  isUploading,
  onImageUpload,
}) => {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(null);

  const handleRemove = (index: number) => {
    setPendingDeleteIndex(index);
    setShowDeletePopup(true);
  };

  const handleDeleteConfirm = async (shouldDelete: boolean) => {
    if (shouldDelete && pendingDeleteIndex !== null) {
      try {
        // Get the image URL
        const imageToDelete = images[pendingDeleteIndex];
        
        // Extract the key from the S3 URL
        const urlParts = imageToDelete.url.split('/datTool-images/');
        if (urlParts.length !== 2) {
          throw new Error('Invalid S3 URL format');
        }
        const key = `datTool-images/${urlParts[1]}`;

        // Call the parent onRemove which should handle the S3 deletion
        await onRemove(pendingDeleteIndex);
      } catch (error) {
        console.error('Failed to delete image:', error);
        // You might want to show an error toast here
      }
    }
    setShowDeletePopup(false);
    setPendingDeleteIndex(null);
  };

  if (isUploading) {
    return (
      <div className={styles.uploadImage}>
        <MicroLoader />
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className={styles.uploadImage}>
        <div className={styles.imagePreviewContainer}></div>
        <div>
          <label htmlFor="imageUpload" style={{ cursor: 'pointer' }}>
            <div className={styles.UploadIcon}>
              <IoMdAdd />
            </div>
          </label>
          <input
            id="imageUpload"
            type="file"
            multiple
            accept="image/*"
            style={{ display: 'none' }}
            onChange={onImageUpload}
          />
        </div>
        <div className={styles.UploadIconContent}>
          <p className={styles.UploadHeading}>Upload Image</p>
          <p className={styles.UploadParagraph}>Click to upload files</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showDeletePopup && (
        <DeleteImagePopUp setDeleteImage={handleDeleteConfirm} />
      )}
<div
  className={`${styles.uploadImage} ${
    images.length === 1
      ? styles.uploadImageSingle
      : images.length > 1
      ? styles.uploadImageWithImages
      : ""
  }`}
>        {/* <div className={styles.imagePreviewContainer}> */}
          <div className={styles.imagePreview}>
            <button
              className={styles.removeImageButton}
              onClick={() => handleRemove(0)}
            >
              <FaXmark />
            </button>
            <img
              src={images[0].url}
              alt="Main preview"
              className={styles.previewImage}
              onError={(e) => {
                console.error('Image failed to load:', images[0].url);
                e.currentTarget.alt = 'Failed to load image';
              }}
            />
            <p
              className={styles.imageView}
              onClick={() => onView(images[0].url)}
            >
              View
            </p>
          </div>
          {images.length > 1 && (
            <div className={styles.imagePreview}>
              <button
                className={styles.removeImageButton}
                onClick={() => handleRemove(1)}
              >
                <FaXmark />
              </button>
              <img
                src={images[1].url}
                alt="Stack preview"
                className={styles.previewImage}
                onError={(e) => {
                  console.error('Image failed to load:', images[1].url);
                  e.currentTarget.alt = 'Failed to load image';
                }}
              />
              {images.length > 2 && (
                <span className={styles.stackCount}>+{images.length - 1}</span>
              )}
              <p
                className={styles.imageView}
                onClick={() => onView(images[1].url)}
              >
                View All
              </p>
            </div>
          )}
        {/* </div> */}
        <div>
          <label htmlFor="imageUpload" style={{ cursor: 'pointer' }}>
            <div className={styles.UploadIcon}>
              <IoMdAdd />
            </div>
          </label>
          <input
            id="imageUpload"
            type="file"
            multiple
            accept="image/*"
            style={{ display: 'none' }}
            onChange={onImageUpload}
          />
        </div>
      </div>
    </>
  );
};

export default ImageSection;
export { ImageViewer };