import mongoose from "mongoose";

const transactionSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:String,
    category:String,
    image:String,
    sold:Boolean,
    dateOfSale:String,
})

const Transaction=mongoose.models.Transaction || mongoose.model("Transaction",transactionSchema);

export default Transaction;