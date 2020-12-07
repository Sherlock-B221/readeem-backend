import * as mongoose from "mongoose";

const RefreshBlackListSchema: mongoose.Schema = new mongoose.Schema({
    refreshToken: {type: String, required: true},
});

export default mongoose.model("RefreshBlackList", RefreshBlackListSchema);