"use client";

import { useState } from "react";
import { FaCheck, FaRegSquare } from "react-icons/fa";
import useTranslation from "@/hooks/useTranslation";

export default function TaskList({ tasks, onDelete, colorScheme = "blue" }) {
    // track which tasks are being completed
    const [completingTasks, setCompletingTasks] = useState({});
    const { translations } = useTranslation();

    // handle task completion with animation
    const handleComplete = (taskId) => {
        // set the task as completing (to show animation)
        setCompletingTasks({
            ...completingTasks,
            [taskId]: true
        });
        
        // after animation time delete the task
        setTimeout(() => {
            onDelete(taskId);
            
            setCompletingTasks(prev => {
                const newState = {...prev};
                delete newState[taskId];
                return newState;
            });
        }, 500); // animation duration
    };
    
    const emptyStateBackgrounds = {
        blue: "bg-[#E1F5FE]",
        orange: "bg-amber-50"
    };

    if (tasks.length === 0) {
        return (
            <div className={`${emptyStateBackgrounds[colorScheme] || emptyStateBackgrounds.blue} p-4 text-center text-gray-500`}>
                {translations.components?.taskSetterNone || "No tasks scheduled"}
            </div>
        );
    }
    
    const colorSchemes = {
        blue: {
            1: "bg-blue-200 border-blue-300",
            2: "bg-blue-100 border-blue-200",
            3: "bg-[#E1F5FE] border-[#B3E5FC]",
            4: "bg-blue-50 border-blue-100",
            5: "bg-sky-50 border-sky-100"
        },
        
        orange: {
            1: "bg-orange-200 border-orange-300",
            2: "bg-orange-100 border-orange-200",
            3: "bg-amber-100 border-amber-200",
            4: "bg-orange-50 border-orange-100",
            5: "bg-amber-50 border-amber-100"
        }
    };
    
    const priorityColors = colorSchemes[colorScheme] || colorSchemes.blue;
    
    return (
        <div className="max-h-80 overflow-y-auto task-scrollbar">
            {tasks.map((task) => (
                <div 
                    key={task.id} 
                    className={`${priorityColors[task.priority] || priorityColors[3]} p-4 border-b flex justify-between items-center`}
                >
                    <div className="flex-1">
                        <div className="text-gray-800 font-medium">{task.text}</div>
                    </div>
                    <button 
                        onClick={() => handleComplete(task.id)}
                        className={`${completingTasks[task.id] ? 'text-green-500' : 'text-gray-400'} hover:text-green-600 transition-colors ml-4`}
                        aria-label="Complete task"
                    >
                        {completingTasks[task.id] ? (
                            <FaCheck size={18} className="animate-check" />
                        ) : (
                            <FaRegSquare size={18} />
                        )}
                    </button>
                </div>
            ))}
            
            <style jsx global>{`
                @keyframes checkmark {
                    0% { transform: scale(0.8); opacity: 0.8; }
                    50% { transform: scale(1.2); opacity: 1; }
                    100% { transform: scale(1); opacity: 0.9; }
                }
                .animate-check {
                    animation: checkmark 0.5s ease-in-out;
                }
            `}</style>
        </div>
    );
} 