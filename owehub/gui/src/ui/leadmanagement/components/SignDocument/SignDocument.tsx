import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import classes from "./signDocument.module.css";
import { createDocuSignRecipientView, createEnvelope, getDocument } from "../../../../redux/apiActions/leadManagement/LeadManagementAction";

interface LeadData {
  leads_id: number;
  status_id: number;
  first_name: string;
  last_name: string;
  email_id: string;
  phone_number: string;
  street_address: string;
  appointment_status_label: string;
  appointment_status_date: string | null;
  won_lost_label: string;
  won_lost_date: string | null;
  finance_company: string;
  finance_type: string;
  qc_audit: string;
  proposal_id: string;
  proposal_status: string;
  proposal_link: string;
  proposal_updated_at: string;
  proposal_pdf_link: string;
  zipcode: string;
}

const SignDocument: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [leadData, setLeadData] = useState<any>(null); // Use the appropriate type for lead data

  useEffect(() => {
    const storedLeadData = localStorage.getItem('selectedLead'); // Use sessionStorage if you prefer
    if (storedLeadData) {
      setLeadData(JSON.parse(storedLeadData));
    }
  }, []);

  if (!leadData) {
    return <div>No lead data available.</div>; // Handle the case where lead data is null
  }


  const convertPdfToBase64 = async (url: string): Promise<string> => {
    const response = await fetch(url);
    const blob = await response.blob();
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        const base64data = reader.result as string;
        // Remove the data URL prefix (e.g. "data:application/pdf;base64,")
        const base64String = base64data.split(',')[1];
        resolve(base64String);
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
  
      reader.readAsDataURL(blob);
    });
  };
  
  // Define DocuSign functions within the component
  const handleSignDocument = async () => {
    console.log("Creating DocuSign Envelope...");
    
    try {
      // Convert the PDF to Base64
      const base64Document = await convertPdfToBase64(leadData.proposal_pdf_link);
  
      const params = {
        document_base64: base64Document, // Use the Base64 string here
        leads_id: leadData.leads_id,
        email_subject: "Please sign this document",
        document_name: "DocumentName.pdf",
        access_token: "your_access_token",
        base_uri: "https://demo.docusign.net"
      };
  
      const response = await dispatch(createEnvelope(params) as any);
      const result = response.payload;
  
      if (result && result.data && result.data.envelopeId) {
        console.log("Envelope created successfully:", result.data.envelopeId);
        // Handle success (e.g., redirect, notify user)
      } else {
        console.log("Envelope creation failed or no envelope ID returned.");
      }
    } catch (error) {
      console.error("Error creating DocuSign envelope:", error);
    }
  };
  

  const handleCreateRecipientView = async () => {
    console.log("Creating DocuSign Recipient View...");
    const params = {
      leads_id: leadData.leads_id,
      return_url: "http://localhost:3000/digital-signature-portal",
    };

    try {
      const response = await dispatch(createDocuSignRecipientView(params) as any);
      const result = response.payload;
      if (result && result.data && result.data.url) {
        console.log("Recipient view created successfully:", result.data.url);
        window.location.href = result.data.url; // Change this line

      } else {
        console.log("Recipient view creation failed or no URL returned.");
      }
    } catch (error) {
      console.error("Error creating DocuSign recipient view:", error);
    }
  };

  const handleGetDocument = async () => {
    const params = {
      leads_id: leadData.leads_id,
      base_url: "https://demo.docusign.net",
    };

    try {
      const response = await dispatch(getDocument(params) as any);
      const result = response.payload;
      if (result && result.data) {
        console.log("Document retrieved successfully:", result.data);
      } else {
        console.log("Document retrieval failed or no data returned.");
      }
    } catch (error) {
      console.error("Error retrieving document:", error);
    }
  };

  // Function to call all DocuSign steps in sequence
  const handleSignDocumentSequence = async () => {
    try {
      await handleSignDocument();
      await handleCreateRecipientView();
      await handleGetDocument();
      console.log("All DocuSign steps completed successfully");
    } catch (error) {
      console.error("Error in DocuSign sequence:", error);
    }
  };

  return (
    <div className={classes.signDocumentPage}>
      <h2 className={classes.title}>Document Signing Information</h2>
      
      <div className={classes.section}>
        <h3>Personal Information</h3>
        <p><strong>First Name:</strong> {leadData.first_name || 'N/A'}</p>
        <p><strong>Last Name:</strong> {leadData.last_name || 'N/A'}</p>
        <p><strong>Email:</strong> {leadData.email_id || 'N/A'}</p>
        <p><strong>Phone Number:</strong> {leadData.phone_number || 'N/A'}</p>
        <p><strong>Street Address:</strong> {leadData.street_address || 'N/A'}</p>
        <p><strong>Zip Code:</strong> {leadData.zipcode || 'N/A'}</p>
      </div>

      <div className={classes.section}>
        <h3>Proposal Details</h3>
        <p><strong>Proposal ID:</strong> {leadData.proposal_id || 'N/A'}</p>
        <p><strong>Status:</strong> {leadData.proposal_status || 'N/A'}</p>
        <p><strong>Updated At:</strong> {new Date(leadData.proposal_updated_at).toLocaleDateString() || 'N/A'}</p>
        <p>
          <strong>Proposal Link:</strong>{" "}
          <a href={leadData.proposal_link} target="_blank" rel="noopener noreferrer">
            View Proposal
          </a>
        </p>
        <p>
          <strong>Download PDF:</strong>{" "}
          <a href={leadData.proposal_pdf_link} target="_blank" rel="noopener noreferrer">
            Download Proposal
          </a>
        </p>
      </div>

      <div className={classes.buttonContainer}>
        <button className={classes.signButton} onClick={handleSignDocumentSequence}>
          Start Document Signing Process
        </button>
      </div>
    </div>
  );
};

export default SignDocument;
