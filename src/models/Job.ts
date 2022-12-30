import { DocumentSchemaDefinitionType } from "./BaseTypes.js"
import  { Types } from 'mongoose'

export const JobDocumentSchemaDefinition: DocumentSchemaDefinitionType = 
{
    name: "Job",
    tableName: 'job',
    schemaDefinition: {
        title: {
            type: String,
            required: true 
        },
        description: String,
        companyName: String,
        country: String,
        city: String,
        address: String,
    }
}

/**
 * Job Entity
 * _id: is the auto index created by mongodb.
 */
export class Job {
    _id: String
    title: String
    description: String
    companyName: String
    country: String
    city: String
    address: String
    createdAt: String
    updatedAt: String
}