import React, { useEffect, useState } from 'react';
import styles from '../styles/StructuralPage.module.css';
import { AiOutlineEdit } from 'react-icons/ai';
import { IoMdAdd, IoMdCheckmark } from 'react-icons/io';
import Select from '../components/Select';
import DisplaySelect from '../components/DisplaySelect';
import { HiMiniXMark } from 'react-icons/hi2';
import { FaXmark } from 'react-icons/fa6';
import CustomInput from '../components/Input';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { useAppDispatch } from '../../../redux/hooks';
import { getStructuralInfo } from '../../../redux/apiActions/DatToolAction/datToolAction';
import s3Upload from '../../../utiles/s3Upload';
import MicroLoader from '../../components/loader/MicroLoader';
import DataNotFound from '../../components/loader/DataNotFound';

type Option = {
  value: string | number;
  label: string;
};

type UploadedImage = {
  file: File;
  url: string;
};

type S3Response = {
  bucket: string;
  key: string;
  location: string;
  status: number;
};

interface StructuralData {
  structure: string;
  roof_type: string;
  sheathing_type: string;
  framing_size: string;
  framing_type_1: string;
  framing_type_2: string;
  framing_spacing: number;
  attachment: string;
  racking: string;
  pattern: string;
  mount: string;
  structural_upgrades: string;
  gm_support_type: string;
  reroof_required: string;
  quantity: number;
  pitch: number;
  area_sqft: string;
  azimuth: number;
  tsrf: number;
  kw_dc: number;
  spacing_p: number;
  spacing_l: number;
  attachment_type: string;
  attachment_pattern: string;
  attachment_quantity: number;
  attachment_spacing: string;
  racking_type: string;
  racking_mount_type: string;
  racking_title_info: string;
  racking_max_rail_cantilever: string;
  roof_framing_type: string;
  roof_size: string;
  roof_spacing: number;
  roof_sheathing_type: string;
  roof_material: string;
  roof_structural_upgrade: string;
}

interface StructuralPageProps {
  structuralData: StructuralData | null;
  currentGeneralId: string;
  loading: boolean;
}

const options: Option[] = [
  { value: 0, label: 'Select' },
  { value: 1, label: 'Option 1' },
  { value: 2, label: 'Option 2' },
  { value: 3, label: 'Option 3' },
];

