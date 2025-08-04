//Initialize Express
const express = require('express')
const app = express()
const cors = require('cors')
app.use(express.json())
app.use(cors())


const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/to-do-app')
    .then(() => { console.log('DB Connected'); })
    .catch(() => { console.log('Connection error'); })

const todoSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String
})

const todoModel = mongoose.model('todo', todoSchema)

//Memory to store the data
//const todos = []

//create a new todo item
app.post("/todos", async (req, res) => {
    const { title, description } = req.body
    // const newtodo = {
    //     id : todos.length+1,
    //     title,
    //     description
    // }
    // todos.push(newtodo)
    // console.log(todos);
    try {
        const newtodo = new todoModel({ title, description })
        await newtodo.save()
        res.status(201).json(newtodo)
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: err.message })

    }
})
//To get all items
app.get("/todos", async (req, res) => {
    try {
        const todos = await todoModel.find()
        res.json(todos)
    }
    catch (err) {
        res.status(500).json({ msg: err.message })
    }
})
//update action
app.put("/todos/:id", async (req, res) => {
    try {
        const { title, description } = req.body
        const id = req.params.id
        const updatedtodo = await todoModel.findByIdAndUpdate(
            id,
            { title, description },
            { new: true }
        )
        if (!updatedtodo) {
            return res.status(404).json({ msg: "Todo Not Found" })
        }
        res.json(updatedtodo)
    }
    catch(err){
        res.status(500).json({ msg: err.message })
    }
})
//Delete Item
app.delete("/todos/:id", async (req,res)=>{
    try{
        const id = req.params.id
        await todoModel.findByIdAndDelete(id)
        res.status(204).end()
    }
    catch(err){
        res.status(500).json({msg : err.message})
    }
})

app.listen(8000, () => {
    console.log("Server is running on http://localhost:8000");
})