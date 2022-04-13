import {useState,useEffect} from "react"
import axios from "axios"
import './App.css';
// 34:46

function App() {
  const [itemText,setItemText] = useState('')
  const [listItems,setListItems] = useState([])
  const [updating,setUpdating] = useState('')
  const [updateItemText,setUpdateItemText] = useState('')

  useEffect(() => {
    const getItemsList = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/items')
        setListItems(res.data);
      }
      catch(err) {
        console.log('error',err);
      }
    }
    getItemsList()
  },[listItems])



// my custom functions

// get items

const addItem = async (e) => {
  e.preventDefault()
  try {
    const res = await axios.post('http://localhost:5000/api/item',{
      item:itemText
    })
    console.log(res,'res');
    // setListItems(prev => [...prev,res.data])
    setItemText('')
  }
  catch(err) {
    console.log('error',err);
  }
}


// update item


const updateData = async (e) => {
  e.preventDefault()
  try {
   const res =  await axios.put(`http://localhost:5000/api/item/${updating}`,{
      item:updateItemText
   })
   const updatedItemIndex = listItems.findIndex(item => item._id === updating)
   const updatedItem = listItems[updatedItemIndex].item = updateItemText
   setUpdateItemText('')
   setUpdating('')
  }
  catch(err) {
    console.log('error',err);
  }
}

const renderUpdateForm = () => (
        <form className="update_form" onSubmit={e => updateData(e)}>
          <input className="update_new_input" type="text" placeholder="new Item" onChange={(e) => setUpdateItemText(e.target.value) } value={updateItemText} />
          <button className="update_new_btn" type="submit">Update</button>
        </form>
) 

// delete items

const deleteItem = async (id) => {
  try {
    const res = axios.delete(`http://localhost:5000/api/item/${id}`)
    const newListItem = listItems.filter(item => item._id !== id)
    setListItems(newListItem)
  }
  catch(err) {
    console.log('error',err);
  }
}

  return (
    <div className="App">
      <h1>Todo List</h1>
     <form className="form" onSubmit={e => addItem(e)}>
       <input type="text" placeholder="add Todo item" onChange={e => setItemText(e.target.value)} value={itemText} />
       <button type="submit">Add</button>
     </form>

     <div className="todo_list_items">
      
      
      {
        listItems.map((item) => {
            return (
              <div className="todo_item">
                {
                  updating === item._id ?
                  renderUpdateForm() : <>
                  <p className="todo_content">{item.item}</p>
                  <button className="update_item" onClick={() => setUpdating(item._id)}>Update</button>
                  <button className="delete_item" onClick={() => deleteItem(item._id)}>Delete</button>
                  </>
                }
              
              </div>
            )
        })
      }
     </div>
    </div>
  );
}

export default App;
