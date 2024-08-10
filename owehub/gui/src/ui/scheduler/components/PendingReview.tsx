import React, { useEffect, useRef, useState } from 'react';
import '../styles/pendrev.css';
import { ICONS } from '../../icons/Icons';

const PendingReview = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="pen-rev">
      <div className="pen-rev-top">
        <div className="pr-namesec">
          <img src={ICONS.BellPr} alt="" />
          <div className="notific">
            <p>12</p>
          </div>
          <div className="pr-nameadd">
            <h1>Pending Review</h1>
            <p>New jobs need to review</p>
          </div>
        </div>
        <div className="pr-sorting" onClick={toggleDropdown} ref={dropdownRef}>
          <img src={ICONS.Sorting} alt="" />
        </div>
      </div>
      <hr className="figma-line" />

      {isDropdownOpen && (
        <div className="pr-dropdown">
          {/* Add your dropdown content here */}
          <ul>
            <li>All</li>
            <li>Old To New</li>
            <li>New To Old</li>
          </ul>
        </div>
      )}

      <div className="pen-rev-bot">
        <div className="pen-rev-bot-sec">
          <div className="pr-per-det">
            <div className="pr-perdet">
              <div
                className="pr-loc-name"
                style={{ backgroundColor: '#EBF3FF' }}
              >
                <span>JM</span>
              </div>
              <p>Jacob Martin</p>
            </div>

            <div className="pr-perdet">
              <div
                className="pr-loc-fol"
                style={{ backgroundColor: '#EEEBFF' }}
              >
                <img src={ICONS.Phone} alt="" />
              </div>
              <p>+1 1234567890</p>
            </div>

            <div className="pr-perdet">
              <div
                className="pr-loc-fol"
                style={{ backgroundColor: '#EBF3FF' }}
              >
                <img src={ICONS.Techie} alt="" />
              </div>
              <div className="surveryer-sec">
                <p>Alex Martin</p>
                <span>Surveyor</span>
              </div>
            </div>
          </div>

          <div className="pr-location">
            <div className="pr-loc-fol">
              <img src={ICONS.Phone} alt="" />
            </div>
            <p>103 backstreet, Churchline, Backstreet zone, Arizona, 12544</p>
          </div>

          <div className="pen-rev-bot-but">
            <button className="pr-approve">Approve</button>
            <button className="pr-edit">Edit</button>
          </div>
        </div>

        <div className="pen-rev-bot-sec">
          <div className="pr-per-det">
            <div className="pr-perdet">
              <div
                className="pr-loc-name"
                style={{ backgroundColor: '#EBF3FF' }}
              >
                <span>JM</span>
              </div>
              <p>Jacob Martin</p>
            </div>

            <div className="pr-perdet">
              <div
                className="pr-loc-fol"
                style={{ backgroundColor: '#EEEBFF' }}
              >
                <img src={ICONS.Phone} alt="" />
              </div>
              <p>+1 1234567890</p>
            </div>

            <div className="pr-perdet">
              <div
                className="pr-loc-fol"
                style={{ backgroundColor: '#EBF3FF' }}
              >
                <img src={ICONS.Techie} alt="" />
              </div>
              <div className="surveryer-sec">
                <p>Alex Martin</p>
                <span>Surveyor</span>
              </div>
            </div>
          </div>

          <div className="pr-location">
            <div className="pr-loc-fol">
              <img src={ICONS.Phone} alt="" />
            </div>
            <p>103 backstreet, Churchline, Backstreet zone, Arizona, 12544</p>
          </div>

          <div className="pen-rev-bot-but">
            <button className="pr-approve">Approve</button>
            <button className="pr-edit">Edit</button>
          </div>
        </div>

        <div className="pen-rev-bot-sec">
          <div className="pr-per-det">
            <div className="pr-perdet">
              <div
                className="pr-loc-name"
                style={{ backgroundColor: '#EBF3FF' }}
              >
                <span>JM</span>
              </div>
              <p>Jacob Martin</p>
            </div>

            <div className="pr-perdet">
              <div
                className="pr-loc-fol"
                style={{ backgroundColor: '#EEEBFF' }}
              >
                <img src={ICONS.Phone} alt="" />
              </div>
              <p>+1 1234567890</p>
            </div>

            <div className="pr-perdet">
              <div
                className="pr-loc-fol"
                style={{ backgroundColor: '#EBF3FF' }}
              >
                <img src={ICONS.Techie} alt="" />
              </div>
              <div className="surveryer-sec">
                <p>Alex Martin</p>
                <span>Surveyor</span>
              </div>
            </div>
          </div>

          <div className="pr-location">
            <div className="pr-loc-fol">
              <img src={ICONS.Phone} alt="" />
            </div>
            <p>103 backstreet, Churchline, Backstreet zone, Arizona, 12544</p>
          </div>

          <div className="pen-rev-bot-but">
            <button className="pr-approve">Approve</button>
            <button className="pr-edit">Edit</button>
          </div>
        </div>

        <div className="pen-rev-bot-sec">
          <div className="pr-per-det">
            <div className="pr-perdet">
              <div
                className="pr-loc-name"
                style={{ backgroundColor: '#EBF3FF' }}
              >
                <span>JM</span>
              </div>
              <p>Jacob Martin</p>
            </div>

            <div className="pr-perdet">
              <div
                className="pr-loc-fol"
                style={{ backgroundColor: '#EEEBFF' }}
              >
                <img src={ICONS.Phone} alt="" />
              </div>
              <p>+1 1234567890</p>
            </div>

            <div className="pr-perdet">
              <div
                className="pr-loc-fol"
                style={{ backgroundColor: '#EBF3FF' }}
              >
                <img src={ICONS.Techie} alt="" />
              </div>
              <div className="surveryer-sec">
                <p>Alex Martin</p>
                <span>Surveyor</span>
              </div>
            </div>
          </div>

          <div className="pr-location">
            <div className="pr-loc-fol">
              <img src={ICONS.Phone} alt="" />
            </div>
            <p>103 backstreet, Churchline, Backstreet zone, Arizona, 12544</p>
          </div>

          <div className="pen-rev-bot-but">
            <button className="pr-approve">Approve</button>
            <button className="pr-edit">Edit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingReview;
