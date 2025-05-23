import mongoose, { Schema, Types } from "mongoose"


const SectionSchema: Schema = new Schema(
    {
      issue: {
        type: Schema.Types.ObjectId,
        ref: "Issue",
        required: true,
      },
      title: {
        type: String,
        required: true,
      }
    },
    { collection: "sections" }
)

export const SectionModel = mongoose.model("Section", SectionSchema)