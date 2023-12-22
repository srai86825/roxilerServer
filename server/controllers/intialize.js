import axios from "axios";
import transaction from "../models/transaction.js";

export const initializeDatabase=async (req,res)=>{
    try {
        
        const {data} =await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json')
        console.log(data)

        //seeing the database with the transactions
        data.forEach(t => {
            const newTransaction= new transaction(t);
            newTransaction.save();
        });
        res.status(200).json({success:"Data seeded successfully",data:data})
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"couldn't seed the database",response:error})
    }
    //using the sample data for seeding the database
    
}