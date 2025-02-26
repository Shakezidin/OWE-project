import React, { useState, useEffect } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { FaXmark } from 'react-icons/fa6';
import { RiDeleteBin6Line, RiDownloadCloudLine } from 'react-icons/ri';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import MicroLoader from '../../components/loader/MicroLoader';
import DeleteImagePopUp from './DeleteImagePopUp';
import styles from '../styles/StructuralPage.module.css';
import { MdOutlineCheckBoxOutlineBlank, MdCheckBox } from 'react-icons/md';
import { ImCheckboxChecked, ImCheckboxUnchecked, ImRadioChecked, ImRadioUnchecked } from 'react-icons/im';

interface ImageData {
  url: string;
  file: File;
}

interface ImageSectionProps {
  images: ImageData[];
  onRemove: (index: number, skipToast?: boolean) => void;
  onMultipleRemove?: (indices: number[]) => void; // New prop for batch deletion
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
  onRemove: (index: number, skipToast?: boolean) => void;
  onMultipleRemove?: (indices: number[]) => void; // New prop for batch deletion
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  viewerImageInfo,
  onClose,
  onRemove,
  onMultipleRemove,
  onImageUpload
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [localImages, setLocalImages] = useState<ImageData[]>([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(null);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [multipleDeleteMode, setMultipleDeleteMode] = useState(false);
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

  useEffect(() => {
    // Reset selection when images change
    setSelectedImages([]);
    setMultipleDeleteMode(false);
  }, [localImages]);

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

  const handleMultipleDelete = () => {
    if (selectedImages.length > 0) {
      setMultipleDeleteMode(true);
      setShowDeletePopup(true);
    }
  };

  const handleDeleteConfirm = async (shouldDelete: boolean) => {
    if (shouldDelete) {
      if (multipleDeleteMode && selectedImages.length > 0) {
        try {
          // Sort indices in descending order to avoid index shifting problems during deletion
          const sortedIndices = [...selectedImages].sort((a, b) => b - a);
          
          // Use the batch deletion function if available
          if (onMultipleRemove) {
            await onMultipleRemove(sortedIndices);
          } else {
            // Fallback to individual deletion with a single toast at the end
            for (let i = 0; i < sortedIndices.length; i++) {
              const index = sortedIndices[i];
              const isLast = i === sortedIndices.length - 1;
              try {
                await onRemove(index, !isLast); // Skip toast for all but the last one
              } catch (error) {
                console.error(`Failed to delete image at index ${index}:`, error);
              }
            }
          }
          
          // Update local state after deletion
          const newImages = localImages.filter((_, index) => !selectedImages.includes(index));
          
          if (newImages.length === 0) {
            onClose();
            return;
          }
          
          // Adjust current index if needed
          let newCurrentIndex = 0; // default to first image
          if (currentIndex < newImages.length && !selectedImages.includes(currentIndex)) {
            newCurrentIndex = currentIndex;
          }
          
          setLocalImages(newImages);
          setCurrentIndex(newCurrentIndex);
          setSelectedImages([]);
          
        } catch (error) {
          console.error('Failed to delete multiple images:', error);
        }
      } else if (pendingDeleteIndex !== null) {
        try {
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
        }
      }
    }
    setShowDeletePopup(false);
    setPendingDeleteIndex(null);
    setMultipleDeleteMode(false);
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

  const toggleImageSelection = (index: number) => {
    setSelectedImages(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const selectAllImages = () => {
    // Select all images
    setSelectedImages(localImages.map((_, index) => index));
  };

  const deselectAllImages = () => {
    // Deselect all images
    setSelectedImages([]);
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
  const hasSelectedImages = selectedImages.length > 0;

  return (
    <>
      {showDeletePopup && (
        <DeleteImagePopUp 
          setDeleteImage={handleDeleteConfirm} 
          multipleDelete={multipleDeleteMode}
          count={multipleDeleteMode ? selectedImages.length : 1}
        />
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
            {selectedImages.length > 0 ? (
              <button
                className={styles.imageViewerButton}
                onClick={handleMultipleDelete}
              >
                <RiDeleteBin6Line />
              </button>
            ) : (
              <button
                className={styles.imageViewerButton}
                onClick={() => handleDelete(currentIndex)}
              >
                <RiDeleteBin6Line />
              </button>
            )}
            <button
              className={styles.imageViewerButton}
              onClick={onClose}
            >
              <FaXmark />
            </button>
          </div>

          <div className={styles.selectAllContainer}>
            {hasSelectedImages ? (
              <div className={styles.deselectContainer}>
                <button 
                  className={styles.imageViewerButton}
                  onClick={deselectAllImages}
                >
                  <FaXmark/>
                </button>
                <span className={styles.deselectText}>
                  {selectedImages.length} items selected
                </span>
              </div>
            ) : (
              <div
              className={styles.selectAllButton}
                onClick={selectAllImages}
              >
                Select All
              </div>
            )}
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
              const absoluteIndex = startIndex + index;
              const isCurrentImage = currentIndex === absoluteIndex;
              const isSelected = selectedImages.includes(absoluteIndex);
              
              return (
                <div 
                  key={`${img.url}-${absoluteIndex}`} 
                  className={`${styles.thumbnail} ${isCurrentImage ? styles.activeThumbnail : ''}`}
                >
                  <div
                    className={styles.thumbnailRemoveButton}
                    title="Select image"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleImageSelection(absoluteIndex);
                    }}
                  >
                    {isSelected ? <ImCheckboxChecked /> : <ImCheckboxUnchecked  />}
                  </div>
                  <img
                    src={img.url}
                    alt={`Thumbnail ${absoluteIndex}`}
                    onClick={() => setCurrentIndex(absoluteIndex)}
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

const ImageSection: React.FC<ImageSectionProps> = ({
  images,
  onRemove,
  onMultipleRemove,
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
        {/* <div className={styles.imagePreviewContainer}></div> */}
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
      >
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