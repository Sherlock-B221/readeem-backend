import * as mongoose from "mongoose";

const AccessBlackListSchema: mongoose.Schema = new mongoose.Schema({
    accessToken: {type: String, required: true},
});

export default mongoose.model("AccessBlackList", AccessBlackListSchema);