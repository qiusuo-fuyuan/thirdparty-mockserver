import express, { Request, Response } from "express";
import * as fs from 'fs';
import { join } from "path";
import crypto from 'crypto';
import {
    WechatServerResponse,
    WeChatUserInfo,
    USER_AUTHORIZATION_STATE,
    WechatPayNativeOrderResponse
} from "./dataType.js";
import {
    CHECK_ACCESS_TOKEN_VALIDITY_PATH,
    REQUEST_ACCESS_TOKEN_PATH,
    REQUEST_REFRESH_TOKEN_PATH,
    REQUEST_USER_INFO_PATH,
    WECHAT_PAY_NATIVE_CLOSE_PATH,
    WECHAT_PAY_NATIVE_ORDER_PATH,
    WECHAT_PAY_NATIVE_QUERY_PATH
} from "./constants.js";
import logger from "../logger.js";

const accessToken: WechatServerResponse = { 
    access_token:"234ljdflöajflödsafd", 
    expires_in:7200, 
    refresh_token:"dalfjdslaöjfdlösajfdsa",
    openid:"28390450385434035", 
    scope:"SCOPE",
    unionid: "o6_bmasdasdsad6_2sgVt7hMZOPfL"
}

const refreshToken:WechatServerResponse = {
    access_token:"234ljdflöajflödsafd", 
    expires_in:7200, 
    refresh_token:"dalfjdslaöjfdlösajfdsa",
    openid:"dalfjdslaöjfdlösajfdsa", 
    scope:"SCOPE",
    unionid: "o6_bmasdasdsad6_2sgVt7hMZOPfL"
}


const wechatUserInfo: WeChatUserInfo = {
  openid: "28390450385434035",
  nickname: "yu",
  sex: 1,
  province: "sichuan",
  city: "chengdu",
  headimgurl: "url",
  priviledge: [],
  unionid: "dfadafda",
  errcode: "dfadsdf",
  errmsg: null
}

const wechatPayNativeOrderResponse: WechatPayNativeOrderResponse = {
    code_url: "weixin://wxpay/bizpayurl?pr=qnu8GBtzz"
}

const wechatPayNativeQueryResponse: any = {
    amount: {
        "currency": "CNY",
        "payer_currency": "CNY",
        "payer_total": 2,
        "total": 2
    },
    attach: "",
    bank_type: "CMB_DEBIT",
    out_trade_no: "b3682ea011c547a49e8d7cc93107b71c",
    payer: {
        "sp_openid": "o4GgauMQHaUO8ujCGIXNKATQlXXX",
        "sub_openid": "o4GgauMQHaUO8ujCGIXNKATQlXXX"
    },
    promotion_detail: [],
    sp_appid: "wxdace645e0bc2cXXX",
    sp_mchid: "1900007XXX",
    sub_appid: "wxdace645e0bc2cXXX",
    sub_mchid: "1900008XXX",
    success_time: "2021-03-03T15:27:14+08:00",
    trade_state: "SUCCESS",
    trade_state_desc: "支付成功",
    trade_type: "JSAPI",
    transaction_id: "4200000985202103031441826014"
}


const activeAuthorizationSessions: {[uuid: string]: USER_AUTHORIZATION_STATE } = {}

/*
user not scanned:  https://lp.open.weixin.qq.com/connect/l/qrconnect?uuid=071ehi0E3VUpGa1j&_=1668318393261 return window.wx_errcode=408;window.wx_code='';
user scanned: https://lp.open.weixin.qq.com/connect/l/qrconnect?uuid=071ehi0E3VUpGa1j&_=1668318393271 return window.wx_errcode=404;window.wx_code='';
Request URL: https://lp.open.weixin.qq.com/connect/l/qrconnect?uuid=071ehi0E3VUpGa1j&last=404&_=1668318393276  window.wx_errcode=408;window.wx_code='';

request qrcode image: http://localhost:4000/connect/qrcode/0215MUmK2z350w3w

window.wx_errcode=404;window.wx_code='';
*/
const weChatMockServerRouter = express.Router();

