export interface PayScheduleModel {
  record_id:number,
  partner: string;
  partner_name: string;
  installer_name: string;
  sale_type: string;
  state: string;
  rl: string;
  draw: string;
  draw_max: string;
  rep_draw: string;
  rep_draw_max: string;
  rep_pay: string;
  start_date: string;
  end_date: string;
}