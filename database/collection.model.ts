import {model, models, Schema, Types, Document} from 'mongoose'

interface ICollection {
    author: Types.ObjectId; // Reference to the User who created the collection
    question: Types.ObjectId; // Reference to the Question in the collection
}

export interface ICollectionDoc extends ICollection, Document {}

const CollectionSchema = new Schema<ICollection>({
    author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    question: {type: Schema.Types.ObjectId, ref: 'Question', required: true}
}, {timestamps: true});

const Collection = models?.Collection || model<ICollection>('Collection', CollectionSchema);
export default Collection;