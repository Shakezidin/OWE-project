import React, { useState } from 'react';
import styles from '../styles/StructuralPage.module.css';
import { AiOutlineEdit } from 'react-icons/ai';
import { IoMdAdd, IoMdCheckmark } from 'react-icons/io';
import Select from '../components/Select';
import DisplaySelect from '../components/DisplaySelect';
import { HiMiniXMark } from 'react-icons/hi2';
import { FaCheck } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';
import CustomInput from '../components/Input';
import { RiDeleteBin6Line } from 'react-icons/ri';
import CommonComponent from './CommonComponent';

type Option = {
  value: string | number;
  label: string;
};

type UploadedImage = {
  file: File;
  url: string;
};

const options: Option[] = [
  { value: 0, label: 'Select' },
  { value: 1, label: 'Option 1' },
  { value: 2, label: 'Option 2' },
  { value: 3, label: 'Option 3' },
];

const StructuralPage: React.FC = () => {
  const [editStructuralInfo, setEditStructuralInfo] = useState(false);
  const [editAttachment, setEditAttachment] = useState(false);
  const [editRacking, setEditRacking] = useState(false);
  const [editRoofStructure, setEditRoofStructure] = useState(false);
  const [selectedValues, setSelectedValues] = useState<
    Record<string, string | number>
  >({});
  const [tempSelectedValues, setTempSelectedValues] = useState<
    Record<string, string | number>
  >({});
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [viewerImage, setViewerImage] = useState<string | null>(null);
  const [structuralInfoStates, setStructuralInfoStates] = useState<string[]>([
    'MP1',
  ]);
  const [activeStructuralState, setActiveStructuralState] =
    useState<string>('MP1');

  const toggleEditStructuralInfo = (save: boolean = false) => {
    if (save) {
      setSelectedValues({ ...selectedValues, ...tempSelectedValues });
    } else {
      setTempSelectedValues({ ...selectedValues });
    }
    setEditStructuralInfo(!editStructuralInfo);
  };

  const toggleEditAttachment = (save: boolean = false) => {
    if (save) {
      setSelectedValues({ ...selectedValues, ...tempSelectedValues });
    } else {
      setTempSelectedValues({ ...selectedValues });
    }
    setEditAttachment(!editAttachment);
  };
  const toggleEditRacking = (save: boolean = false) => {
    if (save) {
      setSelectedValues({ ...selectedValues, ...tempSelectedValues });
    } else {
      setTempSelectedValues({ ...selectedValues });
    }
    setEditRacking(!editRacking);
  };

  const toggleEditRoofStructure = (save: boolean = false) => {
    if (save) {
      setSelectedValues({ ...selectedValues, ...tempSelectedValues });
    } else {
      setTempSelectedValues({ ...selectedValues });
    }
    setEditRoofStructure(!editRoofStructure);
  };

  const handleSelectChange = (key: string, value: string | number) => {
    setTempSelectedValues({ ...tempSelectedValues, [key]: value });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files)
        .slice(0, 3 - uploadedImages.length)
        .map((file) => ({
          file,
          url: URL.createObjectURL(file),
        }));
      setUploadedImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  const handleImageRemove = (index: number) => {
    setUploadedImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1);
      return updatedImages;
    });
  };

  const renderComponent = (
    key: string,
    label: string,
    defaultValue: string,
    isEditable: boolean,
    type: 'select' | 'input' = 'select'
  ) => {
    // Get the current value from either temp (when editing) or selected values
    const currentValue = isEditable
      ? tempSelectedValues[key] !== undefined
        ? tempSelectedValues[key]
        : selectedValues[key] || defaultValue
      : selectedValues[key] || defaultValue;

    if (type === 'input') {
      return isEditable ? (
        <CustomInput
          label={label}
          value={String(currentValue)}
          onChange={(value) => handleSelectChange(key, value)}
        />
      ) : (
        <DisplaySelect label={label} value={currentValue} />
      );
    }

    return isEditable ? (
      <Select
        label={label}
        options={options}
        value={currentValue}
        onChange={(value) => handleSelectChange(key, value)}
      />
    ) : (
      <DisplaySelect label={label} value={currentValue} />
    );
  };

  const addNewStructuralState = () => {
    const lastState = structuralInfoStates[structuralInfoStates.length - 1];
    const newStateNumber = parseInt(lastState.replace('MP', '')) + 1;
    const newState = `MP${newStateNumber}`;
    setStructuralInfoStates([...structuralInfoStates, newState]);
    setActiveStructuralState(newState);
    setEditStructuralInfo(true);
  };

  const handleDeleteState = (stateToDelete: string) => {
    // Don't allow deletion if it's the only state
    if (structuralInfoStates.length <= 1) return;

    // Filter out the state to delete
    const updatedStates = structuralInfoStates.filter(
      (state) => state !== stateToDelete
    );

    // Update states array
    setStructuralInfoStates(updatedStates);

    // If the active state was deleted, set the active state to the last state in the array
    if (activeStructuralState === stateToDelete) {
      setActiveStructuralState(updatedStates[updatedStates.length - 1]);
    }

    // Reset edit mode if it was active
    if (editStructuralInfo) {
      toggleEditStructuralInfo(false);
    }
  };
  return (
    <div>
      
      {viewerImage && (
        <div className={styles.imageViewerContainer}>
          
          <div className={styles.imageViewer}>
            <img
              className={styles.viewerImage}
              src={viewerImage}
              alt="Enlarged view"
            />
            <button
              className={styles.imageViewerButton}
              onClick={() => setViewerImage(null)}
            >
              <FaXmark />
            </button>
          </div>
        </div>
      )}
      <div className={styles.container}>
        <div className={styles.flexContainer}>
          <div className={styles.boxOne}>
            <div className={styles.leftWrapper}>
              <div className={styles.headingContainer}>
                <div>
                  <p>Structural Info</p>
                </div>
                <div className={styles.headingIcon}>
                  {structuralInfoStates.map((state, index) =>
                    (editStructuralInfo && activeStructuralState === state) ||
                    !editStructuralInfo ? (
                      <div
                        key={index}
                        className={`${
                          activeStructuralState === state
                            ? styles.activeState
                            : styles.wordContainer
                        }`}
                        onClick={() => setActiveStructuralState(state)}
                      >
                        {state}
                      </div>
                    ) : null
                  )}

                  <div
                    className={styles.iconContainer}
                    onClick={() => {
                      if (editStructuralInfo) {
                        if (
                          activeStructuralState ===
                          structuralInfoStates[structuralInfoStates.length - 1]
                        ) {
                          const newStates = structuralInfoStates.slice(0, -1);
                          setStructuralInfoStates(newStates);
                          setActiveStructuralState(
                            newStates[newStates.length - 1]
                          );
                        }
                        toggleEditStructuralInfo(false);
                      } else {
                        addNewStructuralState();
                      }
                    }}
                  >
                    {editStructuralInfo ? <HiMiniXMark /> : <IoMdAdd />}
                  </div>

                  <div
                    className={`${
                      editStructuralInfo ? styles.active : styles.iconContainer
                    }`}
                    onClick={() =>
                      editStructuralInfo
                        ? toggleEditStructuralInfo(true)
                        : toggleEditStructuralInfo()
                    }
                    style={{ cursor: 'pointer' }}
                  >
                    {editStructuralInfo ? <IoMdCheckmark /> : <AiOutlineEdit />}
                  </div>

                  {activeStructuralState !==
                    structuralInfoStates[structuralInfoStates.length - 1] && (
                    <div
                      className={styles.iconContainer}
                      onClick={() => handleDeleteState(activeStructuralState)}
                    >
                      <RiDeleteBin6Line />
                    </div>
                  )}
                </div>
              </div>

              <div>
                {renderComponent(
                  'structure',
                  'Structure',
                  'Select',
                  editStructuralInfo
                )}

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gridTemplateRows: 'repeat(3, auto)',
                    columnGap: '15px',
                  }}
                >
                  {renderComponent(
                    'roofType',
                    'Roof Type',
                    'Flat',
                    editStructuralInfo
                  )}
                  {renderComponent(
                    'roofMaterial',
                    'Roof Material',
                    'Standing Seam Metal',
                    editStructuralInfo
                  )}
                  {renderComponent(
                    'sheathingType',
                    'Sheating Type',
                    'OSB',
                    editStructuralInfo
                  )}
                  {renderComponent(
                    'framingType',
                    'Framing Type',
                    'Mfg. Truss',
                    editStructuralInfo
                  )}
                  {renderComponent(
                    'framingSize',
                    'Framing Size',
                    '2x4',
                    editStructuralInfo
                  )}
                  {renderComponent(
                    'framingSpacing',
                    'Framing Spacing',
                    '12',
                    editStructuralInfo
                  )}
                </div>
              </div>

              <div className={styles.pvContainer}>
                <p className={styles.selectedContent}>PV MOUNTING HARDWARE</p>
                <div className={styles.hardwareWrapper}>
                  {renderComponent(
                    'attachment',
                    'Attachment',
                    'K2 Flex Foot',
                    editStructuralInfo
                  )}
                  {renderComponent(
                    'racking',
                    'Racking',
                    'K2 CrossRail',
                    editStructuralInfo
                  )}
                  {renderComponent(
                    'pattern',
                    'Pattern',
                    'Staggered',
                    editStructuralInfo
                  )}
                  {renderComponent(
                    'mount',
                    'Mount',
                    'Flush',
                    editStructuralInfo
                  )}
                </div>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gridTemplateRows: 'repeat(3, auto)',
                  gap: '15px',
                }}
              >
                {renderComponent(
                  'structuralUpgrades',
                  'Structural Upgrades',
                  'Blocking',
                  editStructuralInfo
                )}
                {renderComponent(
                  'reroofRequired',
                  'Reroof Required',
                  '---',
                  editStructuralInfo
                )}
                {renderComponent(
                  'gmSupportType',
                  'Gm Support Type',
                  'Ground Screws',
                  editStructuralInfo
                )}
              </div>
            </div>
            <div className={styles.endContainerWrapper}>
              <div className={styles.endContainerOne}>
                <div style={{ borderRight: '1px dashed #DADAFF' }}>
                  <p className={styles.selectedContent}>Quantity</p>{' '}
                  <p className={styles.selectedLabel}>25</p>
                </div>
                <div>
                  <p className={styles.selectedContent}>Azim</p>{' '}
                  <p className={styles.selectedLabel}>345</p>
                </div>
                <div style={{ borderRight: '1px dashed #DADAFF' }}>
                  <p className={styles.selectedContent}>pitch</p>{' '}
                  <p className={styles.selectedLabel}>23</p>
                </div>
                <div>
                  <p className={styles.selectedContent}>TSRF</p>{' '}
                  <p className={styles.selectedLabel}>124</p>
                </div>
                <div style={{ borderRight: '1px dashed #DADAFF' }}>
                  <p className={styles.selectedContent}>Area (sqft)</p>{' '}
                  <p className={styles.selectedLabel}>1500sqft</p>
                </div>
                <div>
                  <p className={styles.selectedContent}>kW DC</p>{' '}
                  <p className={styles.selectedLabel}>24</p>
                </div>
              </div>
              <div className={styles.endContainertwo}>
                <p>Spacing</p>
                <div className={styles.endContainerWrapper}>
                  <div>
                    <p className={styles.selectedContent}>P</p>
                    <p className={styles.selectedLabel}>48</p>
                  </div>
                  <div>
                    <p className={styles.selectedContent}>L</p>
                    <p className={styles.selectedLabel}>--</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.boxTwo}>
            <div className={styles.boxTwoWrap}>
              <div className={styles.attachmentContainer}>
                <div className={styles.attachmentHeader}>
                  <p>Attachment</p>
                  <div className={styles.buttonContainer}>
                    {editAttachment ? (
                      <div
                        onClick={() => toggleEditAttachment(false)}
                        className={styles.iconContainer}
                      >
                        <HiMiniXMark />
                      </div>
                    ) : null}
                    <div
                      className={` ${editAttachment ? styles.active : styles.iconContainer}`}
                      onClick={() =>
                        editAttachment
                          ? toggleEditAttachment(true)
                          : toggleEditAttachment()
                      }
                      style={{ cursor: 'pointer' }}
                    >
                      {editAttachment ? (
                        <IoMdCheckmark
                          onClick={() => setEditStructuralInfo(!editAttachment)}
                        />
                      ) : (
                        <AiOutlineEdit />
                      )}
                    </div>
                  </div>
                </div>
                <div className={styles.attachmentSelect}>
                  <div className={styles.attachmentSelectDIv}>
                    {renderComponent(
                      'attachmentType',
                      'Type',
                      '--',
                      editAttachment,
                      'input'
                    )}
                    {renderComponent(
                      'attachmentPattern',
                      'Pattern',
                      '---',
                      editAttachment,
                      'input'
                    )}
                    {renderComponent(
                      'attachmentQuantity',
                      'Quantity',
                      '12',
                      editAttachment,
                      'input'
                    )}
                    {renderComponent(
                      'attachmentSpacing',
                      'Spacing',
                      'Portrait',
                      editAttachment
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.rackingContainer}>
                <div className={styles.attachmentHeader}>
                  <p>Racking</p>
                  <div className={styles.buttonContainer}>
                    {editRacking ? (
                      <div className={styles.iconContainer}>
                        <HiMiniXMark onClick={() => toggleEditRacking(false)} />
                      </div>
                    ) : null}
                    <div
                      className={` ${editRacking ? styles.active : styles.iconContainer}`}
                      onClick={() =>
                        editRacking
                          ? toggleEditRacking(true)
                          : toggleEditRacking()
                      }
                      style={{ cursor: 'pointer' }}
                    >
                      {editRacking ? (
                        <IoMdCheckmark
                          onClick={() => setEditStructuralInfo(!editRacking)}
                        />
                      ) : (
                        <AiOutlineEdit />
                      )}
                    </div>
                  </div>
                </div>
                <div className={styles.attachmentSelect}>
                  <div className={styles.attachmentSelectDIv}>
                    {renderComponent(
                      'rackingType',
                      'Type',
                      '--',
                      editRacking,
                      'input'
                    )}
                    {renderComponent(
                      'rackingMount',
                      'Mount',
                      'flush',
                      editRacking
                    )}
                  </div>
                  <div className={styles.attachmentSelectDIv}>
                    {renderComponent(
                      'tiltInfo',
                      'Tilt Info',
                      'module',
                      editRacking,
                      'input'
                    )}
                    {renderComponent(
                      'maxRailCantilever',
                      'Max Rail Cantilever',
                      'Portrait',
                      editRacking
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.roofStructure}>
                <div className={styles.attachmentHeader}>
                  <p>Roof Structure</p>
                  <div className={styles.buttonContainer}>
                    {editRoofStructure ? (
                      <div className={styles.iconContainer}>
                        <HiMiniXMark
                          onClick={() => toggleEditRoofStructure(false)}
                        />
                      </div>
                    ) : null}
                    <div
                      className={` ${editRoofStructure ? styles.active : styles.iconContainer}`}
                      onClick={() =>
                        editRoofStructure
                          ? toggleEditRoofStructure(true)
                          : toggleEditRoofStructure()
                      }
                      style={{ cursor: 'pointer' }}
                    >
                      {editRoofStructure ? (
                        <IoMdCheckmark
                          onClick={() =>
                            setEditStructuralInfo(!editRoofStructure)
                          }
                        />
                      ) : (
                        <AiOutlineEdit />
                      )}
                    </div>
                  </div>
                </div>
                <div className={styles.attachmentSelect}>
                  <div className={styles.attachmentSelectDIv}>
                    {renderComponent(
                      'roofFramingType',
                      'Framing Type',
                      '--',
                      editRoofStructure,
                      'input'
                    )}
                    {renderComponent(
                      'roofSize',
                      'Size',
                      '---',
                      editRoofStructure,
                      'input'
                    )}
                  </div>
                  <div className={styles.attachmentSelectDIv}>
                    {renderComponent(
                      'roofSpacing',
                      'Spacing',
                      '---',
                      editRoofStructure,
                      'input'
                    )}
                    {renderComponent(
                      'roofSheathingType',
                      'Sheathing type',
                      '--',
                      editRoofStructure,
                      'input'
                    )}
                  </div>
                  <div className={styles.attachmentSelectDIv}>
                    {renderComponent(
                      'roofMaterial',
                      'Roof Material',
                      '---',
                      editRoofStructure,
                      'input'
                    )}
                    {renderComponent(
                      'structuralUpgrades',
                      'Structural upgrades',
                      '--',
                      editRoofStructure,
                      'input'
                    )}
                  </div>
                </div>
              </div>
              <div className={uploadedImages.length < 3 ? styles.uploadImage : styles.uploadImageThree}>
  <div className={styles.imagePreviewContainer}>
    {uploadedImages.map((image, index) => (
      <div key={index} className={styles.imagePreview}>
        <button
          className={styles.removeImageButton}
          onClick={() => handleImageRemove(index)}
        >
          <FaXmark />
        </button>
        <img
          src={image.url}
          alt="Uploaded preview"
          className={styles.previewImage}
        />
        <p
          className={styles.imageView}
          onClick={() => setViewerImage(image.url)}
        >
          View
        </p>
      </div>
    ))}
  </div>

  {uploadedImages.length < 3 && (  // Only show upload button if less than 3 images
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
        onChange={handleImageUpload}
      />
    </div>
  )}

  {uploadedImages.length === 0 ? (
    <div className={styles.UploadIconContent}>
      <p className={styles.UploadHeading}>Upload Image</p>
      <p className={styles.UploadParagraph}>
        You can select up to 3 files
      </p>
    </div>
  ) : (
    ''
  )}
</div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StructuralPage;
