"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { IoMdClose } from "react-icons/io";

export default function EditTaskModal({ task, onClose, onSave }) {
    const today = format(new Date(), "yyyy-MM-dd");
    const [taskText, setTaskText] = useState(task?.text || "");
    const [taskDate, setTaskDate] = useState(task?.date || today);
    const [priority, setPriority] = useState(task?.priority || 3);
    
    useEffect(() => {
        if (task) {
            setTaskText(task.text || "");
            setTaskDate(task.date || today);
            setPriority(task.priority || 3);
        }
    }, [task, today]);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!taskText.trim()) return;
        
        onSave(task.id, {
            text: taskText,
            date: taskDate,
            priority: Number(priority)
        });
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 no-margin">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Edit Task</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <IoMdClose size={24} />
                    </button>
                </div>
                
                <form className="form-container" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="task-text" className="form-label">
                            Task
                        </label>
                        <input
                            id="task-text"
                            type="text"
                            value={taskText}
                            onChange={(e) => setTaskText(e.target.value)}
                            className="form-input"
                            placeholder="Enter your task"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="task-date" className="form-label">
                            Date
                        </label>
                        <input
                            id="task-date"
                            type="date"
                            value={taskDate}
                            onChange={(e) => setTaskDate(e.target.value)}
                            className="form-input"
                            min={today}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="task-priority" className="form-label">
                            Priority (1-5, 1 being highest)
                        </label>
                        <select
                            id="task-priority"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="form-input"
                            required
                        >
                            <option value="1">1 - Highest</option>
                            <option value="2">2 - High</option>
                            <option value="3">3 - Medium</option>
                            <option value="4">4 - Low</option>
                            <option value="5">5 - Lowest</option>
                        </select>
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="form-button"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 