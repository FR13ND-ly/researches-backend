import mongoose, { Document, Schema, Types } from "mongoose"

const IssueSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    editors: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["linguistic", "literature", "foreign_literature"]
    },
    image: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { collection: "issues" }
)


export const IssueModel = mongoose.model("Issue", IssueSchema)
