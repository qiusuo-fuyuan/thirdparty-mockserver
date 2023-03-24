// Define the request and response data structures
export interface AlipayTradePrecreateRequest {
    out_trade_no: string;
    subject: string;
    total_amount: string;
    timeout_express?: string;
    seller_id?: string;
    goods_detail?: object[];
    body?: string;
    store_id?: string;
    disable_pay_channels?: string;
    enable_pay_channels?: string;
    terminal_id?: string;
    extend_params?: object;
  }
  
export interface AlipayTradePrecreateResponse {
    code: string;
    msg: string;
    sub_code?: string;
    sub_msg?: string;
    out_trade_no?: string;
    qr_code?: string;
}
  
  
export interface AlipayPaymentNotifyPayload {
      notify_type: string;
      notify_id: string;
      notify_time: string;
      sign_type: string;
      sign: string;
      trade_no: string;
      app_id: string;
      out_trade_no: string;
      out_biz_no?: string;
      buyer_id: string;
      buyer_logon_id: string;
      seller_id: string;
      seller_email: string;
      trade_status: string;
      total_amount?: string;
      receipt_amount?: string;
      invoice_amount?: string;
      buyer_pay_amount?: string;
      refund_fee?: string;
      subject: string;
      body?: string;
      gmt_create: string;
      gmt_payment?: string;
      gmt_refund?: string;
      gmt_close?: string;
      fund_bill_list: {
        fund_channel: string;
        bank_code?: string;
        amount: string;
        real_amount: string;
      }[];
      voucher_detail_list?: any[];
      passback_params?: string;
      refund_detail_item_list?: any[];
      advance_payment_detail?: any[];
}
  