import React, { useEffect, useState } from 'react';
import styles from '../styles/StructuralPage.module.css';
import { AiOutlineEdit } from 'react-icons/ai';
import { IoMdAdd, IoMdCheckmark } from 'react-icons/io';
import { HiMiniXMark } from 'react-icons/hi2';
import { FaXmark } from 'react-icons/fa6';
import { RiDeleteBin6Line } from 'react-icons/ri';
import Select from '../components/Select';
import DisplaySelect from '../components/DisplaySelect';
import CustomInput from '../components/Input';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  getDropdownList,
  getStructuralInfo,
  updateDatTool,
} from '../../../redux/apiActions/DatToolAction/datToolAction';
import s3Upload from '../../../utiles/s3Upload';
import MicroLoader from '../../components/loader/MicroLoader';
import DataNotFound from '../../components/loader/DataNotFound';
import { toast } from 'react-toastify';

// Types remain the same as in your original code...
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

interface MPStructuralInfo {
  structure: string;
  roof_type: string;
  sheathing_type: string;
  framing_size: string;
  structural_roof_material: string;
  framing_type: string;
  framing_spacing: number;
  attachment: string;
  racking: string;
  pattern: string;
  mount: string;
  structural_upgrades: string;
  gm_support_type: string;
  reroof_required: string;
}

interface StructuralData {
  structural_info: {
    [key: string]: MPStructuralInfo;
  };
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
  roof_spacing: string;
  roof_sheathing_type: string;
  roof_material: string;
  roof_structural_upgrade: string;
}

interface DropdownListData {
  structure: string[];
  roof_type: string[];
  sheathing_type: string[];
  framing_size: string[];
  roof_material: string[];
  framing_type: string[];
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
    roof_material: true,
    framing_type: true,
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

  // State Management
  const [editStates, setEditStates] = useState({
    structuralInfo: false,
    attachment: false,
    racking: false,
    roofStructure: false,
  });
  const [selectedValues, setSelectedValues] = useState<
    Record<string, string | number>
  >({});
  const [tempSelectedValues, setTempSelectedValues] = useState<
    Record<string, string | number>
  >({});
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const [viewerImage, setViewerImage] = useState<string>('');
  const [structuralInfoStates, setStructuralInfoStates] = useState<string[]>(
    []
  );
  const [activeStructuralState, setActiveStructuralState] =
    useState<string>('');
  const [mpData, setMpData] = useState<Record<string, any>>({});
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const initializeData = () => {
      dispatch(getStructuralInfo({ project_id: currentGeneralId }));
      dispatch(
        getDropdownList({
          drop_down_list: [
            ...Object.keys(selectFieldsBySection.structuralInfo),
            ...Object.keys(selectFieldsBySection.attachment),
            ...Object.keys(selectFieldsBySection.racking),
          ],
        })
      );
    };

