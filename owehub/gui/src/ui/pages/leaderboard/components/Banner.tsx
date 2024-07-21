import './Banner.css';
import { ICONS } from '../../../icons/Icons';
import { LiaEdit } from 'react-icons/lia';
import EditModal from './EditModal';
import { useState, useEffect } from 'react';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { toast } from 'react-toastify';

import { dealerOption } from '../../../../core/models/data_models/SelectDataModel';
import SelectOption from '../../../components/selectOption/SelectOption';
import { EndPoints } from '../../../../infrastructure/web_api/api_client/EndPoints';

interface BannerProps {
  selectDealer: string;
  setSelectDealer: React.Dispatch<React.SetStateAction<string>>;
  bannerDetails: any;
}

const Banner: React.FC<BannerProps> = ({
  selectDealer,
  setSelectDealer,
  bannerDetails,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [details, setDetails] = useState<any>('');
  const [dealerId, setDealerId] = useState('');
  const [newFormData, setNewFormData] = useState<any>([]);
  const [vdealer, setVdealer] = useState('');
  const [refetch, setRefetch] = useState(false);

  const tableData = {
    tableNames: ['dealer'],
  };
  const getNewFormData = async () => {
    const res = await postCaller(EndPoints.get_newFormData, tableData);
    setNewFormData(res.data);
  };
  useEffect(() => {
    getNewFormData();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const data = await postCaller('get_leaderboarddatarequest', {});

        if (data.status > 201) {
          // setIsLoading(false);

          toast.error(data?.message);
          return;
        }
        // setLeaderTable(data.data?.ap_ded_list as ILeaderBordUser[]);
        // setTotalCount(data?.dbRecCount);
        setDetails(data?.data);
        setDealerId(data?.data?.dealer_id);
      } catch (error) {
        console.error(error);
      } finally {
        // setIsLoading(false);
      }
    })();
  }, [dealerId, refetch]);

  useEffect(() => {
    (async () => {
      try {
        const data = await postCaller('get_vdealer', {
          page_number: 1,
          page_size: 1,
          filters: [
            {
              Column: 'id',
              Operation: '=',
              Data: details?.dealer_id || 1,
            },
          ],
        });

        if (data.status > 201) {
          // setIsLoading(false);

          toast.error(data.message);
          return;
        }
        // setLeaderTable(data.data?.ap_ded_list as ILeaderBordUser[]);
        // setTotalCount(data?.dbRecCount);
        setVdealer(data?.data?.vdealers_list[0]);
      } catch (error) {
        console.error(error);
      } finally {
        // setIsLoading(false);
      }
    })();
  }, []);

  console.log(dealerId, 'delaerID');

  return (
    <div className="banner-main flex items-center">
      <div className="radiant-anime"></div>
      <div className="banner-wrap">
        {/* left side  */}
        <div className="flex items-center pl4 banner-left">
          <img src={ICONS.BannerLogo} alt="solar-name-icon" />
          <div className="">
            <h1 className="solar-heading">{details?.dealer_name || 'N/A'}</h1>
            <div className="flex items-center ">
              <img src={details?.dealer_logo || ICONS.OWEBannerLogo} alt="" />
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
              <p className="owner-names">{details?.owner_name || 'N/A'}</p>
            </div>
            <div>
              <p className="owner-heading">Total Teams</p>
              <p className="owner-names">{details?.total_teams}</p>
            </div>
            <div>
              <p className="owner-heading">Team Strength</p>
              <p className="owner-names">{details?.total_strength}</p>
            </div>
          </div>
          <div className="banner-trophy">
            <img src={ICONS.BannerTrophy} alt="login-icon" />
          </div>
          <div className="banner-stars">
            <img
              src={ICONS.BannerStar}
              width={30}
              alt=""
              className="banner-star-1"
            />
            <img
              src={ICONS.BannerStar}
              width={30}
              className="banner-star-2"
              alt=""
            />
            <img
              src={ICONS.BannerStar}
              width={20}
              className="banner-star-3"
              alt=""
            />
          </div>
          <button className="edit-button" onClick={() => setShowModal(true)}>
            <LiaEdit className="edit-svg" />
            <p>Edit</p>
          </button>
          {/* <div className="admin-edit-button">
            <div className="admin-edit-img">
              <LiaEdit className="edit-svg" />
            </div>
            <div className="create-input-field">
              <SelectOption
                menuListStyles={{ height: '230px' }}
                options={dealerOption(newFormData)}
                onChange={(newValue) => setSelectDealer(newValue?.value!)}
                value={
                  !selectDealer
                    ? undefined
                    : dealerOption(newFormData)?.find(
                        (option) => option.value === selectDealer
                      )
                }
              />
            </div>
          </div> */}
        </div>
      </div>
      {showModal && (
        <EditModal
          onClose={() => setShowModal(false)}
          vdealer={vdealer}
          setRefetch={setRefetch}
        />
      )}
    </div>
  );
};

export default Banner;
