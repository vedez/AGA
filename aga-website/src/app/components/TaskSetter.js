"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/utils/AuthContext";
import TaskList from "./TaskList";
import AddTaskModal from "./AddTaskModal";
import { format } from "date-fns";
import { 
    db, 
    collection, 
    getDocs, 
    addDoc, 
    deleteDoc, 
    doc, 
    query, 
    where, 
    orderBy, 
    serverTimestamp 
} from "@/app/utils/firebase";

export default function TaskSetter() {
    const { currentUser } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // format the date
    const today = new Date();
    const formattedToday = format(today, "yyyy-MM-dd");
    
    // filter tasks for today
    const todayTasks = tasks
        .filter(task => task.date === formattedToday)
        .sort((a, b) => {
            // sort by priority first (lower number = higher priority)
            if (a.priority !== b.priority) {
                return a.priority - b.priority;
            }
            // if priorities are equal, sort alphabetically
            return a.text.localeCompare(b.text);
        });
    
    // fetch tasks from Firestore
    useEffect(() => {
        const fetchTasks = async () => {
            if (!currentUser) {
                setLoading(false);
                return;
            }
            
            try {
                setLoading(true);
                const tasksCollection = collection(db, "tasks");
                const q = query(
                    tasksCollection,
                    where("userId", "==", currentUser.uid),
                    orderBy("priority", "asc")
                );
                
                const querySnapshot = await getDocs(q);
                
                const tasksList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                
                setTasks(tasksList);
                setError(null);
            } catch (error) {
                console.error("Error fetching tasks:", error);
                setError("Failed to load tasks. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        
        fetchTasks();
    }, [currentUser]);
    
    // add a new task to Firestore
    const addTask = async (newTask) => {
        if (!currentUser) return;
        
        try {
            const tasksCollection = collection(db, "tasks");
            const taskData = {
                ...newTask,
                userId: currentUser.uid,
                createdAt: serverTimestamp()
            };
            
            const docRef = await addDoc(tasksCollection, taskData);
            
            // update local state with the new task
            setTasks([...tasks, { id: docRef.id, ...taskData }]);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error adding task:", error);
            setError("Failed to add task. Please try again.");
        }
    };
    
    // delete a task from Firestore
    const deleteTask = async (taskId) => {
        if (!currentUser) return;
        
        try {
            const taskDocRef = doc(db, "tasks", taskId);
            await deleteDoc(taskDocRef);
            
            // update local state by removing the deleted task
            setTasks(tasks.filter(task => task.id !== taskId));
        } catch (error) {
            console.error("Error deleting task:", error);
            setError("Failed to delete task. Please try again.");
        }
    };
    
    return (
        <div className="max-w-3xl mx-auto my-8 w-full">
            <div className="mb-6 border-2 border-[#6590df] rounded-lg overflow-hidden shadow-md">
                <div className="bg-gradient-to-r from-[#6590df] to-[#adf0f9] text-white p-3 px-5 flex justify-between items-center">
                    <h2 className="font-semibold text-xl">Today's Tasks</h2>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-white text-[#6590df] rounded-full w-7 h-7 flex items-center justify-center font-bold ml-4"
                    >
                        +
                    </button>
                </div>
                
                {loading ? (
                    <div className="p-4 text-center text-gray-500">
                        Loading tasks...
                    </div>
                ) : error ? (
                    <div className="p-4 text-center text-red-500">
                        {error}
                    </div>
                ) : (
                    <TaskList tasks={todayTasks} onDelete={deleteTask} />
                )}
            </div>
            
            {isModalOpen && (
                <AddTaskModal 
                    onClose={() => setIsModalOpen(false)} 
                    onAdd={addTask}
                />
            )}
        </div>
    );
}