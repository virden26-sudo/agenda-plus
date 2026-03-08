
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useAssignments } from "@/context/assignments-context";
import { useTasks } from "@/context/tasks-context";
import { useToast } from "@/hooks/use-toast";
import { extractPortalData } from "@/ai/flows/extract-items-flow";
import { GradientIcon } from "@/components/ui/gradient-icon";
import { Textarea } from "../ui/textarea";

type AddAssignmentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddAssignmentDialog({ open, onOpenChange }: AddAssignmentDialogProps) {
  const [aiInput, setAiInput] = useState("");
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [loading, setLoading] = useState(false);
  
  const { addAssignment } = useAssignments();
  const { addTask } = useTasks();
  const { toast } = useToast();

  const handleAiParse = async () => {
    if (!aiInput.trim()) return;
    setLoading(true);
    try {
      const results = await extractPortalData(aiInput);
      
      if (results.items.length === 0) {
        toast({ variant: "destructive", title: "AI couldn't find any items." });
        return;
      }

      let itemsAdded = 0;
      results.items.forEach(item => {
        const parsedDate = new Date(item.dueDate);
        if (!isNaN(parsedDate.getTime()) && item.title) {
            const timezoneOffset = parsedDate.getTimezoneOffset() * 60000;
            const localDate = new Date(parsedDate.getTime() + timezoneOffset);

            if (item.type === 'Assignment' || item.type === 'Reading') {
                addAssignment({ title: item.title, course: results.courseName || 'General', dueDate: localDate });
                itemsAdded++;
            } else if (item.type === 'Discussion') {
                addTask({ title: `${item.title} (${results.courseName || 'General'})` });
                itemsAdded++;
            }
        }
      });

      if (itemsAdded > 0) {
        toast({ title: "Items Added", description: `${itemsAdded} item(s) have been added.` });
        onOpenChange(false);
      } else {
         toast({ variant: "destructive", title: "AI couldn't find valid assignment or discussion details." });
      }

    } catch (error) {
      console.error("AI parsing failed", error);
      toast({ variant: "destructive", title: "AI Parsing Failed", description: "The AI couldn't understand the details. Please try rephrasing or enter the details manually." });
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddAssignment = () => {
    if (!title || !course || !dueDate) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please fill out all fields to add an assignment."
        });
        return;
    }
    
    addAssignment({ title, course, dueDate });
    toast({ title: "Assignment Added", description: `${title} has been added to your agenda.`});
    
    resetForm();
    onOpenChange(false);
  };
  
  const resetForm = () => {
    setAiInput("");
    setTitle("");
    setCourse("");
    setDueDate(undefined);
  };
  
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
        resetForm();
    }
    onOpenChange(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-gradient">Add New Item</DialogTitle>
          <DialogDescription>
            Use AI to quickly parse assignments, discussions, or readings.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
            <div className="space-y-2">
                <Label htmlFor="ai-input">Describe item(s)</Label>
                <div className="flex flex-col gap-2">
                    <Textarea 
                        id="ai-input" 
                        placeholder="e.g. 'Calculus homework due next Friday. Post in English discussion forum by Tuesday.'" 
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        className="h-24"
                    />
                    <Button onClick={handleAiParse} disabled={loading} variant="outline" className="w-full">
                        {loading ? <GradientIcon name="Loader2" className="animate-spin mr-2" /> : <GradientIcon name="Bot" className="mr-2" />}
                        Parse with AI
                    </Button>
                </div>
            </div>
            
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                    Or Add Assignment Manually
                    </span>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="e.g. Calculus Homework 3" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="course">Course</Label>
                    <Input id="course" placeholder="e.g. MATH 201" value={course} onChange={(e) => setCourse(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                            "w-full justify-start text-left font-normal",
                            !dueDate && "text-muted-foreground"
                            )}
                        >
                            <GradientIcon name="Calendar" className="mr-2 h-4 w-4" />
                            {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={dueDate}
                                onSelect={setDueDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleAddAssignment}>Add Assignment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
