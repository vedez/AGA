"use client";

import Logo from "@/app/components/Logo";
import ShortNav from "@/app/components/ShortNav";
import Footer from "@/app/components/Footer";
import TaskSetter from "@/app/components/TaskSetter";

export default function TasksPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <div className="center">
                <Logo />
                <ShortNav />
            </div>
            
            {/* Main Content */}
            <div className="flex-1 container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6 text-center">Task Manager</h1>
                <p className="text-center text-gray-600 mb-8">Manage your daily tasks by priority</p>
                <TaskSetter />
            </div>
            
            {/* Footer */}
            <Footer className="mt-auto"/>
        </div>
    );
} 