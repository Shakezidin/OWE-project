import React, { useState } from 'react';
import styles from '../styles/StructuralPage.module.css';
import { AiOutlineEdit } from 'react-icons/ai';
import { IoMdAdd, IoMdCheckmark } from 'react-icons/io';
import Select from '../components/Select';
import DisplaySelect from '../components/DisplaySelect';
import { HiMiniXMark } from 'react-icons/hi2';
import { FaCheck } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';

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
    isEditable: boolean
  ) => {
    return isEditable ? (
      <Select
        label={label}
        options={options}
        value={selectedValues[key] || defaultValue}
        onChange={(value) => handleSelectChange(key, value)}
      />
    ) : (
      <DisplaySelect
        label={label}
        value={selectedValues[key] || defaultValue}
      />
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
                  {structuralInfoStates.map((state, index) => (
                    <div
                      key={index}
                      className={` ${
                        activeStructuralState === state
                          ? styles.activeState
                          : styles.wordContainer
                      }`}
                      onClick={() => setActiveStructuralState(state)}
                    >
                      {state}
                    </div>
                  ))}
                  <div className={styles.iconContainer}>
                    {editStructuralInfo ? (
                      <HiMiniXMark
                        onClick={() => toggleEditStructuralInfo(false)}
                      />
                    ) : (
                      <IoMdAdd onClick={addNewStructuralState} />
                    )}
                  </div>
                  <div
                    className={` ${
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
                <div style={{ borderRight: '1px solid #ccc' }}>
                  <p className={styles.selectedContent}>Quantity</p>{' '}
                  <p className={styles.selectedLabel}>25</p>
                </div>
                <div>
                  <p className={styles.selectedContent}>Azim</p>{' '}
                  <p className={styles.selectedLabel}>345</p>
                </div>
                <div style={{ borderRight: '1px solid #ccc' }}>
                  <p className={styles.selectedContent}>pitch</p>{' '}
                  <p className={styles.selectedLabel}>23</p>
                </div>
                <div>
                  <p className={styles.selectedContent}>TSRF</p>{' '}
                  <p className={styles.selectedLabel}>124</p>
                </div>
                <div style={{ borderRight: '1px solid #ccc' }}>
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
                      <div className={styles.iconContainer}>
                        <HiMiniXMark
                          onClick={() => toggleEditAttachment(false)}
                        />
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
                      editAttachment
                    )}
                    {renderComponent(
                      'attachmentPattern',
                      'Pattern',
                      '---',
                      editAttachment
                    )}
                    {renderComponent(
                      'attachmentQuantity',
                      'Quantity',
                      '12',
                      editAttachment
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
                    {renderComponent('rackingType', 'Type', '--', editRacking)}
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
                      editRacking
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
                      editRoofStructure
                    )}
                    {renderComponent(
                      'roofSize',
                      'Size',
                      '---',
                      editRoofStructure
                    )}
                  </div>
                  <div className={styles.attachmentSelectDIv}>
                    {renderComponent(
                      'roofSpacing',
                      'Spacing',
                      '---',
                      editRoofStructure
                    )}
                    {renderComponent(
                      'roofSheathingType',
                      'Sheathing type',
                      '--',
                      editRoofStructure
                    )}
                  </div>
                  <div className={styles.attachmentSelectDIv}>
                    {renderComponent(
                      'roofMaterial',
                      'Roof Material',
                      '---',
                      editRoofStructure
                    )}
                    {renderComponent(
                      'structuralUpgrades',
                      'Structural upgrades',
                      '--',
                      editRoofStructure
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.uploadImage}>
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