    initializeData();
  }, [currentGeneralId, dispatch]);

  useEffect(() => {
    if (structuralData?.structural_info) {
      const mpKeys = Object.keys(structuralData.structural_info);
      setStructuralInfoStates(mpKeys);
      setActiveStructuralState(mpKeys[0]);
      setMpData(structuralData.structural_info);

      const initialMpData = structuralData.structural_info[mpKeys[0]];
      setSelectedValues({
        ...initialMpData,
        quantity: structuralData.quantity,
        pitch: structuralData.pitch,
        area_sqft: structuralData.area_sqft,
      });
    }
  }, [structuralData]);

  const handleUpdate = async (
    section: string,
    newValues: Record<string, any>
  ) => {
    try {
      let payload: Record<string, any> = {
        project_id: currentGeneralId,
      };
  
      // Validate the data
      if (section === 'structural_info') {
        if (!mpData[activeStructuralState]) {
          toast.error('Invalid structural state data.');
          return false;
        }
  
        const modifiedFields = Object.keys(newValues).reduce((acc, key) => {
          if (newValues[key] !== mpData[activeStructuralState]?.[key]) {
            acc[key] = newValues[key];
          }
          return acc;
        }, {} as Record<string, any>);
  
        if (Object.keys(modifiedFields).length === 0) {
          toast.error('No changes detected for structural info.');
          return false;
        }
  
        payload = {
          project_id: currentGeneralId,
          structural_state: activeStructuralState.toLowerCase(),
          structural_info: modifiedFields,
        };
      } else {
        payload[section.toLowerCase()] = newValues;
      }
  
      const response = await dispatch(updateDatTool(payload));
  
      if (response?.payload?.status === 200) {
        toast.success(`${section} Updated Successfully`);
        return true;
      }
  
      toast.error(response?.payload?.message || `Failed to update ${section}`);
      console.error('Response:', response);
      return false;
    } catch (error) {
      console.error('Update error:', error);
      toast.error(`Failed to update ${section}`);
      return false;
    }
  };
  
  
  const toggleEditState = async (
    stateName: keyof typeof editStates,
    save: boolean = false
  ) => {
    if (save) {
      let success = false;
      const updates = { ...tempSelectedValues };
      
      switch (stateName) {
        case 'structuralInfo':
          // Map field names appropriately and convert types
          const modifiedFields = Object.keys(updates).reduce((acc, key) => {
            // Skip if value hasn't changed
            if (updates[key] === mpData[activeStructuralState]?.[key]) {
              return acc;
            }
            
            // Special field name mapping
            if (key === 'roof_material') {
              acc['structural_roof_material'] = updates[key];
            } 
            // Handle framing_spacing conversion to integer
            else if (key === 'framing_spacing') {
              const spacing = typeof updates[key] === 'string' 
                ? parseInt(updates[key] as string, 10) 
                : Number(updates[key]);
              
              if (!isNaN(spacing)) {
                acc[key] = spacing;
              }
            }
            else {
              acc[key] = updates[key];
            }
            
            return acc;
          }, {} as Record<string, any>);
        
          if (Object.keys(modifiedFields).length > 0) {
            success = await handleUpdate('structural_info', modifiedFields);
            if (success) {
              setMpData(prev => {
                // Create a copy of the current MP data
                const prevMpData = prev[activeStructuralState] || {};
                
                // Build updated MP data with proper field mapping
                const updatedMpData = { ...prevMpData };
                
                // Handle special case for roof material
                if ('structural_roof_material' in modifiedFields) {
                  updatedMpData.structural_roof_material = modifiedFields.structural_roof_material;
                }
                
                // Add all other modified fields
                Object.entries(modifiedFields)
                  .filter(([k]) => k !== 'structural_roof_material')
                  .forEach(([k, v]) => {
                    updatedMpData[k] = v;
                  });
                
                return {
                  ...prev,
                  [activeStructuralState]: updatedMpData
                };
              });
            }
          } else {
            success = true;
          }
          break;
  
        case 'attachment':
          success = await handleUpdate('attachment', {
            attachment_spacing: updates.attachment_spacing,
            attachment_type: updates.attachmentType,
            attachment_pattern: updates.attachmentPattern,
            attachment_quantity: Number(updates.attachmentQuantity) || 0,
          });
          if (success) {
            setSelectedValues(prev => ({ ...prev, ...updates }));
          }
          break;
  
        case 'racking':
          success = await handleUpdate('racking', {
            racking_type: updates.rackingType,
            racking_mount_type: updates.racking_mount_type,
            racking_title_info: updates.tiltInfo,
            racking_max_rail_cantilever: updates.racking_max_rail_cantilever
          });
          if (success) {
            setSelectedValues(prev => ({ ...prev, ...updates }));
          }
          break;
  
        case 'roofStructure':
          success = await handleUpdate('roof_structure', {
            roof_framing_type: updates.roofFramingType,
            roof_size: updates.roofSize,
            roof_spacing: updates.roofSpacing,
            roof_sheathing_type: updates.roofSheathingType,
            roof_material: updates.roofMaterial,
            roof_structural_upgrade: updates.structuralUpgrades
          });
          if (success) {
            setSelectedValues(prev => ({ ...prev, ...updates }));
          }
          break;
      }
  
      if (!success) {
        return;
      }
    }
  
    setTempSelectedValues(
      stateName === 'structuralInfo' 
        ? mpData[activeStructuralState] || {} 
        : { ...selectedValues }
    );
    
    setEditStates(prev => ({
      ...prev,
      [stateName]: !prev[stateName]
    }));
  };

  const handleSelectChange = (key: string, value: string | number) => {
    setTempSelectedValues((prev) => ({ ...prev, [key]: value }));
  };

  // Image Handling Functions
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (files.length + uploadedImages.length > 3) {
      toast.error('You can only upload up to 3 images.');
      return;
    }

    setIsUploading(true);
    try {
      const s3Client = s3Upload('/datTool-images');
      const newImages = await Promise.all(
        files.map(async (file) => {
          const timestamp = new Date().getTime();
          const uniqueFileName = `${timestamp}-${file.name}`;
          const response = await s3Client.uploadFile(file, uniqueFileName);
          return { file, url: response.location };
        })
      );

      setUploadedImages((prev) => [...prev, ...newImages]);
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
      setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Failed to remove image:', error);
      toast.error('Failed to remove image');
    }
  };

  // Structural State Management
  const addNewStructuralState = () => {
    const lastState = structuralInfoStates[structuralInfoStates.length - 1];
    const newStateNumber = parseInt(lastState.replace('MP', '')) + 1;
    const newState = `MP${newStateNumber}`;
    setStructuralInfoStates((prev) => [...prev, newState]);
    setActiveStructuralState(newState);
    setEditStates((prev) => ({ ...prev, structuralInfo: true }));
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

    if (editStates.structuralInfo) {
      toggleEditState('structuralInfo', false);
    }
  };

  // Render Helper Function
  const renderComponent = (
    key: string,
    label: string,
    defaultValue: any,
    isEditable: boolean,
    type: 'select' | 'input' = 'select'
  ) => {
    const currentMpData = mpData[activeStructuralState] || {};
    const isMpSpecificField = Object.keys(currentMpData).includes(key);
    const currentValue = isEditable
      ? (tempSelectedValues[key] ??
        (isMpSpecificField ? currentMpData[key] : selectedValues[key]) ??
        defaultValue)
      : isMpSpecificField
        ? currentMpData[key]
        : (selectedValues[key] ?? defaultValue);

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
        options={[
          { value: '0', label: 'Select' },
          ...(dropdownListData[key] || []).map((item) => ({
            value: item,
            label: item,
          })),
        ]}
        value={currentValue}
        onChange={(value) => handleSelectChange(key, value)}
      />
    ) : (
      <DisplaySelect label={label} value={currentValue} />
    );
  };

  const getCurrentStructuralInfo = () => {
    if (!mpData || !activeStructuralState) {
      return null;
    }
    return mpData[activeStructuralState];
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
                      (editStates.structuralInfo &&
                        activeStructuralState === state) ||
                      !editStates.structuralInfo ? (
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
                        if (editStates.structuralInfo) {
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
                          toggleEditState('structuralInfo', false); // updated function call
                        } else {
                          addNewStructuralState();
                        }
                      }}
                    >
                      {editStates.structuralInfo ? (
                        <HiMiniXMark />
                      ) : (
                        <IoMdAdd />
                      )}
                    </div>

                    <div
                      className={`${editStates.structuralInfo ? styles.active : styles.iconContainer}`}
                      onClick={() => {
                        if (editStates.structuralInfo) {
                          toggleEditState('structuralInfo', true);
                        } else {
                          toggleEditState('structuralInfo');
                        }
                      }}
                    >
                      {editStates.structuralInfo ? (
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
                    getCurrentStructuralInfo()?.structure || 'N/A',
                    editStates.structuralInfo // updated here
                  )}

                  <div className={styles.structuralGrid}>
                    {renderComponent(
                      'roof_type',
                      'Roof Type',
                      getCurrentStructuralInfo()?.roof_type || 'N/A',
                      editStates.structuralInfo // updated here
                    )}
                    {renderComponent(
                      'roof_material',
                      'Roof Material',
                      getCurrentStructuralInfo()?.structural_roof_material ||
                        'N/A',
                      editStates.structuralInfo // updated here
                    )}
                    {renderComponent(
                      'sheathing_type',
                      'Sheathing Type',
                      getCurrentStructuralInfo()?.sheathing_type || 'N/A',
                      editStates.structuralInfo // updated here
                    )}
                    {renderComponent(
                      'framing_type',
                      'Framing Type',
                      getCurrentStructuralInfo()?.framing_type || 'N/A',
                      editStates.structuralInfo // updated here
                    )}
                    {renderComponent(
                      'framing_size',
                      'Framing Size',
                      getCurrentStructuralInfo()?.framing_size || 'N/A',
                      editStates.structuralInfo // updated here
                    )}
                    {renderComponent(
                      'framing_spacing',
                      'Framing Spacing',
                      getCurrentStructuralInfo()?.framing_spacing || 'N/A',
                      editStates.structuralInfo // updated here
                    )}
                  </div>
                </div>

                <div className={styles.pvContainer}>
                  <p className={styles.selectedContent}>PV MOUNTING HARDWARE</p>
                  <div className={styles.hardwareWrapper}>
                    {renderComponent(
                      'attachment',
                      'Attachment',
                      getCurrentStructuralInfo()?.attachment || 'N/A',
                      editStates.structuralInfo // updated here
                    )}

                    {renderComponent(
                      'racking',
                      'Racking',
                      getCurrentStructuralInfo()?.racking || 'N/A',
                      editStates.structuralInfo // updated here
                    )}
                    {renderComponent(
                      'pattern',
                      'Pattern',
                      getCurrentStructuralInfo()?.pattern || 'N/A',
                      editStates.structuralInfo // updated here
                    )}
                    {renderComponent(
                      'mount',
                      'Mount',
                      getCurrentStructuralInfo()?.mount || 'N/A',
                      editStates.structuralInfo // updated here
                    )}
                  </div>
                </div>
                <div className={styles.structuralGridLast}>
                  {renderComponent(
                    'structural_upgrades',
                    'Structural Upgrades',
                    getCurrentStructuralInfo()?.structural_upgrades || 'N/A',
                    editStates.structuralInfo // updated here
                  )}
                  {renderComponent(
                    'reroof_required',
                    'Reroof Required',
                    getCurrentStructuralInfo()?.reroof_required || 'N/A',
                    editStates.structuralInfo // updated here
                  )}
                  {renderComponent(
                    'gm_support_type',
                    'Gm Support Type',
                    getCurrentStructuralInfo()?.gm_support_type || 'N/A',
                    editStates.structuralInfo // updated here
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
                      {editStates.attachment ? (
                        <div
                          onClick={() => toggleEditState('attachment', false)} // updated function call
                          className={styles.iconContainer}
                        >
                          <HiMiniXMark />
                        </div>
                      ) : null}
                      <div
                        className={`${editStates.attachment ? styles.active : styles.iconContainer}`}
                        onClick={() => {
                          if (editStates.attachment) {
                            toggleEditState('attachment', true);
                          } else {
                            toggleEditState('attachment');
                          }
                        }}
                      >
                        {editStates.attachment ? (
                          <IoMdCheckmark />
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
                        editStates.attachment, // updated here
                        'input'
                      )}
                      {renderComponent(
                        'attachmentPattern',
                        'Pattern',
                        structuralData?.attachment_pattern || 'N/A',
                        editStates.attachment, // updated here
                        'input'
                      )}
                      {renderComponent(
                        'attachmentQuantity',
                        'Quantity',
                        structuralData?.attachment_quantity || 'N/A',
                        editStates.attachment, // updated here
                        'input'
                      )}
                      {renderComponent(
                        'attachment_spacing',
                        'Spacing',
                        structuralData?.attachment_spacing || 'N/A',
                        editStates.attachment // updated here
                      )}
                    </div>
                  </div>
                </div>
                <div className={styles.rackingContainer}>
                  <div className={styles.attachmentHeader}>
                    <p>Racking</p>
                    <div className={styles.buttonContainer}>
                      {editStates.racking ? (
                        <div className={styles.iconContainer}>
                          <HiMiniXMark
                            onClick={() => toggleEditState('racking', false)} // updated function call
                          />
                        </div>
                      ) : null}
                      <div
                        className={`${editStates.racking ? styles.active : styles.iconContainer}`}
                        onClick={() => {
                          if (editStates.racking) {
                            toggleEditState('racking', true);
                          } else {
                            toggleEditState('racking');
                          }
                        }}
                      >
                        {editStates.racking ? (
                          <IoMdCheckmark />
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
                        editStates.racking, // updated here
                        'input'
                      )}
                      {renderComponent(
                        'racking_mount_type',
                        'Mount',
                        structuralData?.racking_mount_type || 'N/A',
                        editStates.racking // updated here
                      )}
                      {renderComponent(
                        'tiltInfo',
                        'Tilt Info',
                        structuralData?.racking_title_info || 'N/A',
                        editStates.racking, // updated here
                        'input'
                      )}
                      {renderComponent(
                        'racking_max_rail_cantilever',
                        'Max Rail Cantilever',
                        structuralData?.racking_max_rail_cantilever || 'N/A',
                        editStates.racking // updated here
                      )}
                    </div>
                  </div>
                </div>
                <div className={styles.roofStructure}>
                  <div className={styles.attachmentHeader}>
                    <p>Roof Structure</p>
                    <div className={styles.buttonContainer}>
                      {editStates.roofStructure ? (
                        <div className={styles.iconContainer}>
                          <HiMiniXMark
                            onClick={() =>
                              toggleEditState('roofStructure', false)
                            } // updated function call
                          />
                        </div>
                      ) : null}
                      <div
                        className={`${editStates.roofStructure ? styles.active : styles.iconContainer}`}
                        onClick={() => {
                          if (editStates.roofStructure) {
                            toggleEditState('roofStructure', true);
                          } else {
                            toggleEditState('roofStructure');
                          }
                        }}
                      >
                        {editStates.roofStructure ? (
                          <IoMdCheckmark />
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
                        editStates.roofStructure, // updated here
                        'input'
                      )}
                      {renderComponent(
                        'roofSize',
                        'Size',
                        structuralData?.roof_size || 'N/A',
                        editStates.roofStructure, // updated here
                        'input'
                      )}
                      {renderComponent(
                        'roofSpacing',
                        'Spacing',
                        structuralData?.roof_spacing || 'N/A',
                        editStates.roofStructure, // updated here
                        'input'
                      )}
                      {renderComponent(
                        'roofSheathingType',
                        'Sheathing type',
                        structuralData?.roof_sheathing_type || 'N/A',
                        editStates.roofStructure, // updated here
                        'input'
                      )}
                      {renderComponent(
                        'roofMaterial',
                        'Roof Material',
                        structuralData?.roof_material || 'N/A',
                        editStates.roofStructure, // updated here
                        'input'
                      )}
                      {renderComponent(
                        'structuralUpgrades',
                        'Structural upgrades',
                        structuralData?.roof_structural_upgrade || 'N/A',
                        editStates.roofStructure, // updated here
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
        <div
          style={{ display: 'flex', justifyContent: 'center', height: '70vh' }}
        >
          <DataNotFound />
        </div>
      )}
    </div>
  );
};

export default StructuralPage;
