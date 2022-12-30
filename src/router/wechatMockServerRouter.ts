import express, { Request, Response } from "express";
import { join } from "path";
import { WechatServerResponse, WeChatUserInfo } from "../mockserver/dataType.js";
import { CHECK_ACCESS_TOKEN_VALIDITY_PATH, REQUEST_ACCESS_TOKEN_PATH, REQUEST_REFRESH_TOKEN_PATH, REQUEST_USER_INFO_PATH } from "../mockserver/weChatConstants.js";
import { activeAuthorizationSessions, USER_AUTHORIZATION_STATE } from "../mockserver/mockData.js";

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


weChatMockServerRouter.use("/connect/qrconnect", function (req: Request, res: Response) {
  res.render(join(process.cwd(), "src/assets/html/wechatOpenConnect.html"));    
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

export default weChatMockServerRouter
