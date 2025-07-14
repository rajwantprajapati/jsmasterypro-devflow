import { model, models, Schema, Types } from "mongoose";

interface IInteraction {
    user: Types.ObjectId; // Reference to the User who performed the interaction
    action: string; // Type of interaction (e.g., "view", "click", "share")
    actionId: Types.ObjectId; // ID of the entity being interacted with (e.g., question, answer)
    actionType: "question" | "answer"; // Type of the entity being interacted with
}

const InteractionSchema = new Schema<IInteraction>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User who performed the interaction
    action: { type: String, required: true }, // Type of interaction (e.g., "view", "click", "share")
    actionId: { type: Schema.Types.ObjectId, required: true }, // ID of the entity being interacted with (e.g., question, answer)
    actionType: { type: String, enum: ["question", "answer"], required: true }, // Type of the entity being interacted with
}, { timestamps: true });

const Interaction = models?.Interaction || model<IInteraction>("Interaction", InteractionSchema);
export default Interaction;
