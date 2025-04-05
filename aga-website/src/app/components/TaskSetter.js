"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/utils/AuthContext";
import useTranslation from "@/hooks/useTranslation";
import TaskList from "./TaskList";
import AddTaskModal from "./AddTaskModal";
import { format, addDays } from "date-fns";
import { FaPlus } from "react-icons/fa";
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
  const { translations } = useTranslation();
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultDate, setDefaultDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const today = new Date();
  const tomorrow = addDays(today, 1);
  const formattedToday = format(today, "yyyy-MM-dd");
  const formattedTomorrow = format(tomorrow, "yyyy-MM-dd");

  const todayTasks = tasks
    .filter((task) => task.date === formattedToday)
    .sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      return a.text.localeCompare(b.text);
    });

  const tomorrowTasks = tasks
    .filter((task) => task.date === formattedTomorrow)
    .sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      return a.text.localeCompare(b.text);
    });

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

    fetchTasks();
  }, [currentUser]);

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
      setTasks([...tasks, { id: docRef.id, ...taskData }]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding task:", error);
      setError(translations.forms?.errorAddTask || "Failed to add task. Please try again.");
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

  const openModalWithDate = (date) => {
    setDefaultDate(date);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-[#6590df] rounded-lg overflow-hidden shadow-md">
        <div className="bg-gradient-to-r from-[#6590df] to-[#adf0f9] text-white p-3 px-5 flex justify-between items-center">
          <h2 className="font-semibold text-xl">
            {translations.components?.taskSetterToday || "Today's Tasks"}
          </h2>

          <button
            onClick={() => openModalWithDate(formattedToday)}
            className="bg-white text-[#6590df] rounded w-7 h-7 flex items-center justify-center font-bold ml-4"
            aria-label={translations.forms?.addTask || "Add Task"}
          >
            <FaPlus size={14} />
          </button>
        </div>

        {loading ? (
          <div className="p-4 text-center text-gray-500">
            {translations.forms?.loadingTasks || "Loading tasks..."}
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : (
          <TaskList tasks={todayTasks} onDelete={deleteTask} />
        )}
      </div>

      <div className="border-2 border-[#ff9933] rounded-lg overflow-hidden shadow-md">
        <div className="bg-gradient-to-r from-[#ff9933] to-[#ffcc99] text-white p-3 px-5">
          <h2 className="font-semibold text-xl">
            {translations.components?.taskSetterTomorrow || "Tomorrow's Tasks"}
          </h2>
        </div>

        {loading ? (
          <div className="p-4 text-center text-gray-500">
            {translations.forms?.loadingTasks || "Loading tasks..."}
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : (
          <TaskList tasks={tomorrowTasks} onDelete={deleteTask} colorScheme="orange" />
        )}
      </div>

      {isModalOpen && (
        <AddTaskModal
          onClose={() => setIsModalOpen(false)}
          onAdd={addTask}
          defaultDate={defaultDate}
        />
      )}
    </div>
  );
}
