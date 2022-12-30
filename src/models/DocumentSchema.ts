import { DocumentSchemaDefinitionType } from "./BaseTypes.js";
import { JobDocumentSchemaDefinition } from "./Job.js";
import { QuestionDocumentSchemaDefinition } from "./Question.js";
import { UserDocumentSchemaDefinition } from "./User.js";




const AllDocumentSchemaDefinitions: Array<DocumentSchemaDefinitionType> = []

AllDocumentSchemaDefinitions.push(JobDocumentSchemaDefinition, QuestionDocumentSchemaDefinition,
UserDocumentSchemaDefinition)

export { AllDocumentSchemaDefinitions }