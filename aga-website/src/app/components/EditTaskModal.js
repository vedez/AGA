"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { IoMdClose } from "react-icons/io";
import useTranslation from "@/hooks/useTranslation";


export default function EditTaskModal({ task, onClose, onSave }) {
    const today = format(new Date(), "yyyy-MM-dd");
    const [taskText, setTaskText] = useState(task?.text || "");
    const [taskDate, setTaskDate] = useState(task?.date || today);
    const [priority, setPriority] = useState(task?.priority || 3);
    const { translations } = useTranslation();

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
                    <h2 className="text-xl font-semibold">{translations.components?.editTask || "Edit Task"}</h2>
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
                        {translations.forms?.enterTask || "Task"}
                        </label>
                        <input
                        id="task-text"
                        type="text"
                        value={taskText}
                        onChange={(e) => setTaskText(e.target.value)}
                        className="form-input"
                        placeholder={translations.forms?.enterTask || "Enter your task"}
                        required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="task-date" className="form-label">
                        {translations.forms?.dueDate || "Date"}
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
                        {translations.forms?.priority || "Priority"}
                        </label>
                        <select
                            id="task-priority"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="form-input"
                            required
                        >
                        <option value="1">
                            {translations.forms?.priorityOne || "Highest Priority"}
                        </option>
                        <option value="2">
                            {translations.forms?.priorityTwo || "Highly Important"}
                        </option>
                        <option value="3">
                            {translations.forms?.priorityThree || "To Be Done Today"}
                        </option>
                        <option value="4">
                            {translations.forms?.priorityFour || "Not Too Important"}
                        </option>
                        <option value="5">
                            {translations.forms?.priorityFive || "If There Is Time"}
                        </option>
                        </select>
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                        <button
                            type="submit"
                            className="form-button"
                        >
                            {translations.components?.saveChanges || "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 