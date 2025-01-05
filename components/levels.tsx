import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from 'lucide-react';

const tasks = [
    {
        level: 1,
        title: "Static Chatbot",
        description: "Implement a basic chatbot with predefined responses",
        icon: (
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
        )
    },
    {
        level: 2,
        title: "Agentic Chatbot",
        description: "Develop an AI-powered chatbot with dynamic responses",
        icon: (
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-green-500" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        )
    },
    {
        level: 3,
        title: "Knowledge Base",
        description: "Integrate a comprehensive knowledge base for enhanced responses",
        icon: (
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
        )
    },
    {
        level: 4,
        title: "Slack Integration",
        description: "Deploy the chatbot as a Slack integration for team collaboration",
        icon: (
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        )
    }
];

interface Props {
    showTasks: boolean;
}

interface Task {
    level: number;
    title: string;
    description: string;
    icon: React.ReactNode;
}

const Levels: React.FC<Props> = ({ showTasks }) => {
    const [completedTasks, setCompletedTasks] = useState<Task[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (completedTasks.length < tasks.length) {
                setCompletedTasks(prev => [...prev, tasks[prev.length]]);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [completedTasks.length]);

    return (
        <div>
            <AnimatePresence>
                {showTasks && (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
                        exit={{ opacity: 0, y: -20 }}
                    >
                        {tasks.map((task, index) => (
                            <motion.div
                                key={task.level}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm"
                            >
                                <div className="relative p-6">
                                    <div className="flex items-center space-x-4">
                                        {task.icon}
                                        <div>
                                            <h3 className="font-semibold text-lg">Level {task.level}: {task.title}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{task.description}</p>
                                        </div>
                                    </div>
                                    {completedTasks.includes(task) && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-2 right-2"
                                        >
                                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Levels;

