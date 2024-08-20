import React, { useState } from 'react';
import { FiLink } from 'react-icons/fi';
import { RiExternalLinkLine } from 'react-icons/ri';
import './pojpie.css';

 

interface ProjPieChartProps {
  projectDetail: any;
}

const ProjPieChart: React.FC<ProjPieChartProps> = ({ projectDetail }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopyLink = (url: string | undefined) => {
    if (url) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(url);
        setTimeout(() => setCopied(null), 2000); // Remove the message after 2 seconds
      });
    }
  };


  console.log(projectDetail, "projectDetails")
  return (
    <>
      <div className='pm-doc-heading'>
        Documents Links
      </div>

      <div className='pc-links'>
        <div className='pc-link'>
          <div className='link-head'>
            <h3>Podio</h3>
            <span>Go to Podio Document for more info</span>
          </div>

          <div className='link-url'>
            <div className='link-tab' onClick={() => handleCopyLink(projectDetail?.podio_link)}>
              <FiLink />
            </div>
            <div className='link-tab'>
              <a href={projectDetail?.podio_link} target="_blank" rel="noopener noreferrer">
                <RiExternalLinkLine />
              </a>
            </div>
          </div>
          {copied === projectDetail?.podio_link && <span className='copy-message'>Copied!</span>}
        </div>

        <div className='pc-link'>
          <div className='link-head'>
            <h3>CAD</h3>
            <span>Go to Document for more info</span>
          </div>

          <div className='link-url'>
            <div className='link-tab' onClick={() => handleCopyLink(projectDetail?.cad_link)}>
              <FiLink />
            </div>
            <div className='link-tab'>
              <a href={projectDetail?.cad_link} target="_blank" rel="noopener noreferrer">
                <RiExternalLinkLine />
              </a>
            </div>
          </div>
          {copied === projectDetail?.cad_link && <span className='copy-message'>Copied!</span>}
        </div>

        <div className='pc-link'>
          <div className='link-head'>
            <h3>DAT</h3>
            <span>Go to Document for more info</span>
          </div>

          <div className='link-url'>
            <div className='link-tab' onClick={() => handleCopyLink(projectDetail?.dat_link)}>
              <FiLink />
            </div>
            <div className='link-tab'>
              <a href={projectDetail?.dat_link} target="_blank" rel="noopener noreferrer">
                <RiExternalLinkLine />
              </a>
            </div>
          </div>
          {copied === projectDetail?.dat_link && <span className='copy-message'>Copied!</span>}
        </div>

        <div className='pc-link'>
          <div className='link-head'>
            <h3>Include Contract</h3>
            <span>Go to Document for more info</span>
          </div>

          <div className='link-url'>
            <div className='link-tab' onClick={() => handleCopyLink(projectDetail?.includeContractUrl)}>
              <FiLink />
            </div>
            <div className='link-tab'>
              <a href={projectDetail?.includeContractUrl} target="_blank" rel="noopener noreferrer">
                <RiExternalLinkLine />
              </a>
            </div>
          </div>
          {copied === projectDetail?.includeContractUrl && <span className='copy-message'>Copied!</span>}
        </div>
      </div>
    </>
  );
}

export default ProjPieChart;
