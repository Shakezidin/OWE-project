/**
 * Created by satishazad on 21/01/24
 * File Name: EndPoints
 * Product Name: WebStorm
 * Project Name: commission_app
 * Path: src/infrastructure/web_api/api_client
 */

// endpoints.ts

interface Endpoints {
  login: string;
  resetPassword: string;
  // get config
  commission: string;
  dealer: string;
  marketing: string;
  adderV: string;
  salesType: string;
  tierLoan: string;
  dealerTier: string;
  paySchedule: string;
  timeLineSla: string;
  loanType: string;
  // post config 
  create_commission:string,
  create_dealer:string,
  create_dealertier:string,
  create_marketingfee:string,
  create_paymentschedule:string,
  create_vadder:string,
  create_saletype:string,
  create_tierloanfees:string,
  create_timelinesla:string,
  create_loantype:string,
  get_newFormData:string,
  update_commission:string,
  update_dealer:string,
  update_vadders:string,
  update_marketingfee:string
}

export const EndPoints: Endpoints = {
  login: `/login`,
  resetPassword: "forgot_password",
  // get config endpoints 
  commission: "get_commissions",
  dealer: "get_dealers",
  marketing: "get_marketingfee",
  adderV: "get_vadders",
  salesType: "get_saletypes",
  tierLoan: "get_tierloanfees",
  dealerTier: "get_dealerstier",
  paySchedule: "get_paymentschedules",
  timeLineSla: "get_timelineslas",
  loanType: "get_loantypes",
  // post config endpoint 
  create_commission:"create_commission",
  create_dealer:"create_dealer",
  create_dealertier:"create_dealertier",
  create_loantype:"create_loantype",
  create_marketingfee:"create_marketingfee",
  create_paymentschedule:"create_paymentschedule",
  create_saletype:"create_saletype",
  create_tierloanfees:"create_tierloanfees",
  create_vadder:"create_vadder",
  create_timelinesla:"create_timelinesla",

// update config point 
update_commission:"update_commission",
update_dealer:"update_dealer",
update_vadders:"update_vadders",
update_marketingfee:"update_marketingfee",
  // /get form Data 
  get_newFormData:"get_newformdata"

};
