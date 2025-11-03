import React, { useEffect, useState } from "react";
import "./TodoApp.css";
import { FaPlus, FaTrashAlt, FaCheckCircle, FaEdit } from "react-icons/fa";
import { motion, AnimatePresence, number } from "framer-motion";
import axios from "axios";

const TodoApp = () => {
  const [showEdit, setShowEdit] = useState(false);
  const [selectedTask, setSelectedTask] = useState("");
  const [tasks, settasks] = useState([]);
  const [edit , setedit ] = useState({
    id : "" , 
    updatedtask : ""
  }) 

  const openEditModal = (task) => {
    setedit({id : task._id , updatedtask : task.title})
    setShowEdit(true);
  };
  
  const closeEditModal = () => {
    setShowEdit(false);
  };

   useEffect(() => {
    const FetchData = async () => {
      try {
        const res = await axios.get("https://mytodo-backend-641j.onrender.com/");
        settasks(res.data);
        localStorage.setItem("todos", JSON.stringify(res.data))
        
      } catch (error) {
        console.log("Error fetching todos:", error.message);
      }
    };

    

    FetchData()
  }, []);

  

  const AddData = async ()=>{
      try {
        const newtask = await axios.post("https://mytodo-backend-641j.onrender.com/", {title : selectedTask} )
        if (newtask) {
          settasks((prev)=> [...prev , newtask.data ])
          setSelectedTask("")

        }
      } catch (error) {
        console.log("Error adding todos:", error.message);
      }
    }


    const removeData = async (id)=> {

      try {
       await axios.delete(`https://mytodo-backend-641j.onrender.com/delete/${id}` ) 
       settasks(tasks.filter(t=> t._id !== id))

      } catch (error) {
        console.log("Error adding todos:", error.message);
      }
    }

    const updatetask = async () => {
      try {

        const {id, updatedtask} = edit
        const updating = await axios.put(`https://mytodo-backend-641j.onrender.com/edit/${id}` , {updatedTask : updatedtask})
        settasks(tasks.map((t)=> (t._id === id ? updating.data : t)))
        setShowEdit(false)
      } catch (error) {
        console.log("Error adding todos:", error.message);
      }
    }

  return (
    <div className="todo-container">
      <motion.div
        className="todo-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="todo-title">My Todo List</h1>

        <div className="todo-input-section">
          <input type="text" placeholder="Add a new task..." name="title" value={selectedTask} onChange={(e)=> setSelectedTask(e.target.value)}/>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="add-btn"
            onClick={()=> AddData()}
          >
            <FaPlus />
          </motion.button>
        </div>

        <div className="todo-list">
          {tasks.map((todo,i) => (
            <motion.div
              key={todo._id}
              className="todo-item"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.15 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="left">
                <FaCheckCircle className="check-icon" />
                <span>{todo.title}</span>
              </div>
              <div className="icons">
                <FaEdit
                  className="edit-icon"
                  onClick={() => openEditModal(todo)}
                />
                <FaTrashAlt className="delete-icon" onClick={()=> removeData(todo._id)} />
              </div>
            </motion.div>
          ))}
        </div>

        <p className="todo-date">{new Date().toDateString()}</p>
      </motion.div>

      <AnimatePresence>
        {showEdit && (
          <>
            <motion.div
              className="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeEditModal}
            />
            <motion.div
              className="popup"
              initial={{ scale: 0.7, opacity: 0, y: -30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: -30 }}
              transition={{ duration: 0.4, type: "spring" }}
            >
              <h2>Edit Task</h2>
              <input type="text" value={edit.updatedtask} onChange={(e)=> setedit({...edit, updatedtask : e.target.value})}  /> 
              <div className="popup-buttons">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  className="save-btn"
                  onClick={updatetask}
                >
                  Save
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  className="cancel-btn"
                  onClick={closeEditModal}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TodoApp;
