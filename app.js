const express=require('express');//imported express
const app=express(); //instance of express
app.use(express.json())   //parse json data
const mongoose= require('mongoose');
const { v4: uuidv4 } = require('uuid');
const PORT = 8000

const mongourl = "mongodb+srv://jaiprakashps:NYShosLQXpFRnfZd@cluster0.yz7yn.mongodb.net/practice";


mongoose.connect(mongourl)
.then(() => {
    console.log("MongoDB connected");
    app.listen(PORT,()=>{
        console.log(`Server is running at http://localhost:${PORT}`);
    })
})
.catch((err) => {
    console.log(err);
})


const expenseSchema = new mongoose.Schema({
    id:{type:String, required:true,unique:true},
    title:{type:String, required:true},
    amount:{type:Number, required:true},
})

const expenseModel = mongoose.model('expense_tracker',expenseSchema);

app.post("/api/expenses",async(req,res)=>{
    const {title,amount} = req.body;
    const newExpense = new expenseModel({
        id:uuidv4(),
        title:title,
        amount:amount,
    })
    const savedExpense = await newExpense.save();
    res.status(200).json(savedExpense);
})

app.get("/api/expenses",async(req,res)=>{
    const data= await expenseModel.find({});
    res.json(data);
})

app.get("/api/expenses/:id",async(req,res)=>{
    const {id} = req.params;
    const expense = await expenseModel.findOne({id});
    res.status(200).json(expense);
})

app.put("/api/expenses/:id",async(req,res)=>{
    const {id} = req.params;
    const {title,amount} = req.body;
    const updatedExpense = await expenseModel.findOneAndUpdate(
        {
            id:id
        },{
            title:title,
            amount:amount
        },
    );
    res.status(200).json(updatedExpense);
})

app.delete("/api/expenses/:id",async(req,res)=>{
    const {id} = req.params;
    const deletedExpense = await expenseModel.findOneAndDelete({id:id});
    res.status(200).json(deletedExpense);
});


app.delete("/api/expenses", async (req, res) => {
    try {
      const result = await expenseModel.deleteMany({});
      res.status(200).json({
        message: "All expenses have been deleted",
        deletedCount: result.deletedCount,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });