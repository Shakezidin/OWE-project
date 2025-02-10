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
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  getDropdownList,
  getStructuralInfo,
} from '../../../redux/apiActions/DatToolAction/datToolAction';
import s3Upload from '../../../utiles/s3Upload';
import MicroLoader from '../../components/loader/MicroLoader';
import DataNotFound from '../../components/loader/DataNotFound';
import { toast } from 'react-toastify';

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

interface DropdownListData {
  structure: string[];
  roof_type: string[];
  sheathing_type: string[];
  framing_size: string[];
  framing_type_1: string[];
  framing_type_2: string[];
  framing_spacing: string[];
  attachment: string[];
  racking: string[];
  pattern: string[];
  mount: string[];
  structural_upgrades: string[];
  gm_support_type: string[];
  reroof_required: string[];
  attachment_pattern: string[];
  attachment_spacing: string[];
  racking_mount_type: string[];
  racking_max_rail_cantilever: string[];
  [key: string]: string[];
}

interface StructuralPageProps {
  structuralData: StructuralData | null;
  currentGeneralId: string;
  loading: boolean;
}

type SelectFields = {
  [key: string]: boolean;
};

type SelectFieldsSections = {
  structuralInfo: SelectFields;
  attachment: SelectFields;
  racking: SelectFields;
};

const selectFieldsBySection: SelectFieldsSections = {
  structuralInfo: {
    structure: true,
    roof_type: true,
    sheathing_type: true,
    framing_size: true,
    framing_type_1: true,
    framing_type_2: true,
    framing_spacing: true,
    attachment: true,
    racking: true,
    pattern: true,
    mount: true,
    structural_upgrades: true,
    gm_support_type: true,
    reroof_required: true,
  },
  attachment: {
    attachment_spacing: true,
  },
  racking: {
    racking_mount_type: true,
    racking_max_rail_cantilever: true,
  },
};

const StructuralPage: React.FC<StructuralPageProps> = ({
  structuralData,
  currentGeneralId,
  loading,
}) => {
  const dispatch = useAppDispatch();
  const dropdownListData = useAppSelector(
    (state) => state.datSlice.dropdownListData
  ) as DropdownListData;

  const getDropdownFields = (section: keyof SelectFieldsSections): string[] => {
    return Object.keys(selectFieldsBySection[section]);
  };
  useEffect(() => {
    dispatch(getStructuralInfo({ project_id: currentGeneralId }));
    dispatch(
      getDropdownList({
        drop_down_list: [
          ...getDropdownFields('structuralInfo'),
          ...getDropdownFields('attachment'),
          ...getDropdownFields('racking')
        ]
      })
    );
  }, [currentGeneralId, dispatch]);

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
  const [activeStructuralState, setActiveStructuralState] = useState<string>(
    'MP1'
  );
  const [isUploading, setIsUploading] = useState(false);

  const getChangedValues = (
    oldValues: Record<string, string | number>,
    newValues: Record<string, string | number>
  ) => {
    const changedValues: Record<
      string,
      { old: string | number; new: string | number }
    > = {};

    Object.keys(newValues).forEach((key) => {
      if (newValues[key] !== oldValues[key]) {
        changedValues[key] = {
          old: oldValues[key],
          new: newValues[key],
        };
      }
    });

    return changedValues;
  };

  const getOptionsFromDropdownData = (key: string): Option[] => {
    if (!dropdownListData || !dropdownListData[key]) {
      return [{ value: '0', label: 'Select' }];
    }

    return [
      { value: '0', label: 'Select' },
      ...dropdownListData[key].map((item) => ({
        value: item,
        label: item,
      })),
    ];
  };


  const toggleEditStructuralInfo = (save: boolean = false) => {
    if (save) {
      const changedValues = getChangedValues(
        selectedValues,
        tempSelectedValues
      );
      console.log('Structural Info Changes:', changedValues);
      setSelectedValues({ ...selectedValues, ...tempSelectedValues });
    } else {
      setTempSelectedValues({ ...selectedValues });
    }
    setEditStructuralInfo(!editStructuralInfo);
  };
  
  const toggleEditAttachment = (save: boolean = false) => {
    if (save) {
      const changedValues = getChangedValues(
        selectedValues,
        tempSelectedValues
      );
      console.log('Attachment Changes:', changedValues);
      setSelectedValues({ ...selectedValues, ...tempSelectedValues });
    } else {
      setTempSelectedValues({ ...selectedValues });
    }
    setEditAttachment(!editAttachment);
  };
  
  const toggleEditRacking = (save: boolean = false) => {
    if (save) {
      const changedValues = getChangedValues(
        selectedValues,
        tempSelectedValues
      );
      console.log('Racking Changes:', changedValues);
      setSelectedValues({ ...selectedValues, ...tempSelectedValues });
    } else {
      setTempSelectedValues({ ...selectedValues });
    }
    setEditRacking(!editRacking);
  };
  
  const toggleEditRoofStructure = (save: boolean = false) => {
    if (save) {
      const changedValues = getChangedValues(
        selectedValues,
        tempSelectedValues
      );
      console.log('Roof Structure Changes:', changedValues);
      setSelectedValues({ ...selectedValues, ...tempSelectedValues });
    } else {
      setTempSelectedValues({ ...selectedValues });
    }
    setEditRoofStructure(!editRoofStructure);
  };

  const handleSelectChange = (key: string, value: string | number) => {
    // console.log(`Field "${key}" changed to:`, value);
    setTempSelectedValues({ ...tempSelectedValues, [key]: value });
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsUploading(true);
    const files = event.target.files ? Array.from(event.target.files) : [];

    if (files.length + uploadedImages.length > 3) {
      toast.error('You can only upload up to 3 images.');
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
          newImages.push({
            file,
            url: response.location,
          });
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error);
         toast.error(`Failed to upload ${file.name}`);
        }
      }

      if (newImages.length > 0) {
        setUploadedImages((prevImages) => [...prevImages, ...newImages]);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageRemove = async (index: number) => {
    try {
      const imageToRemove = uploadedImages[index];
      const s3Client = s3Upload('/datTool-images'); 
  
      const keyToDelete = imageToRemove.url.split('/datTool-images/')[1]; 
        await s3Client.deleteFile(keyToDelete);
  
      setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Failed to remove image:', error);
      toast.error('Failed to remove image');
    }
  };
  


  const renderComponent = (
    key: string,
    label: string,
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
        options={getOptionsFromDropdownData(key)}
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
                        <IoMdCheckmark
                          onClick={() => toggleEditStructuralInfo(true)}
                        />
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
                      'roof_type',
                      'Roof Type',
                      structuralData?.roof_type || 'N/A',
                      editStructuralInfo
                    )}
                    {renderComponent(
                      'framing_type_1',
                      'Roof Material',
                      structuralData?.roof_material || 'N/A',
                      editStructuralInfo
                    )}
                    {renderComponent(
                      'sheathing_type',
                      'Sheating Type',
                      structuralData?.sheathing_type || 'N/A',
                      editStructuralInfo
                    )}
                    {renderComponent(
                      'framing_type_2',
                      'Framing Type',
                      structuralData?.framing_type_2 || 'N/A',
                      editStructuralInfo
                    )}
                    {renderComponent(
                      'framing_size',
                      'Framing Size',
                      structuralData?.framing_size || 'N/A',
                      editStructuralInfo
                    )}
                    {renderComponent(
                      'framing_spacing',
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
                    'structural_upgrades',
                    'Structural Upgrades',
                    structuralData?.structural_upgrades || 'N/A',
                    editStructuralInfo
                  )}
                  {renderComponent(
                    'reroof_required',
                    'Reroof Required',
                    structuralData?.reroof_required || 'N/A',
                    editStructuralInfo
                  )}
                  {renderComponent(
                    'gm_support_type',
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
                            onClick={() => toggleEditAttachment(true)}
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
                        'attachment_spacing',
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
                            onClick={() => toggleEditRacking(true)}
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
                        'racking_mount_type',
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
                        'racking_max_rail_cantilever',
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
                            onClick={() => toggleEditRoofStructure(true)}
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
