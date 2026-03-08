
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Grade {
  id: string;
  assignmentTitle: string;
  score: number;
  total: number;
}

export interface Course {
  id: string;
  name: string;
  grade: number; 
  grades: Grade[];
}

interface GradesContextType {
  courses: Course[];
  addCourse: (courseName: string) => string;
  addGrade: (courseId: string, grade: Omit<Grade, 'id'>) => void;
  loadData: (data: Course[]) => void;
  loading: boolean;
}

const GradesContext = createContext<GradesContextType | undefined>(undefined);

export const useGrades = () => {
  const context = useContext(GradesContext);
  if (!context) {
    throw new Error('useGrades must be used within a GradesProvider');
  }
  return context;
};

const calculateOverallGrade = (grades: Grade[]): number => {
    if (grades.length === 0) return 0;
    const totalScore = grades.reduce((acc, g) => acc + g.score, 0);
    const totalPossible = grades.reduce((acc, g) => acc + g.total, 0);
    if (totalPossible === 0) return 0;
    return Math.round((totalScore / totalPossible) * 100);
}

export const GradesProvider = ({ children }: { children: ReactNode }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedCourses = localStorage.getItem('agendaGrades');
      if (storedCourses) {
        setCourses(JSON.parse(storedCourses));
      }
    } catch (error) {
      console.error("Failed to load grades", error);
      localStorage.removeItem('agendaGrades');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem('agendaGrades', JSON.stringify(courses));
      } catch (error) {
        console.error("Failed to save grades to local storage", error);
      }
    }
  }, [courses, loading]);

  const addCourse = (courseName: string): string => {
    const existingCourse = courses.find(c => c.name.toLowerCase() === courseName.toLowerCase());
    if (existingCourse) return existingCourse.id; 

    const newCourse: Course = {
      id: Date.now().toString(),
      name: courseName,
      grade: 0,
      grades: [],
    };
    setCourses(prev => [...prev, newCourse]);
    return newCourse.id;
  };

  const addGrade = (courseId: string, grade: Omit<Grade, 'id'>) => {
    setCourses(prev =>
      prev.map(c => {
        if (c.id === courseId) {
          const newGrades = [...c.grades, { ...grade, id: Date.now().toString() }];
          const newOverallGrade = calculateOverallGrade(newGrades);
          return { ...c, grades: newGrades, grade: newOverallGrade };
        }
        return c;
      })
    );
  };
  
  const loadData = (data: Course[]) => {
    setCourses(data);
  };

  const value = {
    courses,
    addCourse,
    addGrade,
    loadData,
    loading,
  };

  return (
    <GradesContext.Provider value={value}>
      {children}
    </GradesContext.Provider>
  );
};
