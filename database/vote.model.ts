import { model, models, Schema, Types } from "mongoose";

interface IVote {
    author: Types.ObjectId;
    id: Types.ObjectId; // The ID of the question or answer being voted on
    type: "question" | "answer"; // Type of the entity being voted on
    voteType: "upvote" | "downvote"; // Type of the vote
}

const VoteSchema = new Schema<IVote>({
    author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    id: {type: Schema.Types.ObjectId, required: true},
    type: {type: String, enum:["question", "answer"], required: true},
    voteType: {type: String, enum:["upvote", "downvote"], required: true},
}, { timestamps: true });

const Vote = models?.Vote || model<IVote>("Vote", VoteSchema);
export default Vote;