///connect/confirm?uuid=    <form action='/connect/confirm?uuid=<%= uuid %>&confirmed=<%= confirmed %>'>  {uuid: uuid, confirmed: true}
weChatMockServerRouter.use("/connect/confirm", function (req: Request, res: Response) {
  const uuid = req.query.uuid as string
  const confirmed = req.query.confirmed

  if(confirmed === undefined) {
    activeAuthorizationSessions[uuid] = USER_AUTHORIZATION_STATE.SCANNED
    res.render(join(process.cwd(), "src/assets/html/wechatUserConfirm.html"), {uuid: uuid, confirmed: true});    
  }  
  else if(confirmed){
    activeAuthorizationSessions[uuid] = USER_AUTHORIZATION_STATE.CONFIRMED
    res.send("<html><body>user confirmed</body></html>")
  }
})


//a/wx_fed/assets/res/

/*
weChatMockServerRouter.use("/a/wx_fed/assets/res/:imageId", function (req: Request, res: Response) {
  const imageId = req.params.imageId as string
  res.sendFile(join(process.cwd(), "src/mockserver/"+ imageId +".svg"));    
})
*/

weChatMockServerRouter.use("/connect/qrcode/:imageId", function (req: Request, res: Response) {
  const imageId = req.params.imageId as string
  res.sendFile(join(process.cwd(), "src/assets/images/"+ imageId +".svg"));    
})


/**
 * Every time this API is called, the uuid represents the QR code login session.
 */
weChatMockServerRouter.use("/connect/qrconnect", function (req: Request, res: Response) {
  const clientState = req.query.state as string  
  const sessionUUID = crypto.randomUUID()

  activeAuthorizationSessions[sessionUUID] = USER_AUTHORIZATION_STATE.NOT_SCANNED
  fs.readFile('src/assets/html/wechatOpenConnect.html', 'utf8', function(err, data) {
    if (err) {
      return res.send(err);
    }

    let result = data.replace(/uuid-placeholder/g, `${sessionUUID}`).replace(/state-placeholder/g, `${clientState}`);
    logger.info("use link http://localhost:5000/connect/confirm?uuid=" + sessionUUID + " to confirm")
    res.send(result);
  });
})


weChatMockServerRouter.use("/connect/l/qrconnect", function (req: Request, res: Response) {
  const uuid = req.query.uuid as string

  const currentSessionState = activeAuthorizationSessions[uuid]
  if(currentSessionState == USER_AUTHORIZATION_STATE.NOT_SCANNED) {
    res.send("window.wx_errcode=408;window.wx_code='';")
  }
  if(currentSessionState == USER_AUTHORIZATION_STATE.SCANNED) {
    res.send("window.wx_errcode=404;window.wx_code='';")
  }

  if(currentSessionState == USER_AUTHORIZATION_STATE.CONFIRMED) {
    res.send("window.wx_errcode=405;window.wx_code='ddlajfdlöasjfdlsa9oeroquewo';")    
  }
})

weChatMockServerRouter.use(REQUEST_ACCESS_TOKEN_PATH, function (req: Request, res: Response) {
    const appId = req.query.appid;
    const appSecret = req.query.secret; 
    const authorizationCode = req.query.code
    const grant_type = req.query.authorization_code
  res.json(accessToken)
});

weChatMockServerRouter.use(REQUEST_REFRESH_TOKEN_PATH, function (req: Request, res: Response) {
    res.json(refreshToken)
});

weChatMockServerRouter.use(CHECK_ACCESS_TOKEN_VALIDITY_PATH, function (req: Request, res: Response) {
  res.json(refreshToken)
});

weChatMockServerRouter.use(REQUEST_USER_INFO_PATH, function (req: Request, res: Response) {
  res.json(refreshToken)
});

weChatMockServerRouter.post(WECHAT_PAY_NATIVE_ORDER_PATH, function (req: Request, res: Response) {
    res.json(wechatPayNativeOrderResponse)
});

weChatMockServerRouter.get(WECHAT_PAY_NATIVE_QUERY_PATH, function (req: Request, res: Response) {
    console.log("QUERY wechat native pay, outTradNo:", req.params.outTradeNo)
    res.json(wechatPayNativeQueryResponse)
});

weChatMockServerRouter.post(WECHAT_PAY_NATIVE_CLOSE_PATH, function (req: Request, res: Response) {
    if (req.params.outTradeNo.length == 0 ||
        req.body.sp_mchid == null || req.body.sp_mchid.length == 0 ||
        req.body.sub_mchid == null || req.body.sub_mchid.length == 0) {
        throw new Error("outTradeNo, sp_machid, sub_mchid should not be empty!");
    }
    res.writeHead(204);
    res.end();
});

export default weChatMockServerRouter
