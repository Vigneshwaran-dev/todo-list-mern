import { useEffect, useState } from "react"

export default function ToDo(){
    const [title,setTitle] = useState("")
    const [description,setDescription] = useState("")
    const [todos,setTodos] = useState([])
    const[error,setError] = useState("")
    const [message , setMessage] = useState("")
    const [editId, setEditId]=useState(-1)
    //Edit
    const [editTitle,setEditTitle] = useState("")
    const [editDescription,setEditDescription] = useState("")
    const apiUrl = "http://localhost:8000"

    function handleSubmit(){
        setError("")
        if(title.trim() !=="" && description.trim() !==""){
            fetch(apiUrl+"/todos",{
                method : "POST",
                headers :{"Content-type" : "application/json"},
                body : JSON.stringify({title,description})
            }).then((res)=>{
                if(res.ok){
                    setTodos([...todos,{title,description}])
                    setTitle("")
                    setDescription("")
                    setMessage("Item added successfully")
                    setTimeout(()=>{
                        setMessage("")
                    },3000)
                }
                else{
                    setError("Unable to create todo item")
                }
            }).catch(()=>{
                setError("Unable to create todo item")
            })
        }
    }
    useEffect(()=>{
        getItems()
    },[])
    const getItems = ()=>{
        fetch(apiUrl+"/todos")
        .then((res) => res.json())
        .then((res)=>setTodos(res))
    }
    const handleEdit = (item)=>{
        setEditId(item._id)
        setEditTitle(item.title)
        setEditDescription(item.description)
    }
    const handleUpdate = ()=>{
        setError("")
        if(editTitle.trim() !=="" && editDescription.trim() !==""){
            fetch(apiUrl+"/todos/"+editId,{
                method : "PUT",
                headers :{"Content-type" : "application/json"},
                body : JSON.stringify({title : editTitle,description : editDescription})
            }).then((res)=>{
                if(res.ok){
                    const updatedTodos = todos.map((item)=>{
                        if(item._id == editId){
                            item.title = editTitle
                            item.description= editDescription
                        }
                        return item
                    })
                    setTodos(updatedTodos)
                    setMessage("Item updated successfully")
                    setTimeout(()=>{
                        setMessage("")
                    },3000)

                    setEditId(-1)
                }
                else{
                    setError("Unable to create todo item")
                }
            }).catch(()=>{
                setError("Unable to create todo item")
            })
        }
    }
    const handleEditCancel = ()=>{
        setEditId(-1)
    }
    const handleDelete = (id)=>{
        if(window.confirm("Are you sure want to delete ?")){
            fetch(apiUrl+"/todos/"+id,{
                method : "DELETE"
            }).then(()=>{
                const Updatedtodos = todos.filter((item)=>item._id !== id)
                setTodos(Updatedtodos)
            })
        }
    }

    return (
        <>
            <div className="row p-3 bg-success text-light"  >
                <h1>ToDo project with MERN Stack</h1>
            </div>

            <div className="container w-75 mx-auto">
                <h1>Add Item</h1>
                {message && <p className="text-success" >{message}</p>}
                <div className="form-group d-flex gap-2">
                    <input placeholder="Title" value={title} onChange={(e)=>{setTitle(e.target.value)}} type="text" className="form-control" />
                    <input placeholder="Description" value={description} onChange={(e)=>{setDescription(e.target.value)}} type="text" className="form-control" />
                    <button className="btn btn-dark" onClick={handleSubmit} > Submit</button>
                </div>
                    {error && <p className="text-danger" >{error}</p>}
            </div>

            <div className="container w-75 m x-automt-3">
                <h3>Tasks</h3>
                <ul className="list-group">
                    {todos.map((item)=>
                        <li key={item._id} className="list-group-item d-flex justify-content-between  align-items-center bg-info my-2">
                        <div className="d-flex flex-column text-start" >
                        {editId == -1 || editId !== item._id ? <>
                            <span className="fw-bold" >{item.title}</span>
                            <span>{item.description}</span>
                             </> : 
                            <><div className="form-group d-flex gap-2 w-100">
                            <input placeholder="Title" value={editTitle} onChange={(e)=>{setEditTitle(e.target.value)}} type="text" className="form-control" />
                            <input placeholder="Description" value={editDescription} onChange={(e)=>{setEditDescription(e.target.value)}} type="text" className="form-control" />
                            </div>
                            </>
                            }
                        </div>
                        <div className="d-flex gap-2" >
                            { editId ==-1 || editId !== item._id ? <>
                            <button className="btn btn-warning" onClick={()=>handleEdit(item)} >Edit</button> 
                            <button  className="btn btn-danger" onClick={()=>handleDelete(item._id)} >Delete</button> 
                            </> :
                             <> 
                              <button className="btn btn-warning" onClick={handleUpdate}>Update</button>
                             <button  className="btn btn-danger"  onClick={handleEditCancel} >cancel</button>
                             </>                        
                             }                           
                        </div>
                    </li>
                    )}
                </ul>
            </div>
        </>
    )
}