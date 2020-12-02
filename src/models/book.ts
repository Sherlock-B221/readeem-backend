import * as mongoose from "mongoose";
import uniqueValidator from 'mongoose-unique-validator';


const BookSchema: mongoose.Schema = new mongoose.Schema({
    title: {type: String, required: true},
    bookMark: {type: Object, default: {}},
// this is how bookMark would look, once populated: {
//     "bookId": "2239",
//     "href": "/OEBPS/ch06.xhtml",
//     "created": 1539934158390,
//     "locations": {
//     "cfi": "epubcfi(/0!/4/4[simple_book]/2/2/6)"
// }
// }
    publishedDate: {type: Date, required: true},
    author: {type: String, required: true},
    cover: {
        type: String,
        default: "https://www.cmcaindia.org/wp-content/uploads/2015/11/default-profile-picture-gmail-2.png"
    }
})

BookSchema.plugin(uniqueValidator);

export default mongoose.model("Book", BookSchema);