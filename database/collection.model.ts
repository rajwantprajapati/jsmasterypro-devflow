import {model, models, Schema, Types} from 'mongoose'

interface ICollection {
    author: Types.ObjectId; // Reference to the User who created the collection
    question: Types.ObjectId; // Reference to the Question in the collection
}

const CollectionSchema = new Schema<ICollection>({
    author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    question: {type: Schema.Types.ObjectId, ref: 'Question', required: true}
}, {timestamps: true});

const Collection = models?.Collection || model<ICollection>('Collection', CollectionSchema);
export default Collection;