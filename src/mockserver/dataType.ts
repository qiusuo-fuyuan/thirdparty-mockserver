export type WechatServerResponse = {
    access_token: string 
    expires_in: number 
    refresh_token: string
    openid: string 
    scope: string
    unionid: string
}

export type WeChatUserInfo = {
    openid: string
    nickname: string
    sex: number
    province: string
    city: string
    headimgurl: string
    priviledge: string[]
    unionid: string
    errcode: string
    errmsg: string
}

export type WeChatAuthorizationSessionData = {
    state?: string
    accessToken?: string
    refreshToken?: string
    openId?: string
}