import mongoose , {Schema, Document} from 'mongoose';

export interface IPost extends Document{
    text: string
}


const PostSchema: Schema = new Schema({
    text:{
        type: String, required : true
    }
})


export default mongoose.model<IPost>('Post', PostSchema);
