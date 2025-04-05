"use client";

import { useState } from "react";
import { format } from "date-fns";

export default function AddTaskModal({ onClose, onAdd }) {
    const today = format(new Date(), "yyyy-MM-dd");
    const [taskText, setTaskText] = useState("");
    const [taskDate, setTaskDate] = useState(today);
    const [priority, setPriority] = useState(3); // default priority is medium (3)
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!taskText.trim()) return;
        
        onAdd({
            text: taskText,
            date: taskDate,
            priority: Number(priority)
        });
        
        // reset form
        setTaskText("");
        setTaskDate(today);
        setPriority(3);
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="task-text" className="block text-sm font-medium text-gray-700 mb-1">
                            Task
                        </label>
                        <input
                            id="task-text"
                            type="text"
                            value={taskText}
                            onChange={(e) => setTaskText(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your task"
                            required
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label htmlFor="task-date" className="block text-sm font-medium text-gray-700 mb-1">
                            Date
                        </label>
                        <input
                            id="task-date"
                            type="date"
                            value={taskDate}
                            onChange={(e) => setTaskDate(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min={today}
                            required
                        />
                    </div>
                    
                    <div className="mb-6">
                        <label htmlFor="task-priority" className="block text-sm font-medium text-gray-700 mb-1">
                            Priority (1-5, 1 being highest)
                        </label>
                        <select
                            id="task-priority"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-[#6590df] rounded hover:bg-[#5070bf]"
                        >
                            Add Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 