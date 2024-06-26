"use client"
import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { toast, Toaster } from 'sonner';

interface Task {
    id: string;
    name: string;
    // other properties
}
interface Task {
    id: string;
    task_name: string;
    task_description: string;
    priority: 'high' | 'medium' | 'low';
    due_date: string;
    category: 'design' | 'frontend' | 'backend' | 'marketing';
}

const Tasks = () => {

    <Toaster />

    const [fetchError, setFetchError] = useState<string | null>(null);
    const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
    const [tasks, setTasks] = useState<Task[] | null>(null);


    const fetchTasks = async () => {
        const { data, error } = await supabase.from('yourtasks').select();

        if (error) {
            setFetchError("could not fetch the tasks");
            console.log(error);
        }

        if (data) {
            setTasks(data);
            setFetchError(null);
            console.log(data);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);
    const [editingTask, setEditingTask] = useState<Task | null>(null);



    const handleDelete = async (taskId: string, task: Task) => {
        const { error } = await supabase.from('yourtasks').delete().eq('id', taskId);

        if (error) {
            console.error('Error deleting task:', error);
            toast.error(`Error deleting ${task.task_name}`);
        } else {
            toast.success(`${task.task_name} deleted successfully`);
            setCompletedTasks((prevCompletedTasks) => [...prevCompletedTasks, task]);
            fetchTasks(); // Refresh the task list
        }
    };
    const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
        switch (priority) {
            case 'high':
                return 'bg-red-300 text-red-900 font-bold px-3 py-1 rounded-md';
            case 'medium':
                return 'bg-yellow-300 font-bold text-yellow-900 px-3 py-1 rounded-md';
            case 'low':
                return 'bg-green-300 font-bold text-green 900 px-3 py-1 rounded-md';
            default:
                return '';
        }
    };
    const renderCompletedTaskCard = (task: Task) => (
        <div
            key={task.task_name}
            className="bg-green-100 rounded-md overflow-hidden border border-green-200 mt-2 p-4"
        >
            <h3 className="text-xl font-semibold text-green-800 mb-2">{task.task_name}</h3>
            <p className="text-gray-600 mb-4">{task.task_description}</p>
            <div className="flex items-center mb-2">
                <p className="text-gray-500 mr-2">Priority:</p>
                <span className={getPriorityColor(task.priority)}>{task.priority}</span>
            </div>
            <div className="flex items-center mb-2">
                <p className="text-gray-500 mr-2">Due Date:</p>
                <span className="font-semibold text-gray-700">{task.due_date}</span>
            </div>
            <div className="flex items-center mb-4">
                <p className="text-gray-500 mr-2">Category:</p>
                <span className="font-semibold text-gray-700">{task.category}</span>
            </div>
        </div>
    );
    const renderTaskCard = (task: Task) => (
        <div
            key={task.task_name}
            className={`bg-white rounded-md overflow-hidden border border-gray-200 mt-2 ${task.priority === 'high' ? 'bg-red-50' : ''
                }`}
        >
            <div className="p-4 mt-2">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{task.task_name}</h3>
                <p className="text-gray-600 mb-4">{task.task_description}</p>
                <div className="flex items-center mb-2">
                    <p className="text-gray-500 mr-2">Priority:</p>
                    <span className={getPriorityColor(task.priority)}>{task.priority}</span>
                </div>
                <div className="flex items-center mb-2">
                    <p className="text-gray-500 mr-2">Due Date:</p>
                    <span className="font-semibold text-gray-700">{task.due_date}</span>
                </div>
                <div className="flex items-center mb-4">
                    <p className="text-gray-500 mr-2">Category:</p>
                    <span className="font-semibold text-gray-700">{task.category}</span>
                </div>
                <div className="flex justify-end">
                    <button
                        className="text-gray-500 hover:text-gray-700 font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out"
                        onClick={() => handleDelete(task.id, task)}
                    >
                        <p className="hover:underline">Mark as done</p>
                    </button>
                </div>
            </div>
        </div>
    );

    const renderCards = () => (
        <div className="flex flex-col gap-6">
            {tasks?.map((task) => renderTaskCard(task))}
        </div>
    );

    if (!tasks) {
        return <div>Loading...</div>;
    }

    const highPriorityTasks = tasks.filter((task) => task.priority === 'high');
    const mediumPriorityTasks = tasks.filter((task) => task.priority === 'medium');
    const lowPriorityTasks = tasks.filter((task) => task.priority === 'low');
    const insertTask = async (task: Task): Promise<void> => {
        try {
            await supabase.from('yourtasks').insert([task]);
            console.log('Task inserted successfully');
            fetchTasks(); // Refresh the task list
        } catch (error) {
            console.error('Error inserting task:', error);
        }
    };


    return (
        <>
            {/* <button onClick={openModal} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Add a task
            </button> */}


            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-8">Tasks</h1>
                <div className="flex">
                    <div className="flex-1 mr-4">
                        <h2 className="text-xl font-semibold mb-4">High Priority</h2>
                        <div>
                            {highPriorityTasks.map(renderTaskCard)}
                        </div>
                    </div>
                    <div className="flex-1 mr-4">
                        <h2 className="text-xl font-semibold mb-4">Medium Priority</h2>
                        <div>
                            {mediumPriorityTasks.map(renderTaskCard)}
                        </div>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold mb-4">Low Priority</h2>
                        <div>
                            {lowPriorityTasks.map(renderTaskCard)}
                        </div>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold mb-4">Completed Tasks</h2>
                        <div>{completedTasks.map(renderCompletedTaskCard)}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Tasks;
