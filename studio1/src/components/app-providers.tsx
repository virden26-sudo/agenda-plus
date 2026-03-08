
"use client";

import { AssignmentsProvider } from "@/context/assignments-context";
import { GradesProvider } from "@/context/grades-context";
import { QuizzesProvider } from "@/context/quizzes-context";
import { TasksProvider } from "@/context/tasks-context";
import { SidebarProvider } from "@/components/ui/sidebar";

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AssignmentsProvider>
                <GradesProvider>
                    <QuizzesProvider>
                        <TasksProvider>
                            {children}
                        </TasksProvider>
                    </QuizzesProvider>
                </GradesProvider>
            </AssignmentsProvider>
        </SidebarProvider>
    );
}
