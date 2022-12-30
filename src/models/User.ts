import { DocumentSchemaDefinitionType } from "./BaseTypes.js"

export const UserDocumentSchemaDefinition: DocumentSchemaDefinitionType = 
{
    name: "User",
    tableName: 'user',
    schemaDefinition: {
        email: String,
        name: String,
        nickName: String,
        firstName: String,
        lastName: String,
        gender: Number,
        role: String,

        platform: String,
        openid: String, //this can not be empty when platform="wechat" or others for identifying one user
    }
}

enum UserType {
    RECRUITER, 
    TEMPORARY_USER, 
    ENTRY_MEMBERSHIP, 
    INTERMEDIATE_MEMBERSHIP,
    ADVANCED_MEMBERSHIP,
}

export class MemberShipStatus {
    lastPaymentAt: String
    willExpireAt: String
}

export class User {
    _id: string
    email: string
    name: string
    nickName: string
    firstName: string
    lastName: string
    gender: number
    companyName: string
    role: UserType
    membershipStatus: MemberShipStatus
        
    //platform denotes where the user come from "wechat or alipay"
    platform: string
    openid: string
}