import React, { useEffect } from "react";
import "../configure.css";
import { IoAddSharp } from "react-icons/io5";
import CreateDealer from "../dealerOverrides/CreateDealer";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../redux/features/hooks";
import { getMarketingFees } from "../../../../redux/features/marketingSlice";
import { ICONS } from "../../../icons/Icons";
import TableHeader from "../../../components/tableHeader/TableHeader";

const MarketingFees: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useAppDispatch();
  // const getData = useAppSelector(state=>state.comm.data)

  const marketingFeesList = useAppSelector((state) => state.marketing.data);
  const loading = useAppSelector((state) => state.marketing.loading);
  const error = useAppSelector((state) => state.marketing.error);

  useEffect(() => {
    const pageNumber = {
      page_number: 1,
      page_size: 2,
    };
    dispatch(getMarketingFees(pageNumber));
  }, []);
  console.log(marketingFeesList);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="comm">
      <div className="commissionContainer">
        <TableHeader
          title="Marketing Fees"
          onPressViewArchive={() => {}}
          onPressArchive={() => {}}
          onPressFilter={() => {}}
          onPressImport={() => {}}
          onpressExport={() => {}}
          onpressAddNew={() => {}}
        />

        <div
          className="TableContainer"
          style={{ overflowX: "auto", whiteSpace: "nowrap" }}
        >
          <table>
            <thead>
              <tr>
                <th>
                  <div>
                    <input value="test" type="checkbox" className="check-box" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Source</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>DBA</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>State</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Fee Rate</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Chg Dlr</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Pay Soucre</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Note</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Start Dt.</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>End Dt.</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              {marketingFeesList?.marketing_fees_list?.length > 0
                ? marketingFeesList?.marketing_fees_list?.map(
                    (el: any, i: any) => (
                      <tr key={i}>
                        <td>
                          <input
                            value="test"
                            type="checkbox"
                            className="check-box"
                          />
                        </td>
                        <td style={{ fontWeight: "500", color: "black" }}>
                          {el.source}
                        </td>
                        <td>{el.dba}</td>
                        <td>{el.state}</td>
                        <td>{el.fee_rate}</td>
                        <td>
                          {el.chg_dlr}
                          {/* <div className="">
                      <img src={img} alt="" />
                    </div> */}
                        </td>
                        <td>{el.pay_src}</td>
                        <td>{el.description}</td>
                        <td>{el.start_date}</td>
                        <td>{el.end_date}</td>
                      </tr>
                    )
                  )
                : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MarketingFees;
