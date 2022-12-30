import { DocumentSchemaDefinitionType } from "./BaseTypes.js"
import  { User }  from "./../models/User.js"


// create table
export const QuestionDocumentSchemaDefinition: DocumentSchemaDefinitionType = 
{
    name: "Question",
    tableName: 'question',
    schemaDefinition: {
        title: {
            type: String, 
            required: true 
        },
        content: String,
        answers: [{content: String}],
        userId: String,
        open: Boolean
    }
}


export class Question {
    title: String
    content: String
    answers: Array<Answer>
    userId: String

    constructor(title: String, content: String, userId: String) {
        this.title = title;
        this.content = content;
        this.userId = userId;
    }
}

export class Answer {
    _id: String
    content: String
    user: User
}

export class Comment {
    content: String
    user: String
}

