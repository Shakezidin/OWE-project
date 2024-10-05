import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from "./Styles/ModalStyle.module.css";
import ICONDragDrop from "./Styles/ImageS/UploadFileIcon.svg";
import CrossICON from "./Styles/ImageS/Vector.svg";
import CrossICONRed from "./Styles/ImageS/VectorRed.svg";
import axios from 'axios';

const LibraryModel: React.FC = () => {
  const navigate = useNavigate();
  const [visibleDiv, setVisibleDiv] = useState(1);
  const [closeWindow, setCloseWindow] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null); 

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
    
    if (selectedFile) {
      const base64File = await convertFileToBase64(selectedFile);
      setUploadedImage(base64File); 
      setVisibleDiv(2); 
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      setFile(selectedFile);
      const base64File = await convertFileToBase64(selectedFile);
      setUploadedImage(base64File); 
      setVisibleDiv(2); 
    }
  };

  const closeModalWindow = () => {
    setCloseWindow(false);
  };

  const handleRemove = () => {
    setUploadedImage(null);
    setFile(null);
    setVisibleDiv(1);
  };

  // api code start

 
  const uploadFile = async () => {
    if (!file) return;
 
    const accessToken = 'eyJ0eXAiOiJKV1QiLCJub25jZSI6IkNDVm01TW82VmNXeTQ1MXFtY2VpZ0FwMWd5VDlWalJXbGZ1eWJma1c5bUkiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1jN2wzSXo5M2c3dXdnTmVFbW13X1dZR1BrbyIsImtpZCI6Ik1jN2wzSXo5M2c3dXdnTmVFbW13X1dZR1BrbyJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9hYzY3MTBiNS0yYzc3LTQ1ODktODUxMi1hNjI5YjI4YzI2YTUvIiwiaWF0IjoxNzI4MDMyODE0LCJuYmYiOjE3MjgwMzI4MTQsImV4cCI6MTcyODAzNjcxNCwiYWlvIjoiazJCZ1lKZ3Z2ajdCeVAzQm5zL3JDNnVubUNmTkFRQT0iLCJhcHBfZGlzcGxheW5hbWUiOiJvd2UtbGlicmFyeSIsImFwcGlkIjoiNGM4ZDNlYjItOTkwYi00M2ZjLWFiNWYtNzcyNTBmNTZjNjg4IiwiYXBwaWRhY3IiOiIxIiwiaWRwIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvYWM2NzEwYjUtMmM3Ny00NTg5LTg1MTItYTYyOWIyOGMyNmE1LyIsImlkdHlwIjoiYXBwIiwib2lkIjoiMDM4YmViOGYtNjQ4MS00NTMzLWFjNDctOGE2M2JhYTQ4ODBlIiwicmgiOiIwLkFTa0F0UkJuckhjc2lVV0ZFcVlwc293bXBRTUFBQUFBQUFBQXdBQUFBQUFBQUFBcEFBQS4iLCJyb2xlcyI6WyJGaWxlcy5SZWFkV3JpdGUuQXBwRm9sZGVyIiwiU2l0ZXMuU2VsZWN0ZWQiLCJTaGFyZVBvaW50VGVuYW50U2V0dGluZ3MuUmVhZFdyaXRlLkFsbCIsIlNoYXJlUG9pbnRUZW5hbnRTZXR0aW5ncy5SZWFkLkFsbCIsIlNpdGVzLlJlYWQuQWxsIiwiU2l0ZXMuUmVhZFdyaXRlLkFsbCIsIkZpbGVzLlJlYWRXcml0ZS5BbGwiLCJGaWxlcy5SZWFkLkFsbCIsIlNpdGVzLkZ1bGxDb250cm9sLkFsbCJdLCJzdWIiOiIwMzhiZWI4Zi02NDgxLTQ1MzMtYWM0Ny04YTYzYmFhNDg4MGUiLCJ0ZW5hbnRfcmVnaW9uX3Njb3BlIjoiTkEiLCJ0aWQiOiJhYzY3MTBiNS0yYzc3LTQ1ODktODUxMi1hNjI5YjI4YzI2YTUiLCJ1dGkiOiJnajRPQzQ4NWRrdTBGMndsakVVRkFBIiwidmVyIjoiMS4wIiwid2lkcyI6WyIwOTk3YTFkMC0wZDFkLTRhY2ItYjQwOC1kNWNhNzMxMjFlOTAiXSwieG1zX2lkcmVsIjoiNyAyOCIsInhtc190Y2R0IjoxNTA2MDQ3NDE4fQ.ohNPAhWGaE3TavdblfOjjeVHQe-hPGAzOQEZ8Xhx6I6vko4-ay50M3e99UiVFtAgIM9B8LoRmoSbYR8uly8q6-qromtRwvkpSWTxzjHbBAOAxoHQmpGImqq1YjO8KBgIzsZBuOqrF2LW9BFJh8orzqVWboBZGgYpRm8WGwst0ODVRNKF1lEL13Hk-JFAB602ZohadpE5CcHyVO4X_hatQhYgIL-1XrTkfTTNvxHkqSkJykZ6-5LXCB83IjMsx-zpu1Fk6hUNzKwb2PSuNnu5AV6U3L3Vq-6NVdVGdw2GUUdmYUg2P-y5A29NNIeCMFHi2c8leUvewC78-npalTmkGg';
    const apiUrl = `https://graph.microsoft.com/v1.0/sites/e52a24ce-add5-45f6-aec8-fb2535aaa68e/drive/root:/${file.name}:/content`;
 
    try {
     
      const resp = await axios.put(apiUrl,file, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': file.type || "application/octet-stream"
        }
      });
  
      console.log('File uploaded successfully', resp);
    } catch (error) {
      console.error('Error during file upload:', error);
    }
  };
 
   
  // api end

  return (
    <>
      {closeWindow && (
        <div className="transparent-model">
          <div className={classes.customer_wrapper_list}>
            <div>
              <div className={classes.CrossContainerICON}>
                <img className={classes.CrossContainerICONImage} src={CrossICON} onClick={closeModalWindow} alt="Close" />
              </div>

              {visibleDiv === 1 && (
                <div className={classes.centercontainerX}>
                  <div className={classes.InnerDiv4Input}>
                    <div className="fileuploadcontainer">
                      <div
                        className={`${classes.dragdroparea} ${dragActive ? classes.active : ''}`}
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                      >
                        <img className={classes.DragDropImage} src={ICONDragDrop} alt="Drag and Drop" />
                        <p className={classes.OrDesignDrag}>Drag and Drop</p>
                        <p className={classes.OrDesign}>Or</p>
                      </div>

                      <label htmlFor="file-upload" className={classes.customfileupload}>
                        <i className={classes.fasfaclouduploadalt}></i> Browse
                      </label>
                      <input
                        id="file-upload"
                        type="file"
                        onChange={handleFileUpload}
                        className={classes.fileInput}
                      />
                    </div>
                  </div>
                  <p className={classes.OrDesign1}>Allowed* .jpeg, *.jpg, *.png, *.pdf</p>
                  <p className={classes.OrDesign1}>Max size of 3.1 MB</p>
                  <hr className={classes.hrline_LibModal} />

                  <div className={classes.survey_button}>
                <button
                  className={classes.self}
                  style={{ color: '#fff', border: 'none' }}
                  onClick={uploadFile}
                >
                  Upload
                </button>
              </div>
                </div>
              )}

              {visibleDiv === 2 && (
                <div className={classes.centercontainerY}>
                  {uploadedImage && (
                    <div className={classes.ImageContainerX}>
                    <div className={classes.ImageContainerXdivcontainer}>  
                      <div className={classes.ImageContainerXdiv1}></div>
                      <div className={classes.ImageContainerXdiv2}></div>
                      <div className={classes.ImageContainerXdiv3}></div>
                      <div className={classes.ImageContainerXdiv4}></div>
                    </div> 
                     <img src={uploadedImage} alt="Uploaded" className={classes.UploadedImage} /> 
                    </div>
                  )}
                  <div className={classes.survey_button}>
                    <button style={{ color: '#FF0000', border: "1.2px solid #FF0000" }} className={classes.other} onClick={handleRemove}>
                      <img className={classes.CrossRedImage} src={CrossICONRed} alt="Remove" /> Remove
                    </button>
                    <hr className={classes.hrline_LibModal2} />
                  
                  <div className={classes.survey_button1}>
                <button
                  className={classes.self2}
                  style={{ color: '#fff', border: 'none' }}
                  onClick={uploadFile}
                >
                  Upload
                </button>
              </div>
                   
                  </div>
                </div>
              )}

              
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LibraryModel;
