
export enum USER_AUTHORIZATION_STATE {
  NOT_SCANNED,
  SCANNED,
  CONFIRMED
}


export const activeAuthorizationSessions: {[uuid: string]: any} = {
  "0215MUmK2z350w3w": USER_AUTHORIZATION_STATE.NOT_SCANNED
}