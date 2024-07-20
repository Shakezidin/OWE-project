import './Banner.css';
import { ICONS } from '../../../icons/Icons';
import { LiaEdit } from 'react-icons/lia';
import EditModal from './EditModal';
import { useState , useEffect} from 'react';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { toast } from 'react-toastify';


const Banner = () => {
  const [showModal, setShowModal] = useState(false);
  const [details, setDetails] = useState<any>("")


  useEffect(() => {
    (async () => {
      try {
        
        const data = await postCaller('get_leaderboarddatarequest', {
          
        });
        
        if (data.status > 201) {
          // setIsLoading(false);
        
          toast.error(data.message);
          return;
        }
        // setLeaderTable(data.data?.ap_ded_list as ILeaderBordUser[]);
        // setTotalCount(data?.dbRecCount);
        setDetails(data.data)
      } catch (error) {
        console.error(error);
      } finally {
        // setIsLoading(false);
      }
    })();
  }, [ 
  ]);


  return (
    <div className="banner-main flex items-center">
      <div className="radiant-anime"></div>
      {/* left side  */}
      <div className="flex items-center pl4 banner-left">
        <img
          src={ICONS.BannerLogo}
          alt="solar-name-icon"
        />
        <div className="">
          <h1 className="solar-heading">{details?.dealer_name || "N/A"}</h1>
          <div className="flex items-center ">
            <img
              src={details?.dealer_logo || ICONS.OWEBannerLogo}
              alt=""
            />
            <p className="left-ban-des">
              Powered by <br /> <span>Our World Energy</span>
            </p>
          </div>
        </div>
      </div>
      <div className="straight-line"></div>
      {/* right side  */}
      <div className="flex items-center banner-right">
        <div className="banner-names flex flex-column">
          <div>
            <p className="owner-heading">Owner Name</p>
            <p className="owner-names">{details?.owner_name || "N/A"}</p>
          </div>
          <div>
            <p className="owner-heading">Total Teams</p>
            <p className="owner-names">{details?.total_teams }</p>
          </div>
          <div>
            <p className="owner-heading">Team Strength</p>
            <p className="owner-names">{details?.total_strength}</p>
          </div>
        </div>
        <div className="banner-trophy">
          <img
            src={ICONS.BannerTrophy}
            alt="login-icon"
          />
        </div>
        <div className='banner-stars'>
          <img
            src={ICONS.BannerStar}
            width={30}
            alt=""
            className='banner-star-1'
          />
          <img
            src={ICONS.BannerStar}
            width={30}
            className='banner-star-2'
            alt=''
          />
          <img
            src={ICONS.BannerStar}
            width={20}
            className='banner-star-3'
            alt=''
          />
        </div>
        <button className="edit-button" onClick={() => setShowModal(true)}>
          <LiaEdit className="edit-svg" />
          <p>Edit</p>
        </button>
      </div>
      {showModal && <EditModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Banner;
