import { model, models, Schema } from "mongoose";

interface IQuestion {}

const QuestionSchema = new Schema<IQuestion>({});

const Question =
  models?.Question || model<IQuestion>("Question", QuestionSchema);
export default Question;
