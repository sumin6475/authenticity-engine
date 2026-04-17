/** Saved capture: user or link-sourced text, AI fields, embedding for similarity. */
import mongoose from "mongoose";

const captureSchema = new mongoose.Schema({
    title : { type: String, required: true},
    
    content: { type: String, required: true},

    type: { type: String, enum: ["idea", "link"], default: "idea" },

    url: { type: String, default: ""},
    thumbnail: { type: String, default: "" },
    note: { type: String, default: ""},

    tags : [String],

    category : {type: String, default: ""},

    summary : { type: String, default: ""},

    createdAt : { type: Date, default: Date.now},

    embedding: {
        type : [Number],
        default : [],
        index: false,
    }
})

export default mongoose.model("Capture", captureSchema);