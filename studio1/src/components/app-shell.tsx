
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppLogo } from "@/components/app-logo";
import { AddAssignmentDialog } from "@/components/dashboard/add-assignment-dialog";
import { IntelligentSchedulerDialog } from "@/components/dashboard/intelligent-scheduler-dialog";
import { ImportSyllabusDialog } from "@/components/dashboard/import-syllabus-dialog";
import type { User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  useSidebar,
  SidebarSeparator,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle as UIDialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GradientIcon } from "@/components/ui/gradient-icon";
import { exportToJSON, importFromJSON } from "@/lib/data-utils";
import { useAssignments } from "@/context/assignments-context";
import { useGrades } from "@/context/grades-context";
import { useQuizzes } from "@/context/quizzes-context";
import { useTasks } from "@/context/tasks-context";

function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
    const { isMobile, setOpenMobile } = useSidebar();
    const pathname = usePathname();
    const isActive = pathname === href;

    const handleClick = () => {
        if (isMobile) {
            setOpenMobile(false);
        }
    };

    return (
        <Link href={href} onClick={handleClick} data-active={isActive}>
            {children}
        </Link>
    );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { toast } = useToast();
  const { isMobile, setOpenMobile } = useSidebar();
  const [addAssignmentOpen, setAddAssignmentOpen] = React.useState(false);
  const [schedulerOpen, setSchedulerOpen] = React.useState(false);
  const [importSyllabusOpen, setImportSyllabusOpen] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);
  const [namePromptOpen, setNamePromptOpen] = React.useState(false);
  const [resetDialogOpen, setResetDialogOpen] = React.useState(false);
  const [nameInput, setNameInput] = React.useState('');
  const [portalUrlInput, setPortalUrlInput] = React.useState("https://navigate.nu.edu/d2l/home");
  const [isUserLoaded, setIsUserLoaded] = React.useState(false);

  // Data hooks for import/export
  const assignmentsContext = useAssignments();
  const gradesContext = useGrades();
  const quizzesContext = useQuizzes();
  const tasksContext = useTasks();

  React.useEffect(() => {
    try {
      const storedUser = localStorage.getItem("agendaUser");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setNamePromptOpen(true);
      }
      const storedPortalUrl = localStorage.getItem("studentPortalUrl");
      if (storedPortalUrl) {
        setPortalUrlInput(storedPortalUrl);
      }

    } catch (e) {
      console.error("Failed to parse user from local storage", e);
      setNamePromptOpen(true);
    } finally {
      setIsUserLoaded(true);
    }
  }, []);

  const handleProfileSave = () => {
    if (nameInput.trim()) {
      const newUser: User = {
        name: nameInput.trim(),
        avatarUrl: `https://picsum.photos/seed/${nameInput.trim()}/100/100`,
      };
      localStorage.setItem("agendaUser", JSON.stringify(newUser));
      setUser(newUser);
      setNameInput('');
    }
    if(portalUrlInput.trim()){
      localStorage.setItem("studentPortalUrl", portalUrlInput);
    }
    setNamePromptOpen(false);
  };

  const getInitials = (name: string) => {
    if (!name) return "";
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`;
    }
    return names[0].charAt(0);
  }
  
  const handlePortalClick = () => {
    const portalUrl = localStorage.getItem("studentPortalUrl") || "https://navigate.nu.edu/d2l/home";
    window.open(portalUrl, "_blank");
  };

  const handleLogout = () => {
    localStorage.removeItem("agendaUser");
    setUser(null);
    setNamePromptOpen(true);
  };

  const handleResetApp = () => {
    localStorage.clear();
    window.location.reload();
  };
  
  const handleShare = async () => {
    try {
        await navigator.clipboard.writeText("My Agenda+ Summary!");
        toast({ title: 'Copied to Clipboard!', description: 'Your agenda summary has been copied.' });
    } catch (error) {
        console.error('Error copying:', error);
        toast({ variant: 'destructive', title: 'Could not copy summary.' });
    }
  }

    const handleExport = () => {
        const dataToExport = {
            assignments: assignmentsContext.assignments,
            courses: gradesContext.courses,
            quizzes: quizzesContext.quizzes,
            tasks: tasksContext.tasks,
            version: 1,
        };
        exportToJSON(dataToExport);
        toast({ title: "Export Successful", description: "Your data has been downloaded." });
    };

    const handleImport = () => {
        importFromJSON((data) => {
            if (data.assignments) assignmentsContext.loadData(data.assignments);
            if (data.courses) gradesContext.loadData(data.courses);
            if (data.quizzes) quizzesContext.loadData(data.quizzes);
            if (data.tasks) tasksContext.loadData(data.tasks);
            toast({ title: "Import Successful", description: "Your data has been restored from the backup." });
        }, (error) => {
            toast({ variant: "destructive", title: "Import Failed", description: error });
        });
    };

  const navItems = [
    { href: "/", icon: "Book", label: "Dashboard" },
    { href: "/assignments", icon: "BookCopy", label: "Assignments" },
    { href: "/quizzes", icon: "FileQuestion", label: "Quizzes & Exams" },
    { href: "/tasks", icon: "CheckSquare", label: "Discussions & Tasks" },
    { href: "/grades", icon: "Star", label: "Grades" },
    { href: "/calendar", icon: "Calendar", label: "Calendar" },
  ];
  
  const toolItems = [
    { href: "/tutor", icon: "Bot", label: "AI Tutor" },
    { href: "/live", icon: "Video", label: "Live Session" },
    { href: "/resources", icon: "Library", label: "Resources" },
  ];

  const pageTitles: { [key: string]: string } = {
    '/': 'Dashboard',
    '/assignments': 'Assignments',
    '/quizzes': 'Quizzes & Exams',
    '/tasks': 'Discussions & Tasks',
    '/grades': 'Grades',
    '/calendar': 'Calendar',
    '/tutor': 'AI Tutor',
    '/live': 'Live Session',
    '/resources': 'Study Resources',
  };
  
  const pageTitle = pageTitles[pathname] || "Dashboard";
  
  if (!isUserLoaded) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="flex flex-col items-center justify-center gap-4">
                <AppLogo />
                <span className="text-5xl font-extrabold font-headline text-gradient" style={{ textShadow: '2px 4px 6px hsla(var(--foreground), 0.3), 0px 5px 15px hsla(var(--foreground), 0.2)'}}>Agenda+</span>
            </div>
      </div>
    );
  }

  return (
        <>
            <Sidebar
            collapsible="icon"
            className="group-data-[variant=sidebar]:border-r-0"
            >
            <SidebarHeader className="flex flex-col items-center justify-center p-4 h-auto">
                <AppLogo />
                <div className="text-2xl font-bold text-gradient group-data-[collapsible=icon]:hidden font-headline">
                    Agenda+
                </div>
            </SidebarHeader>
            <SidebarContent className="p-2">
                <SidebarMenu>
                    <Button variant="default" className="w-full justify-start h-10" onClick={() => setAddAssignmentOpen(true)}>
                        <GradientIcon name="Plus" />
                        <span className="group-data-[collapsible=icon]:hidden">Add Item</span>
                      </Button>
                </SidebarMenu>
                <SidebarSeparator />
                <SidebarMenu>
                {navItems.map((item) => (
                    <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        tooltip={item.label}
                    >
                        <NavLink href={item.href}>
                        <GradientIcon name={item.icon as any} />
                        <span>{item.label}</span>
                        </NavLink>
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
                </SidebarMenu>
                 <SidebarSeparator />
                <SidebarMenu>
                <SidebarGroupLabel>Tools</SidebarGroupLabel>
                {toolItems.map((item) => (
                    <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        tooltip={item.label}
                    >
                        <NavLink href={item.href}>
                        <GradientIcon name={item.icon as any} />
                        <span>{item.label}</span>
                        </NavLink>
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                    <SidebarMenuButton
                        onClick={() => {
                            setSchedulerOpen(true);
                            if (isMobile) setOpenMobile(false);
                        }}
                        tooltip="AI Scheduler"
                        >
                        <GradientIcon name="Wand"/>
                        <span>AI Scheduler</span>
                        </SidebarMenuButton>
                </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="p-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <button className="flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:!p-2">
                        <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatarUrl} alt="User Avatar" data-ai-hint="person face" />
                        <AvatarFallback>{user ? getInitials(user.name) : 'A+'}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                        <span className="font-semibold text-sidebar-foreground">{user?.name ?? 'Welcome'}</span>
                        <span className="text-xs text-muted-foreground">{user ? 'Student' : 'Please set up your profile'}</span>
                        </div>
                    </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start" className="w-56">
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => { setNameInput(user?.name || ''); setNamePromptOpen(true);}}>
                            <GradientIcon name="User" className="mr-2 h-4 w-4" />
                            Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handlePortalClick}>
                            <GradientIcon name="ExternalLink" className="mr-2 h-4 w-4" />
                            University Portal
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                         <DropdownMenuLabel>Data Management</DropdownMenuLabel>
                        <DropdownMenuItem onClick={handleImport}>
                            <GradientIcon name="Upload" className="mr-2 h-4 w-4" />
                            Import Backup
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleExport}>
                            <GradientIcon name="Download" className="mr-2 h-4 w-4" />
                            Export Backup
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={handleLogout}>
                            <GradientIcon name="LogOut" className="mr-2 h-4 w-4" />
                            Log out
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={() => setResetDialogOpen(true)}>
                            <GradientIcon name="Trash2" className="mr-2 h-4 w-4" />
                            Reset App
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarFooter>
            </Sidebar>
            <SidebarInset>
            <header className="flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 sticky top-0 z-30">
                <div className="flex items-center gap-4">
                <SidebarTrigger className="md:hidden" />
                <h2 className="text-2xl font-bold">{pageTitle}</h2>
                </div>
                <div className="flex items-center gap-4">
                <Button variant="outline" onClick={handleShare}>
                    <GradientIcon name="Share2" className="mr-2 h-4 w-4" />
                    Share
                </Button>
                <Button onClick={() => setImportSyllabusOpen(true)}>Sync Data</Button>
                </div>
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                {children}
            </main>
            </SidebarInset>
            
            <AddAssignmentDialog open={addAssignmentOpen} onOpenChange={setAddAssignmentOpen} />
            <IntelligentSchedulerDialog open={schedulerOpen} onOpenChange={setSchedulerOpen} />
            <ImportSyllabusDialog open={importSyllabusOpen} onOpenChange={setImportSyllabusOpen} />
    
            <Dialog open={namePromptOpen} onOpenChange={(isOpen) => { if (user) { setNamePromptOpen(isOpen); } }}>
            <DialogContent onInteractOutside={(e) => {if (!user) e.preventDefault()}}>
                <DialogHeader>
                    <UIDialogTitle className="font-headline text-gradient">Welcome to Agenda+</UIDialogTitle>
                    <DialogDescription>Please enter your name and student portal URL to personalize your experience.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input 
                            id="name" 
                            placeholder="e.g. Alex Doe"
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleProfileSave()}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="portal-url">Student Portal URL</Label>
                        <Input 
                            id="portal-url" 
                            placeholder="e.g. https://my.school.edu"
                            value={portalUrlInput}
                            onChange={(e) => setPortalUrlInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleProfileSave()}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleProfileSave} disabled={!nameInput.trim()}>Save</Button>
                </DialogFooter>
            </DialogContent>
            </Dialog>
            <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all your
                    assignments, grades, and other saved data from your browser and replace it with the imported file.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleResetApp} className="bg-destructive hover:bg-destructive/90">Reset App</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>
        </>
  );
}
