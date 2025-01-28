import React, { useState } from 'react';
import { FiLink } from 'react-icons/fi';
import { RiExternalLinkLine } from 'react-icons/ri';
import './pojpie.css';
import { Tooltip } from 'react-tooltip';

interface ProjPieChartProps {
  projectDetail: any;
}

const ProjPieChart: React.FC<ProjPieChartProps> = ({ projectDetail }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopyLink = (url: string | undefined) => {
    if (url) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(url);
        setTimeout(() => setCopied(null), 800); // Remove the message after 0.80 seconds
      });
    }
  };

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    url: string | undefined
  ) => {
    if (!url || !projectDetail) {
      e.preventDefault(); // Prevent navigation if no URL or projectDetail is not present
    }
  };
  const isDisabled = !projectDetail;

  return (
    <>
      <div className="pm-doc-heading">Resources</div>
      <div className="pc-links">
        {/* CAD Link */}
        <div className={`pc-link ${isDisabled ? 'disable-btn' : ''}`}>
          <div className="link-head">
            <h3>CAD</h3>
            <span>Go to Document for more info</span>
          </div>
          <div className="link-url">
            <div
              className={`link-tab ${!projectDetail?.cad_link ? 'disable-btn' : ''}`}
              onClick={() =>
                !isDisabled && handleCopyLink(projectDetail?.cad_link)
              }
              data-tooltip-id={projectDetail?.cad_link ? 'status-copy' : ''}
            >
              <FiLink />
              {projectDetail?.cad_link && (
                <Tooltip
                  style={{
                    zIndex: 103,
                    background: '#f7f7f7',
                    color: '#000',
                    fontSize: 12,
                    paddingBlock: 4,
                    fontWeight: '400',
                  }}
                  offset={8}
                  id="status-copy"
                  place="top"
                  content="Copy"
                  delayShow={200}
                  className="pagination-tooltip"
                />
              )}
            </div>
            <div
              className={`link-tab ${!projectDetail?.cad_link ? 'disable-btn' : ''}`}
              data-tooltip-id={projectDetail?.cad_link ? 'status-link' : ''}
            >
              <a
                href={projectDetail?.cad_link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => handleClick(e, projectDetail?.cad_link)}
              >
                <RiExternalLinkLine />
                {projectDetail?.cad_link && (
                  <Tooltip
                    style={{
                      zIndex: 103,
                      background: '#f7f7f7',
                      color: '#000',
                      fontSize: 12,
                      paddingBlock: 4,
                      fontWeight: '400',
                    }}
                    offset={8}
                    id="status-link"
                    place="top"
                    content="Visit"
                    delayShow={200}
                    className="pagination-tooltip"
                  />
                )}
              </a>
            </div>
          </div>
          {copied === projectDetail?.cad_link && (
            <span className="copy-message"> Copied!</span>
          )}
        </div>

        {/* DAT Link */}
        <div className={`pc-link ${isDisabled ? 'disable-btn' : ''}`}>
          <div className="link-head">
            <h3>DAT</h3>
            <span>Go to Document for more info</span>
          </div>
          <div className="link-url">
            <div
              className={`link-tab ${!projectDetail?.dat_link ? 'disable-btn' : ''}`}
              onClick={() =>
                !isDisabled && handleCopyLink(projectDetail?.dat_link)
              }
              data-tooltip-id={
                projectDetail?.dat_link ? 'status-copy' : undefined
              }
            >
              <FiLink />
              {!isDisabled && projectDetail?.dat_link && (
                <Tooltip
                  style={{
                    zIndex: 103,
                    background: '#f7f7f7',
                    color: '#000',
                    fontSize: 12,
                    paddingBlock: 4,
                    fontWeight: '400',
                  }}
                  offset={8}
                  id="status-copy"
                  place="top"
                  content="Copy"
                  delayShow={200}
                  className="pagination-tooltip"
                />
              )}
            </div>
            <div
              className={`link-tab ${!projectDetail?.dat_link ? 'disable-btn' : ''}`}
              data-tooltip-id={projectDetail?.dat_link ? 'status-link' : ''}
            >
              <a
                href={projectDetail?.dat_link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => handleClick(e, projectDetail?.dat_link)}
              >
                <RiExternalLinkLine />
                {!isDisabled && projectDetail?.cad_link && (
                  <Tooltip
                    style={{
                      zIndex: 103,
                      background: '#f7f7f7',
                      color: '#000',
                      fontSize: 12,
                      paddingBlock: 4,
                      fontWeight: '400',
                    }}
                    offset={8}
                    id="status-link"
                    place="top"
                    content="Visit"
                    delayShow={200}
                    className="pagination-tooltip"
                  />
                )}
              </a>
            </div>
          </div>
          {copied === projectDetail?.dat_link && (
            <span className="copy-message"> Copied!</span>
          )}
        </div>

        {/* Contract Link */}
        <div className={`pc-link ${isDisabled ? 'disable-btn' : ''}`}>
          <div className="link-head">
            <h3>Contract</h3>
            <span>Go to Document for more info</span>
          </div>
          <div className="link-url">
            <div
              className={`link-tab ${!projectDetail?.includeContractUrl ? 'disable-btn' : ''}`}
              onClick={() =>
                !isDisabled && handleCopyLink(projectDetail?.includeContractUrl)
              }
              data-tooltip-id={
                projectDetail?.includeContractUrl ? 'status-copy' : undefined
              }
            >
              <FiLink />
              {!isDisabled && projectDetail?.includeContractUrl && (
                <Tooltip
                  style={{
                    zIndex: 103,
                    background: '#f7f7f7',
                    color: '#000',
                    fontSize: 12,
                    paddingBlock: 4,
                    fontWeight: '400',
                  }}
                  offset={8}
                  id="status-copy"
                  place="top"
                  content="Copy"
                  delayShow={200}
                  className="pagination-tooltip"
                />
              )}
            </div>
            <div
              className={`link-tab ${!projectDetail?.includeContractUrl ? 'disable-btn' : ''}`}
              data-tooltip-id={
                projectDetail?.includeContractUrl ? 'status-link' : ''
              }
            >
              <a
                href={projectDetail?.includeContractUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) =>
                  handleClick(e, projectDetail?.includeContractUrl)
                }
              >
                <RiExternalLinkLine />
                {!isDisabled && projectDetail?.includeContractUrl && (
                  <Tooltip
                    style={{
                      zIndex: 103,
                      background: '#f7f7f7',
                      color: '#000',
                      fontSize: 12,
                      paddingBlock: 4,
                      fontWeight: '400',
                    }}
                    offset={8}
                    id="status-link"
                    place="top"
                    content="Visit"
                    delayShow={200}
                    className="pagination-tooltip"
                  />
                )}
              </a>
            </div>
          </div>
          {copied === projectDetail?.includeContractUrl && (
            <span className="copy-message"> Copied!</span>
          )}
        </div>
      </div>
    </>
  );
};

export default ProjPieChart;
