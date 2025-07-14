import { model, models, Schema, Types, Document } from "mongoose";

interface IVote {
    author: Types.ObjectId;
    actionId: Types.ObjectId; // The ID of the question or answer being voted on
    type: "question" | "answer"; // Type of the entity being voted on
    voteType: "upvote" | "downvote"; // Type of the vote
}

export interface IVoteDoc extends IVote, Document {}

const VoteSchema = new Schema<IVote>({
    author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    actionId: {type: Schema.Types.ObjectId, required: true},
    type: {type: String, enum:["question", "answer"], required: true},
    voteType: {type: String, enum:["upvote", "downvote"], required: true},
}, { timestamps: true });

const Vote = models?.Vote || model<IVote>("Vote", VoteSchema);
export default Vote;