const StructuralPage: React.FC<StructuralPageProps> = ({
  structuralData,
  currentGeneralId,
  loading,
}) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getStructuralInfo({ project_id: currentGeneralId }));
  }, [currentGeneralId]);
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
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const [viewerImage, setViewerImage] = useState<string>('');
  const [structuralInfoStates, setStructuralInfoStates] = useState<string[]>([
    'MP1',
  ]);
  const [activeStructuralState, setActiveStructuralState] =
    useState<string>('MP1');
  const [isUploading, setIsUploading] = useState(false);

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

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsUploading(true);
    const files = event.target.files ? Array.from(event.target.files) : [];

    if (files.length + uploadedImages.length > 3) {
      alert('You can only upload up to 3 images.');
      return;
    }

    try {
      const newImages: UploadedImage[] = [];
      const s3Client = s3Upload('/datTool-images');

      for (const file of files) {
        try {
          const timestamp = new Date().getTime();
          const uniqueFileName = `${timestamp}-${file.name}`;

          const response = (await s3Client.uploadFile(
            file,
            uniqueFileName
          )) as S3Response;
          console.log(response, 'trqtqtwe');
          newImages.push({
            file,
            url: response.location,
          });
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error);
          alert(`Failed to upload ${file.name}`);
        }
      }

      if (newImages.length > 0) {
        setUploadedImages((prevImages) => [...prevImages, ...newImages]);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle image removal
  const handleImageRemove = (index: number) => {
    setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const renderComponent = (
    key: any,
    label: any,
    defaultValue: any,
    isEditable: boolean,
    type: 'select' | 'input' = 'select'
  ) => {
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
    if (structuralInfoStates.length <= 1) return;

    const updatedStates = structuralInfoStates.filter(
      (state) => state !== stateToDelete
    );

    setStructuralInfoStates(updatedStates);

    if (activeStructuralState === stateToDelete) {
      setActiveStructuralState(updatedStates[updatedStates.length - 1]);
    }

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
              onClick={() => setViewerImage('')}
            >
              <FaXmark />
            </button>
          </div>
        </div>
      )}
      {loading ? (
        <div className={styles.microLoaderContainer}>
          {' '}
          <MicroLoader />
        </div>
      ) : structuralData ? (
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
                            structuralInfoStates[
                              structuralInfoStates.length - 1
                            ]
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
                        editStructuralInfo
                          ? styles.active
                          : styles.iconContainer
                      }`}
                      onClick={() =>
                        editStructuralInfo
                          ? toggleEditStructuralInfo(true)
                          : toggleEditStructuralInfo()
                      }
                      style={{ cursor: 'pointer' }}
                    >
                      {editStructuralInfo ? (
                        <IoMdCheckmark />
                      ) : (
                        <AiOutlineEdit />
                      )}
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
                    structuralData?.structure || 'N/A',
                    editStructuralInfo
                  )}

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gridTemplateRows: 'repeat(3, auto)',
                      columnGap: '15px',
                      rowGap: '15px',
                      marginTop: '15px',
                    }}
                  >
                    {renderComponent(
                      'roofType',
                      'Roof Type',
                      structuralData?.roof_type || 'N/A',
                      editStructuralInfo
                    )}
                    {renderComponent(
                      'roofMaterial',
                      'Roof Material',
                      structuralData?.roof_material || 'N/A',
                      editStructuralInfo
                    )}
                    {renderComponent(
                      'sheathingType',
                      'Sheating Type',
                      structuralData?.sheathing_type || 'N/A',
                      editStructuralInfo
                    )}
                    {renderComponent(
                      'framingType',
                      'Framing Type',
                      structuralData?.framing_type_2 || 'N/A',
                      editStructuralInfo
                    )}
                    {renderComponent(
                      'framingSize',
                      'Framing Size',
                      structuralData?.framing_size || 'N/A',
                      editStructuralInfo
                    )}
                    {renderComponent(
                      'framingSpacing',
                      'Framing Spacing',
                      structuralData?.framing_spacing || 'N/A',
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
                      structuralData?.attachment || 'N/A',
                      editStructuralInfo
                    )}
                    {renderComponent(
                      'racking',
                      'Racking',
                      structuralData?.racking || 'N/A',
                      editStructuralInfo
                    )}
                    {renderComponent(
                      'pattern',
                      'Pattern',
                      structuralData?.pattern || 'N/A',
                      editStructuralInfo
                    )}
                    {renderComponent(
                      'mount',
                      'Mount',
                      structuralData?.mount || 'N/A',
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
                    structuralData?.structural_upgrades || 'N/A',
                    editStructuralInfo
                  )}
                  {renderComponent(
                    'reroofRequired',
                    'Reroof Required',
                    structuralData?.reroof_required || 'N/A',
                    editStructuralInfo
                  )}
                  {renderComponent(
                    'gmSupportType',
                    'Gm Support Type',
                    structuralData?.gm_support_type || 'N/A',
                    editStructuralInfo
                  )}
                </div>
              </div>
              <div className={styles.endContainerWrapper}>
                <div className={styles.endContainerOne}>
                  <div style={{ borderRight: '1px dashed #DADAFF' }}>
                    <p className={styles.selectedContent}>Quantity</p>{' '}
                    <p className={styles.selectedLabel}>
                      {structuralData?.quantity || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className={styles.selectedContent}>Azim</p>{' '}
                    <p className={styles.selectedLabel}>
                      {structuralData?.azimuth || 'N/A'}
                    </p>
                  </div>
                  <div style={{ borderRight: '1px dashed #DADAFF' }}>
                    <p className={styles.selectedContent}>Pitch</p>{' '}
                    <p className={styles.selectedLabel}>
                      {structuralData?.pitch || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className={styles.selectedContent}>TSRF</p>{' '}
                    <p className={styles.selectedLabel}>
                      {structuralData?.tsrf || 'N/A'}
                    </p>
                  </div>
                  <div style={{ borderRight: '1px dashed #DADAFF' }}>
                    <p className={styles.selectedContent}>Area (sqft)</p>{' '}
                    <p className={styles.selectedLabel}>
                      {structuralData?.area_sqft || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className={styles.selectedContent}>kW DC</p>{' '}
                    <p className={styles.selectedLabel}>
                      {structuralData?.kw_dc || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className={styles.endContainertwo}>
                  <p>Spacing</p>
                  <div className={styles.endContainerWrapper}>
                    <div>
                      <p className={styles.selectedContent}>P</p>
                      <p className={styles.selectedLabel}>
                        {structuralData?.spacing_p || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className={styles.selectedContent}>L</p>
                      <p className={styles.selectedLabel}>
                        {structuralData?.spacing_l || 'N/A'}
                      </p>
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
                            onClick={() =>
                              setEditStructuralInfo(!editAttachment)
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
                        'attachmentType',
                        'Type',
                        structuralData?.attachment_type || 'N/A',
                        editAttachment,
                        'input'
                      )}
                      {renderComponent(
                        'attachmentPattern',
                        'Pattern',
                        structuralData?.attachment_pattern || 'N/A',
                        editAttachment,
                        'input'
                      )}
                      {renderComponent(
                        'attachmentQuantity',
                        'Quantity',
                        structuralData?.attachment_quantity || 'N/A',
                        editAttachment,
                        'input'
                      )}
                      {renderComponent(
                        'attachmentSpacing',
                        'Spacing',
                        structuralData?.attachment_spacing || 'N/A',
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
                          <HiMiniXMark
                            onClick={() => toggleEditRacking(false)}
                          />
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
                        structuralData?.racking_type || 'N/A',
                        editRacking,
                        'input'
                      )}
                      {renderComponent(
                        'rackingMount',
                        'Mount',
                        structuralData?.racking_mount_type || 'N/A',
                        editRacking
                      )}
                      {renderComponent(
                        'tiltInfo',
                        'Tilt Info',
                        structuralData?.racking_title_info || 'N/A',
                        editRacking,
                        'input'
                      )}
                      {renderComponent(
                        'maxRailCantilever',
                        'Max Rail Cantilever',
                        structuralData?.racking_max_rail_cantilever || 'N/A',
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
                        structuralData?.roof_framing_type || 'N/A',
                        editRoofStructure,
                        'input'
                      )}
                      {renderComponent(
                        'roofSize',
                        'Size',
                        structuralData?.roof_size || 'N/A',
                        editRoofStructure,
                        'input'
                      )}
                      {renderComponent(
                        'roofSpacing',
                        'Spacing',
                        structuralData?.roof_spacing || 'N/A',
                        editRoofStructure,
                        'input'
                      )}
                      {renderComponent(
                        'roofSheathingType',
                        'Sheathing type',
                        structuralData?.roof_sheathing_type || 'N/A',
                        editRoofStructure,
                        'input'
                      )}
                      {renderComponent(
                        'roofMaterial',
                        'Roof Material',
                        structuralData?.roof_material || 'N/A',
                        editRoofStructure,
                        'input'
                      )}
                      {renderComponent(
                        'structuralUpgrades',
                        'Structural upgrades',
                        structuralData?.roof_structural_upgrade || 'N/A',
                        editRoofStructure,
                        'input'
                      )}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    uploadedImages.length === 3
                      ? styles.uploadImageThree
                      : uploadedImages.length === 2 ||
                          uploadedImages.length === 1
                        ? styles.uploadImageTwo
                        : styles.uploadImage
                  }
                >
                  <div className={styles.imagePreviewContainer}>
                    {uploadedImages.map((image, index) => (
                      <div key={index} className={styles.imagePreview}>
                        <button
                          className={styles.removeImageButton}
                          onClick={() => handleImageRemove(index)}
                        >
                          <FaXmark />
                        </button>
                        {image.url ? (
                          <img
                            src={image.url}
                            alt={`Upload ${index + 1}`}
                            className={styles.previewImage}
                            onError={(e) => {
                              console.error('Image failed to load:', image.url);
                              e.currentTarget.alt = 'Failed to load image';
                            }}
                          />
                        ) : (
                          <div className={styles.previewError}>
                            Failed to load image
                          </div>
                        )}
                        <p
                          className={styles.imageView}
                          onClick={() => setViewerImage(image.url)}
                        >
                          View
                        </p>
                      </div>
                    ))}
                  </div>

                  {isUploading ? (
                    <div>
                    <MicroLoader />
                  </div>
                  ) : (
                    uploadedImages.length < 3 && (
                      <div>
                        <label
                          htmlFor="imageUpload"
                          style={{ cursor: 'pointer' }}
                        >
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
                    )
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
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <DataNotFound />
        </div>
      )}
    </div>
  );
};

export default StructuralPage;
