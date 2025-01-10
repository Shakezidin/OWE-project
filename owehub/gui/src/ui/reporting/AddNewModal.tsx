import React, { useEffect } from 'react';
import { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { toast } from 'react-toastify';
import { reportingCaller } from '../../infrastructure/web_api/services/apiUrl';
import Input from '../components/text_input/Input';
import MicroLoader from '../components/loader/MicroLoader';
interface FormInput
  extends React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> {}
interface ReportData {
  id: number;
  title: string;
  subtitle: string;
  dashboard_id: string;
}
interface ApiData {
  [key: string]: ReportData[];
}
interface ReportData {
  category: string;
  title: string;
  subtitle: string;
  dashboard_id: string;
}

const ReportFormModal = ({
  isOpen,
  handleClose,
  setCount,
  count,
  id,
}: any) => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    dashboard_id: '',
    subTitle: '',
    category: '',
  });

  const initialFormData = {
    title: '',
    dashboard_id: '',
    subTitle: '',
    category: '',
  };

  useEffect(() => {
    if (id !== 0 && reportData) {
      setFormData({
        title: reportData?.title || '',
        dashboard_id: reportData?.dashboard_id || '',
        subTitle: reportData?.subtitle || '',
        category: reportData?.category || '',
      });
    } else {
      setFormData(initialFormData);
    }
  }, [id, reportData]);

  // Added for validation errors // Added for validation error message
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); 
  const [load, setLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ApiData | null>(null);
  const [categories, setCategory] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await reportingCaller('get_superset_reports', {});
        if (response.status === 200) {
          setData(response.data);
          const arrayNames = Object.keys(response.data);
          setCategory(arrayNames);
        } else {
          console.error('Error fetching data:', response.message);
          toast.error(response.message);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error making API request:', error);
        setLoading(false);
      }
      setLoading(false);
    };
    fetchData();
  }, [count]);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const handleInputChange = (e: FormInput) => {
    const { name, value } = e.target;

    if (name === 'title' || name === 'subTitle' || name === 'category') {
      const sanitizedValue = value;

      if (sanitizedValue === value) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));

        if (name === 'category') {
          const filteredSuggestions = categories.filter((category) =>
            category.toLowerCase().includes(value.toLowerCase())
          );
          setSuggestions(filteredSuggestions);
        }

        const err = { ...errors };
        delete err[name];
        setErrors(err);
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));

      const err = { ...errors };
      delete err[name];
      setErrors(err);
    }
  };
  const validateForm = (formData: any) => {
    const errors: { [key: string]: string } = {};

    if (formData.title.trim() === '') {
      errors.title = 'Title is required';
    }
    if (formData.dashboard_id.trim() === '') {
      errors.dashboard_id = 'Dashboard Id is required';
    }
    if (formData.category.trim() === '') {
      errors.category = 'Category is required';
    }
    return errors;
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const errors = validateForm(formData);
    setErrors(errors);
    if (Object.keys(errors).length === 0) {
      setLoad(true);
      try {
        const response = await reportingCaller('create_superset_report', {
          title: formData.title,
          category: formData.category,
          subtitle: formData.subTitle,
          dashboard_id: formData.dashboard_id,
        });
        if (response.status === 200) {
          toast.success('Report Created Succesfully');
          setCount(count + 1);
          handleClose();
          setFormData(initialFormData);
        } else if (response.status >= 201) {
          toast.warn(response.message);
        }
        setLoad(false);
      } catch (error) {
        setLoad(false);
        console.error('Error submitting form:', error);
      }
    }
  };
  const handleSuggestionClick = (suggestion: string) => {
    setFormData((prevData) => ({
      ...prevData,
      category: suggestion,
    }));
    setSuggestions([]);
  };
  const renderSuggestions = () => {
    if (suggestions.length === 0) {
      return null;
    }
    if (loading) {
      return <div className="report-loading-message">Loading...</div>;
    }
    return (
        <>
            {isOpen &&
                <div className="add-transparent-model">
                    <div className='rep-mod-top'>
                        <div className='ahj-header'>
                            <p>{id === 0 ? "Create New Report" : "Update Report"}</p>
                            <RxCross2 className="edit-report-cross-icon" size={20} onClick={handleClose} style={{ cursor: "pointer" }} />
                        </div>
                        {(editLoad && (id !== 0)) ? (
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop:"110px" }}>
                                <MicroLoader />
                            </div>
                        ) :
                            <div className='rep-inp-container'>
                                <div className="reportContainerModal">
                                    <Input
                                        type="text"
                                        label="Category"
                                        value={formData.category}
                                        placeholder="Please Enter Category"
                                        maxLength={30}
                                        onChange={handleInputChange}
                                        name="category"
                                    />
                                    {renderSuggestions()}
                                    {errors.category && (
                                        <span
                                            style={{
                                                display: 'block',
                                            }}
                                            className="error"
                                        >
                                            {errors.category}
                                        </span>
                                    )}
                                </div>
                                <div className="reportContainerModal">
                                    <Input
                                        type="text"
                                        label="Title"
                                        value={formData.title}
                                        placeholder="Please Enter Title"
                                        maxLength={30}
                                        onChange={handleInputChange}
                                        name="title"
                                    />
                                    {errors.title && (
                                        <span
                                            style={{
                                                display: 'block',
                                            }}
                                            className="error"
                                        >
                                            {errors.title}
                                        </span>
                                    )}
                                </div>

                                <div className="reportContainerModal">
                                    <Input
                                        type="text"
                                        label="Subtitle"
                                        value={formData.subTitle}
                                        placeholder="Please Enter Subtitle"
                                        maxLength={30}
                                        onChange={handleInputChange}
                                        name="subTitle"
                                    />
                                    {errors.subTitle && (
                                        <span
                                            style={{
                                                display: 'block',
                                            }}
                                            className="error"
                                        >
                                            {errors.subTitle}
                                        </span>
                                    )}
                                </div>

                                <div className="reportContainerModal">
                                    <Input
                                        type="text"
                                        label="Dashboard ID"
                                        value={formData.dashboard_id}
                                        placeholder="Please Enter dashboard id"
                                        onChange={handleInputChange}
                                        name="dashboard_id"
                                    />
                                    {errors.dashboard_id && (
                                        <span
                                            style={{
                                                display: 'block',
                                            }}
                                            className="error"
                                        >
                                            {errors.dashboard_id}
                                        </span>
                                    )}
                                </div>

                                <div className='modal-submit-report'>
                                    {(id === 0) ? <button onClick={handleSubmit} style={{ cursor: load ? "not-allowed" : "pointer", pointerEvents: load ? "none" : "auto", }}
                                        disabled={load}
                                    >{load ? "Creating..." : "Create Report"}</button>
                                        :

                                        <button onClick={handleEdit} style={{ cursor: load ? "not-allowed" : "pointer", pointerEvents: load ? "none" : "auto", }}
                                            disabled={load}
                                        >{load ? "Updating..." : "Update"}</button>
                                    }
                                </div>
                            </div>
                        }
                    </div>

                </div>
            }
        </>

    );
  };
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('.suggestion-list') === null) {
        setSuggestions([]);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const [editLoad, setEditLoad] = useState(false);

  useEffect(() => {
    setEditLoad(true);
    if (id !== 0) {
      const fetchData = async () => {
        try {
          const response = await reportingCaller('get_report_by_id', {
            report_id: id,
          });
          if (response.status === 200) {
            setReportData(response.data);
            setEditLoad(false);
          } else {
            console.error('Error fetching data:', response.message);
            toast.error(response.message);
            setEditLoad(false);
          }
        } catch (error) {
          console.error('Error making API request:', error);
          setEditLoad(false);
        }
      };
      fetchData();
    }
  }, [id]);

  const handleEdit = async (e: any) => {
    e.preventDefault();
    const errors = validateForm(formData);
    setErrors(errors);
    if (Object.keys(errors).length === 0) {
      setLoad(true);
      try {
        const response = await reportingCaller('edit_report', {
          report_id: id,
          title: formData.title,
          category: formData.category,
          subtitle: formData.subTitle,
          dashboard_id: formData.dashboard_id,
        });
        if (response.status === 200) {
          toast.success('Report Updated Succesfully');
          setCount(count + 1);
          handleClose();
        } else if (response.status >= 201) {
          toast.warn(response.message);
        }
        setLoad(false);
      } catch (error) {
        setLoad(false);
        console.error('Error submitting form:', error);
      }
    }
  };

  return (
    <>
      {isOpen && (
        <div className="transparent-model">
          <div className="rep-mod-top">
            <div className="ahj-header">
              <p>{id === 0 ? 'Create New Report' : 'Update Report'}</p>
              <RxCross2
                className="edit-report-cross-icon"
                size={20}
                onClick={handleClose}
                style={{ cursor: 'pointer' }}
              />
            </div>
            {editLoad && id !== 0 ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '110px',
                }}
              >
                <MicroLoader />
              </div>
            ) : (
              <div className="rep-inp-container">
                <div className="reportContainerModal">
                  <Input
                    type="text"
                    label="Category"
                    value={formData.category}
                    placeholder="Please Enter Category"
                    maxLength={30}
                    onChange={handleInputChange}
                    name="category"
                  />
                  {renderSuggestions()}
                  {errors.category && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.category}
                    </span>
                  )}
                </div>
                <div className="reportContainerModal">
                  <Input
                    type="text"
                    label="Title"
                    value={formData.title}
                    placeholder="Please Enter Title"
                    maxLength={30}
                    onChange={handleInputChange}
                    name="title"
                  />
                  {errors.title && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.title}
                    </span>
                  )}
                </div>

                <div className="reportContainerModal">
                  <Input
                    type="text"
                    label="Subtitle"
                    value={formData.subTitle}
                    placeholder="Please Enter Subtitle"
                    maxLength={30}
                    onChange={handleInputChange}
                    name="subTitle"
                  />
                  {errors.subTitle && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.subTitle}
                    </span>
                  )}
                </div>

                <div className="reportContainerModal">
                  <Input
                    type="text"
                    label="Dashboard ID"
                    value={formData.dashboard_id}
                    placeholder="Please Enter dashboard id"
                    onChange={handleInputChange}
                    name="dashboard_id"
                  />
                  {errors.dashboard_id && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.dashboard_id}
                    </span>
                  )}
                </div>

                <div className="modal-submit-report">
                  {id === 0 ? (
                    <button
                      onClick={handleSubmit}
                      style={{
                        cursor: load ? 'not-allowed' : 'pointer',
                        pointerEvents: load ? 'none' : 'auto',
                      }}
                      disabled={load}
                    >
                      {load ? 'Creating...' : 'Create Report'}
                    </button>
                  ) : (
                    <button
                      onClick={handleEdit}
                      style={{
                        cursor: load ? 'not-allowed' : 'pointer',
                        pointerEvents: load ? 'none' : 'auto',
                      }}
                      disabled={load}
                    >
                      {load ? 'Updating...' : 'Update'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ReportFormModal;
