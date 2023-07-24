import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
    },
    mobile: {
      type: String,
      trim: true,
      default: null,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    role : {
      type : String,
      trim : true,
      default: "Author"
    },
    gender: {
      type: String,
      enum: ["Female", "Male", "undifined"],
      default: "undifined"
    },
    photo: {
      type: String,
      default: null,
    },
    birthDate : {
      type : String,
      trim : true
    },
    address : {
      type : String,
      trim : true
    },
    city : {
      type : String,
      trim : true
    },
    state : {
      type : String,
      trim : true
    },
    zipcode : {
      type : String,
      trim : true
    },
    country : {
      type : String,
      trim : true
    },
    status: {
      type: Boolean,
      default: true,
    },
    trash: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
