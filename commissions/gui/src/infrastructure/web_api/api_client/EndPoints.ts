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
  commission:string;
  dealer:string,
  marketing:string,
  adderV:string,
  salesType:string,
  tierLoan:string,
  dealerTier:string,
  paySchedule:string,
  timeLineSla:string,
  loanType:string
}

export const EndPoints: Endpoints = {
  login: `/login`,
  commission:"get_commissions",
  dealer:'get_dealers',
  marketing:'get_marketingfee',
  adderV:"get_vadders",
  salesType:"get_saletypes",
  tierLoan:"get_tierloanfees",
  dealerTier:"get_dealerstier",
  paySchedule:"get_paymentschedules",
  timeLineSla:"get_timelineslas",
  loanType:"get_loantypes"

};

