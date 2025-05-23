import mongoose, { Schema, Types } from "mongoose"

const ResearchScheme: Schema = new Schema(
  {
    section: {
      type: Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    authors: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    index: {
      type: Number,
      default: 0,
      required: true,
    },
    keywords: {
      type: Array,
      required: false,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { collection: "researches" }
)

export const ResearchModel = mongoose.model("Research", ResearchScheme)
