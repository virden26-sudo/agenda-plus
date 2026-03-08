
'use client'

import { AssignmentsCard } from '@/components/dashboard/assignments-card'
import { QuizzesCard } from '@/components/dashboard/quizzes-card'
import { TasksCard } from '@/components/dashboard/tasks-card';
import { TodayScheduleCard } from '@/components/dashboard/today-schedule-card';
import { GradesSummaryCard } from '@/components/dashboard/grades-summary-card';

export function DashboardPage() {
  return (
      <div className="flex-1 animate-in fade-in-50 duration-500">
        <div className="grid gap-6 auto-rows-fr grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
              <TodayScheduleCard />
          </div>
          <div className="lg:col-span-2">
              <GradesSummaryCard />
          </div>
          <div className="lg:col-span-2">
              <AssignmentsCard />
          </div>
          <div className="lg:col-span-1">
              <QuizzesCard />
          </div>
           <div className="lg:col-span-1">
              <TasksCard />
          </div>
        </div>
      </div>
  )
}
