export interface MarketingFeeModel {
  record_id:number,
    source: string;
    dba: string;
    state: string;
    fee_rate: string;
    chg_dlr: number;
    pay_src: number;
    description: string;
    start_date: string;
    end_date: string;
  }