import React, { useState } from 'react';
import { shareTask } from "~/services/taskService";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Task } from '~/models/Task';
import ErrorAlert from '~/components/common/error-alert';
import useNotification from '~/hooks/useNotification';

interface TaskDialogProps {
    fetchTasks: () => void;
    task?: Task & { id: string };
}

export default function TaskShare({ fetchTasks, task }: TaskDialogProps) {
    const [username, setUsername] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [formErrors, setFormErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const {notifySuccess} = useNotification();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleShare = async () => {
        setFormErrors([]);
        setLoading(true);
        if (username.trim() === '') {
            return;
        }
        if (!task?.id) {
            return;
        }

        try {
            const arrId = [task.id]; // Convert string to array; in feature, we can share multiple tasks
            await shareTask(arrId, username);
            fetchTasks();
            handleClose();
            notifySuccess('Task shared successfully');
        } catch (error) {
            if (error instanceof Error) {
              setFormErrors(error.message.split(', '));
            } else {
              setFormErrors(['An unknown error occurred']);
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button className="w-full cursor-pointer px-2 py-1 bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-200">
                    Share
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Share Task</DialogTitle>
                    <DialogDescription>
                        Enter the username of the person you want to share the task with.
                    </DialogDescription>
                </DialogHeader>
                <ErrorAlert errors={formErrors} />
                <div>
                    <Label htmlFor="username" className="hidden">Username</Label>
                    <Input autoFocus id="username" placeholder="Username" type="text" value={username} onChange={handleInputChange} />
                    {username.trim() === '' && <p className="text-red-500 text-xs">Username cannot be empty</p>}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleShare}>
                        Share
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
