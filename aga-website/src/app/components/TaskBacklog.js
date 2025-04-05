"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/utils/AuthContext";
import useTranslation from "@/hooks/useTranslation";
import { format } from "date-fns";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  db,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp
} from "@/app/utils/firebase";
import EditTaskModal from "./EditTaskModal";

export default function TaskBacklog() {
    const { currentUser } = useAuth();
    const { translations } = useTranslation();
    const [tasks, setTasks] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const today = format(new Date(), "yyyy-MM-dd");

    useEffect(() => {
        fetchTasks();
    }, [currentUser]);

    const fetchTasks = async () => {
        if (!currentUser) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const tasksCollection = collection(db, "tasks");

            // sorts tasks by date first, then by priority within each date
            const q = query(
                tasksCollection,
                where("userId", "==", currentUser.uid),
                orderBy("date", "asc"),
                orderBy("priority", "asc")
            );

            const querySnapshot = await getDocs(q);
            const tasksList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));

            setTasks(tasksList);
            setError(null);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            setError(translations.forms?.errorAddTask || "Failed to load tasks. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const editTask = async (taskId, updatedData) => {
        if (!currentUser) return;

        try {
            const taskDocRef = doc(db, "tasks", taskId);
            await updateDoc(taskDocRef, {
                ...updatedData,
                updatedAt: serverTimestamp()
            });

            setTasks(tasks.map(task => 
                task.id === taskId 
                    ? { ...task, ...updatedData } 
                    : task
            ));
            setIsEditModalOpen(false);
            setCurrentTask(null);
        } catch (error) {
            console.error("Error updating task:", error);
            setError(translations.forms?.errorUpdateTask || "Failed to update task. Please try again.");
        }
    };

    const deleteTask = async (taskId) => {
        if (!currentUser) return;

        try {
            const taskDocRef = doc(db, "tasks", taskId);
            await deleteDoc(taskDocRef);
            setTasks(tasks.filter((task) => task.id !== taskId));
        } catch (error) {
            console.error("Error deleting task:", error);
            setError(translations.forms?.errorDeleteTask || "Failed to delete task. Please try again.");
        }
    };

    const openEditModal = (task) => {
        setCurrentTask(task);
        setIsEditModalOpen(true);
    };

    const formatDateDisplay = (dateString) => {
        const today = format(new Date(), "yyyy-MM-dd");
        const tomorrow = format(new Date(new Date().setDate(new Date().getDate() + 1)), "yyyy-MM-dd");
        
        if (dateString === today) return translations.components?.taskSetterToday || "Today";
        if (dateString === tomorrow) return translations.components?.taskSetterTomorrow || "Tomorrow";
        
        try {
            return format(new Date(dateString), "EEE, MMM d, yyyy");
        } catch (error) {
            return dateString;
        }
    };

    return (
        <div className="space-y-4 w-full sm:w-1/2 mx-auto px-4">
            <div className="border-2 border-[#6590df] rounded-lg overflow-hidden shadow-md">
                <div className="bg-gradient-to-r from-[#6590df] to-[#adf0f9] text-white p-3 px-5">
                    <h2 className="font-semibold text-xl text-center">
                        {translations.components?.taskBacklog || "Task Backlog"}
                    </h2>
                </div>

                {loading ? (
                    <div className="p-4 text-center text-gray-500">
                        {translations.forms?.loadingTasks || "Loading tasks..."}
                    </div>
                ) : error ? (
                    <div className="p-4 text-center text-red-500">{error}</div>
                ) : tasks.length === 0 ? (
                    <div className="bg-white p-4 text-center text-gray-500">
                        <p>{translations.components?.noTasksMessage || "You don't have any tasks yet."}</p>
                    </div>
                ) : (
                    <div className="max-h-[360px] overflow-y-auto task-scrollbar">
                        {tasks.map(task => (
                            <div 
                                key={task.id} 
                                className="p-4 border-b last:border-b-0 flex justify-between items-center bg-white"
                            >
                                <div className="flex-1">
                                    <div className="text-gray-800 font-medium">{task.text}</div>
                                    <div className="text-xs text-gray-700 italic">
                                        Priority: {task.priority} 
                                        {task.priority === 1 ? ' (Highest)' : 
                                        task.priority === 5 ? ' (Lowest)' : ''} 
                                        <span className="mx-2">•</span> 
                                        {formatDateDisplay(task.date)}
                                    </div>
                                </div>
                                <div className="flex space-x-3">
                                    <button 
                                        onClick={() => openEditModal(task)}
                                        className="text-blue-500 hover:text-blue-700"
                                        aria-label="Edit task"
                                    >
                                        <FaEdit size={18} />
                                    </button>
                                    <button 
                                        onClick={() => deleteTask(task.id)}
                                        className="text-red-500 hover:text-red-700"
                                        aria-label="Delete task"
                                    >
                                        <FaTrash size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isEditModalOpen && currentTask && (
                <EditTaskModal
                    task={currentTask}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setCurrentTask(null);
                    }}
                    onSave={editTask}
                />
            )}
        </div>
    );
}
