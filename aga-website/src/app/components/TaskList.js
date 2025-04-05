"use client";

import { FaCheck } from "react-icons/fa";

export default function TaskList({ tasks, onDelete }) {
    // ff there are no tasks, display a message
    if (tasks.length === 0) {
        return (
            <div className="bg-[#E1F5FE] p-4 text-center text-gray-500">
                No tasks scheduled
            </div>
        );
    }
    
    // priority colors - darkest to light
    const priorityColors = {
        1: "bg-blue-200 border-blue-300",
        2: "bg-blue-100 border-blue-200",
        3: "bg-[#E1F5FE] border-[#B3E5FC]",
        4: "bg-blue-50 border-blue-100",
        5: "bg-sky-50 border-sky-100"
    };
    
    return (
        <div className="max-h-80 overflow-y-auto task-scrollbar">
            {tasks.map((task) => (
                <div 
                    key={task.id} 
                    className={`${priorityColors[task.priority] || "bg-[#E1F5FE] border-[#B3E5FC]"} p-4 border-b flex justify-between items-center`}
                >
                    <div className="flex-1">
                        <div className="text-gray-800 font-medium">{task.text}</div>
                    </div>
                    <button 
                        onClick={() => onDelete(task.id)}
                        className="text-green-500 hover:text-green-700 transition-colors ml-4"
                        aria-label="Complete task"
                    >
                        <FaCheck size={18} />
                    </button>
                </div>
            ))}
        </div>
    );
} 