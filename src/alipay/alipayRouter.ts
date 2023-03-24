import axios from 'axios';
import express, { Request, Response } from 'express';
import { AlipayTradePrecreateRequest, AlipayTradePrecreateResponse } from './dataType';
  
const alipayMockServerRouter = express.Router();


// Define the route handler for the alipay.trade.precreate API
alipayMockServerRouter.post('/alipay/trade/precreate',
  (req: Request<AlipayTradePrecreateRequest>, res: Response<AlipayTradePrecreateResponse>) => {
    // Check for required parameters
    const { out_trade_no, subject, total_amount } = req.body;
    if (!out_trade_no || !subject || !total_amount) {
      return res.status(400).send({ code: '40004', msg: 'Missing required parameters' });
    }

    // Generate a mock QR code URL
    const qr_code_url = `http://localhost:5000/alipay/qrcode/${out_trade_no}`;

    // Send a mock response
    res.send({
      code: '10000',
      msg: 'Success',
      out_trade_no: out_trade_no,
      qr_code: qr_code_url,
    });
  }
);

// Define the route handler for the mock QR code URL
alipayMockServerRouter.get('/qrcode/:out_trade_no', (req: Request, res: Response) => {
  // Check if the out_trade_no parameter is valid
  const out_trade_no = req.params.out_trade_no;
  if (!out_trade_no) {
    return res.status(400).send('Missing out_trade_no parameter');
  }

  // Simulate the user confirming the payment
  console.log(`Payment confirmed for out_trade_no=${out_trade_no}`);

  // Notify the backend server of the payment success
  const notifyBackendServer = async () => {
    // Construct the notification payload
    const payload = {
      notify_type: 'trade_status_sync',
      notify_id: 'c433f8e03e31728e2e1c5a3de5f5a95ks1',
      notify_time: '2015-04-22 17:19:20',
      sign_type: 'RSA2',
      sign: 'mPmXZdYXnk8e/82L88v/Rw==',
      trade_no: '20150320010101001',
      app_id: '2014072300007148',
      out_trade_no: out_trade_no,
      out_biz_no: '',
      buyer_id: '2088101117955611',
      buyer_logon_id: '159****5620',
      seller_id: '2088102116200534',
      seller_email: 'zhuzhanggui1@alipay.com',
      trade_status: 'TRADE',
      total_amount: '9.00',
      receipt_amount: '8.91',
      invoice_amount: '0.00',
      buyer_pay_amount: '9.00',
      point_amount: '0.00',
      refund_fee: '0.00',
      subject: 'Iphone6 16G',
      body: 'Iphone6 16G',
      gmt_create: '2015-04-22 17:19:20',
      gmt_payment: '2015-04-22 17:19:20',
      gmt_refund: '',
      gmt_close: '',
      fund_bill_list: [
        {
          fund_channel: 'ALIPAYACCOUNT',
          bank_code: '',
          amount: '9.00',
          real_amount: '9.00',
        },
      ],
      passback_params: '',
    };

    try {
      // Send the notification to the backend server
      const response = await axios.post('https://localhost:4000/payment_notify', payload, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      console.log(`Backend server notified of payment success for out_trade_no=${out_trade_no}`, response.data);
    } catch (error) {
      console.error(`Failed to notify backend server of payment success for out_trade_no=${out_trade_no}`, error);
    }
  };
  notifyBackendServer();

  // Send a mock success response
  res.send('Payment confirmed');
});

// Define the route handler for the payment notification endpoint
alipayMockServerRouter.post('/payment_notify', (req: Request, res: Response) => {
  // Check if the notification parameters are valid
  const { out_trade_no, trade_status } = req.body;
  if (!out_trade_no || !trade_status) {
    return res.status(400).send('Missing required parameters');
  }

  // Log the payment status to the console
  console.log(`Payment notification received for out_trade_no=${out_trade_no}, trade_status=${trade_status}`);

  // Send a mock success response
  res.send('Payment notification received');
});


export default alipayMockServerRouter;