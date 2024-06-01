export interface PayScheduleModel {
  record_id: number;
  partner: string;
  partner_name: string;
  installer_name: string;
  sale_type: string;
  state: string;
  rl: number|string;
  draw: number|string;
  draw_max: number|string;
  rep_draw: number|string;
  rep_draw_max: number|string;
  rep_pay: string;
  start_date: string;
  end_date: string;
  percentage:number|string
  standard:string
}
