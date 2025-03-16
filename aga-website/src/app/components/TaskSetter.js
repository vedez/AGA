"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/utils/AuthContext";
import TaskList from "./TaskList";
import AddTaskModal from "./AddTaskModal";
import { format } from "date-fns";

export default function TaskSetter() {
    const { currentUser } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Format date
    const today = new Date();
    const formattedToday = format(today, "yyyy-MM-dd");
    
    // Filter tasks for today
    const todayTasks = tasks
        .filter(task => task.date === formattedToday)
        .sort((a, b) => {
            // Sort by priority first (lower number = higher priority)
            if (a.priority !== b.priority) {
                return a.priority - b.priority;
            }
            // If priorities are equal, sort alphabetically
            return a.text.localeCompare(b.text);
        });
    
    // Fetch tasks from database
    useEffect(() => {
        const fetchTasks = async () => {
            if (!currentUser) return;
            
            // This is a placeholder - replace with actual API call
            try {
                // Simulating database data for demonstration
                const mockTasks = [
                    { id: '1', text: 'Complete project proposal', date: formattedToday, priority: 1, userId: currentUser.uid },
                    { id: '2', text: 'Call doctor for appointment', date: formattedToday, priority: 2, userId: currentUser.uid },
                    { id: '3', text: 'Buy groceries', date: formattedToday, priority: 2, userId: currentUser.uid },
                    { id: '4', text: 'Team meeting preparation', date: formattedToday, priority: 3, userId: currentUser.uid },
                    { id: '5', text: 'Gym session', date: formattedToday, priority: 4, userId: currentUser.uid },
                    { id: '6', text: 'Review monthly budget', date: formattedToday, priority: 5, userId: currentUser.uid },
                ];
                
                setTasks(mockTasks);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };
        
        fetchTasks();
    }, [currentUser, formattedToday]);
    
    // Add a new task
    const addTask = (newTask) => {
        // In a real app, you would save to your database first
        const taskWithId = {
            ...newTask,
            id: Date.now().toString(),
            userId: currentUser?.uid
        };
        
        setTasks([...tasks, taskWithId]);
        setIsModalOpen(false);
    };
    
    // Delete a task
    const deleteTask = (taskId) => {
        // In a real app, you would delete from your database first
        setTasks(tasks.filter(task => task.id !== taskId));
    };
    
    return (
        <div className="max-w-3xl mx-auto my-8 w-full">
            {/* Today's Tasks */}
            <div className="mb-6 border-2 border-[#6590df] rounded-lg overflow-hidden shadow-md">
                <div className="bg-gradient-to-r from-[#6590df] to-[#adf0f9] text-white p-3 flex justify-between items-center">
                    <h2 className="font-semibold text-xl">Today's Tasks</h2>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-white text-[#6590df] rounded-full w-7 h-7 flex items-center justify-center font-bold"
                    >
                        +
                    </button>
                </div>
                <TaskList tasks={todayTasks} onDelete={deleteTask} />
            </div>
            
            {/* Add Task Modal */}
            {isModalOpen && (
                <AddTaskModal 
                    onClose={() => setIsModalOpen(false)} 
                    onAdd={addTask}
                />
            )}
        </div>
    );
}