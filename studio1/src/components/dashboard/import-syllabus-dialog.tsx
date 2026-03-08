
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
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { extractPortalData } from "@/ai/flows/extract-items-flow";
import { useAssignments } from "@/context/assignments-context";
import { useGrades } from "@/context/grades-context";
import { Textarea } from "@/components/ui/textarea";
import { useQuizzes } from "@/context/quizzes-context";
import { GradientIcon } from "@/components/ui/gradient-icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import type { PortalData } from "@/ai/schemas";
import { useTasks } from "@/context/tasks-context";

type ImportSyllabusDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ImportSyllabusDialog({ open, onOpenChange }: ImportSyllabusDialogProps) {
  const [pastedText, setPastedText] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { assignments, addAssignment } = useAssignments();
  const { quizzes, addQuiz } = useQuizzes();
  const { addGrade, addCourse, courses } = useGrades();
  const { tasks, addTask } = useTasks();

  const handlePortalClick = () => {
    const portalUrl = localStorage.getItem("studentPortalUrl") || "https://navigate.nu.edu/d2l/home";
    window.open(portalUrl, "_blank");
  };

  const processExtractedData = (extractedData: PortalData) => {
      if (!extractedData || (!extractedData.courseName && extractedData.items.length === 0)) {
        toast({
            variant: "destructive",
            title: "Import Failed",
            description: "Could not extract any useful information. The content might be unreadable or empty.",
        });
        return;
      }
      
      let courseName = extractedData.courseName;
      let courseId = courses.find(c => c.name.toLowerCase() === courseName?.toLowerCase())?.id;

      if (courseName && !courseId) {
        courseId = addCourse(courseName);
      } else if (!courseName && extractedData.items.length > 0) {
        courseName = "Uncategorized";
        courseId = courses.find(c => c.name.toLowerCase() === courseName.toLowerCase())?.id;
         if (!courseId) {
            courseId = addCourse(courseName);
        }
      }
      
      if (!courseId || !courseName) {
           toast({
            variant: "destructive",
            title: "Import Error",
            description: "Could not establish a course for the imported items.",
          });
          return;
      }
      
      processItems(extractedData, courseId, courseName);
  }
  
  const processItems = (extractedData: PortalData, courseId: string, courseName: string) => {
      let itemsAdded = 0;
      let gradesAdded = 0;
      let duplicatesSkipped = 0;
      
      extractedData.items.forEach((item: any) => {
        const timezoneOffset = new Date().getTimezoneOffset() * 60000;
        const localDate = new Date(new Date(item.dueDate).getTime() + timezoneOffset);

        switch(item.type) {
            case 'Assignment':
            case 'Reading':
                const isAssignmentDuplicate = assignments.some(a => a.title === item.title && a.course === courseName);
                if (!isAssignmentDuplicate) {
                    addAssignment({
                        title: item.title,
                        course: courseName,
                        dueDate: localDate,
                    });
                    itemsAdded++;
                } else {
                    duplicatesSkipped++;
                }
                break;
            case 'Discussion':
                const taskTitle = `${item.title} (${courseName})`;
                const isTaskDuplicate = tasks.some(t => t.title === taskTitle);
                if (!isTaskDuplicate) {
                    addTask({ title: taskTitle });
                    itemsAdded++;
                } else {
                    duplicatesSkipped++;
                }
                break;
            case 'Quiz':
            case 'Test':
            case 'Exam':
                const isQuizDuplicate = quizzes.some(q => q.title === item.title && q.course === courseName);
                if (!isQuizDuplicate) {
                    addQuiz({
                        title: item.title,
                        course: courseName,
                        dueDate: localDate,
                    });
                    itemsAdded++;
                } else {
                    duplicatesSkipped++;
                }
                break;
        }

        if (item.score !== undefined && item.totalPoints !== undefined) {
            // Assuming we don't need to check for duplicate grades, or that they are rare.
            addGrade(courseId, {
                assignmentTitle: item.title,
                score: item.score,
                total: item.totalPoints,
            });
            gradesAdded++;
        }
      });

      let description = `${itemsAdded} new item(s) and ${gradesAdded} grade(s) for ${courseName} have been added.`;
      if (duplicatesSkipped > 0) {
        description += ` ${duplicatesSkipped} duplicate(s) were skipped.`;
      }

      toast({
        title: "Import Successful!",
        description,
      });
      
      resetInputs();
      onOpenChange(false);
  }

  const handleTextImport = async () => {
    setLoading(true);
    try {
        if (!pastedText.trim()) {
            toast({ variant: "destructive", title: "No text provided", description: "Please paste your content into the text area." });
            return;
        }
        const extractedData = await extractPortalData(pastedText);
        processExtractedData(extractedData);
    } catch (error) {
      console.error("Syllabus import failed:", error);
      toast({
        variant: "destructive",
        title: "Import Failed",
        description: "An unexpected error occurred while parsing the content.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUrlImport = async () => {
    setLoading(true);
    toast({
        variant: "destructive",
        title: "Feature Not Available",
        description: "Importing from a URL is not currently supported. Please paste the content or upload a file.",
    });
    setLoading(false);
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileImport = async () => {
    if (!selectedFile) {
        toast({ variant: "destructive", title: "No file selected", description: "Please select a file to import." });
        return;
    }
    setLoading(true);

    try {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target?.result as string;
            if (text) {
                const extractedData = await extractPortalData(text);
                processExtractedData(extractedData);
            } else {
                 toast({
                    variant: "destructive",
                    title: "File is empty",
                    description: "The selected file appears to be empty.",
                });
            }
        };
        reader.readAsText(selectedFile);

    } catch (error: any) {
        console.error("File import failed:", error);
        toast({
            variant: "destructive",
            title: "Import Failed",
            description: `Could not process the file. (${error.message})`,
        });
    } finally {
        setLoading(false);
    }
  };

  const resetInputs = () => {
      setPastedText("");
      setUrlInput("");
      setSelectedFile(null);
  }
  
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
        resetInputs();
    }
    onOpenChange(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gradient flex items-center gap-2">
            <GradientIcon name="ClipboardPaste" /> Sync Data
          </DialogTitle>
          <DialogDescription>
            For best results, open your school portal, view page source, copy everything, and paste it below.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="paste">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="paste">Paste Content</TabsTrigger>
                <TabsTrigger value="url">From URL</TabsTrigger>
                <TabsTrigger value="file">Upload File</TabsTrigger>
            </TabsList>
            <TabsContent value="paste" className="py-2 space-y-4">
                 <Button variant="outline" className="w-full" onClick={handlePortalClick}>
                    <GradientIcon name="ExternalLink" className="mr-2 h-4 w-4" />
                    Open Student Portal
                 </Button>
                 <div className="space-y-2">
                    <Label htmlFor="syllabus-text">Pasted HTML or Text</Label>
                    <Textarea 
                        id="syllabus-text"
                        placeholder="Paste content from your student portal here..."
                        className="h-48 resize-none"
                        value={pastedText}
                        onChange={(e) => setPastedText(e.target.value)}
                    />
                 </div>
                 <Button onClick={handleTextImport} disabled={loading || !pastedText.trim()} className="w-full">
                    {loading ? (
                    <>
                        <GradientIcon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                        Syncing...
                    </>
                    ) : ( "Sync Pasted Content" )}
                </Button>
            </TabsContent>
            <TabsContent value="url" className="py-2 space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="url-input">Syllabus URL</Label>
                    <Input 
                      id="url-input" 
                      type="url" 
                      placeholder="https://..." 
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                    />
                </div>
                 <Button onClick={handleUrlImport} disabled={loading || !urlInput.trim()} className="w-full">
                    {loading ? (
                    <>
                        <GradientIcon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                        Syncing from URL...
                    </>
                    ) : ( "Sync from URL" )}
                </Button>
            </TabsContent>
            <TabsContent value="file" className="py-2 space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="file-input">Syllabus File</Label>
                    <Input 
                      id="file-input" 
                      type="file" 
                      onChange={handleFileChange}
                      accept=".html,.txt,.json,.pdf,.doc,.docx"
                    />
                    {selectedFile && <p className="text-sm text-muted-foreground">Selected: {selectedFile.name}</p>}
                </div>
                 <Button onClick={handleFileImport} disabled={loading || !selectedFile} className="w-full">
                    {loading ? (
                    <>
                        <GradientIcon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                        Syncing from File...
                    </>
                    ) : ( "Sync from File" )}
                </Button>
            </TabsContent>
        </Tabs>

        <DialogFooter className="sm:justify-start">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading} className="w-full">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
