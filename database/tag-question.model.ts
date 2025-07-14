import { model, models, Schema, Document } from "mongoose";

interface ITagQuestion {
    tag: Schema.Types.ObjectId;
    question: Schema.Types.ObjectId;
}

export interface ITagQuestionDoc extends ITagQuestion, Document {}

const TagQuestionSchema = new Schema<ITagQuestion>({
    tag: { type: Schema.Types.ObjectId, ref: "Tag", required: true },
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
}, { timestamps: true });

const TagQuestion = models?.TagQuestion || model<ITagQuestion>("TagQuestion", TagQuestionSchema);
export default TagQuestion;
