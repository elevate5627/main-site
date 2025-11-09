import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-client';

interface DashboardStats {
  totalStudyHours: number;
  studyHoursChange: number;
  materialsCompleted: number;
  materialsChange: number;
  mcqTestsTaken: number;
  mcqTestsChange: number;
  averageScore: number;
  scoreChange: number;
}

interface LearningProgress {
  studyMaterials: { current: number; target: number };
  mcqPractice: { current: number; target: number };
  mockTests: { current: number; target: number };
  labAssignments: { current: number; target: number };
}

interface WeeklyGoal {
  id: string;
  title: string;
  current: number;
  target: number;
  completed: boolean;
}

interface Activity {
  id: string;
  type: 'book' | 'brain' | 'chart' | 'award';
  title: string;
  time: string;
}

export function useDashboardData() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [progress, setProgress] = useState<LearningProgress | null>(null);
  const [goals, setGoals] = useState<WeeklyGoal[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch stats in parallel
      const [
        studyHoursData,
        materialsData,
        mcqAttemptsData,
        goalsData,
        activitiesData
      ] = await Promise.all([
        fetchStudyHours(user.id),
        fetchMaterialsCompleted(user.id),
        fetchMCQAttempts(user.id),
        fetchWeeklyGoals(user.id),
        fetchRecentActivities(user.id)
      ]);

      setStats(studyHoursData);
      setProgress({
        studyMaterials: { 
          current: materialsData.total, 
          target: 20 
        },
        mcqPractice: { 
          current: mcqAttemptsData.practiceTests, 
          target: 15 
        },
        mockTests: { 
          current: mcqAttemptsData.mockTests, 
          target: 5 
        },
        labAssignments: { 
          current: materialsData.labMaterials, 
          target: 10 
        }
      });
      setGoals(goalsData);
      setActivities(activitiesData);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudyHours = async (userId: string): Promise<DashboardStats> => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Current week study hours
    const { data: currentWeek } = await supabase
      .from('study_sessions')
      .select('duration_minutes')
      .eq('user_id', userId)
      .gte('created_at', oneWeekAgo.toISOString());

    // Previous week study hours
    const { data: previousWeek } = await supabase
      .from('study_sessions')
      .select('duration_minutes')
      .eq('user_id', userId)
      .gte('created_at', twoWeeksAgo.toISOString())
      .lt('created_at', oneWeekAgo.toISOString());

    // Total study hours
    const { data: allSessions } = await supabase
      .from('study_sessions')
      .select('duration_minutes')
      .eq('user_id', userId);

    const totalMinutes = allSessions?.reduce((sum, s) => sum + s.duration_minutes, 0) || 0;
    const currentWeekMinutes = currentWeek?.reduce((sum, s) => sum + s.duration_minutes, 0) || 0;
    const previousWeekMinutes = previousWeek?.reduce((sum, s) => sum + s.duration_minutes, 0) || 0;

    // Materials completed
    const { data: materialsCurrentWeek } = await supabase
      .from('materials_completed')
      .select('id')
      .eq('user_id', userId)
      .gte('completed_at', oneWeekAgo.toISOString());

    const { data: materialsPreviousWeek } = await supabase
      .from('materials_completed')
      .select('id')
      .eq('user_id', userId)
      .gte('completed_at', twoWeeksAgo.toISOString())
      .lt('completed_at', oneWeekAgo.toISOString());

    const { data: allMaterials } = await supabase
      .from('materials_completed')
      .select('id')
      .eq('user_id', userId);

    // MCQ attempts
    const { data: mcqCurrentWeek } = await supabase
      .from('mcq_attempts')
      .select('id, score')
      .eq('user_id', userId)
      .gte('created_at', oneWeekAgo.toISOString());

    const { data: mcqPreviousWeek } = await supabase
      .from('mcq_attempts')
      .select('id, score')
      .eq('user_id', userId)
      .gte('created_at', twoWeeksAgo.toISOString())
      .lt('created_at', oneWeekAgo.toISOString());

    const { data: allMcq } = await supabase
      .from('mcq_attempts')
      .select('score')
      .eq('user_id', userId);

    const avgScore = allMcq?.length 
      ? allMcq.reduce((sum, a) => sum + a.score, 0) / allMcq.length 
      : 0;

    const avgScoreCurrentWeek = mcqCurrentWeek?.length
      ? mcqCurrentWeek.reduce((sum, a) => sum + a.score, 0) / mcqCurrentWeek.length
      : 0;

    const avgScorePreviousWeek = mcqPreviousWeek?.length
      ? mcqPreviousWeek.reduce((sum, a) => sum + a.score, 0) / mcqPreviousWeek.length
      : 0;

    return {
      totalStudyHours: Math.round(totalMinutes / 60),
      studyHoursChange: Math.round((currentWeekMinutes - previousWeekMinutes) / 60),
      materialsCompleted: allMaterials?.length || 0,
      materialsChange: (materialsCurrentWeek?.length || 0) - (materialsPreviousWeek?.length || 0),
      mcqTestsTaken: allMcq?.length || 0,
      mcqTestsChange: (mcqCurrentWeek?.length || 0) - (mcqPreviousWeek?.length || 0),
      averageScore: Math.round(avgScore),
      scoreChange: Math.round(avgScoreCurrentWeek - avgScorePreviousWeek)
    };
  };

  const fetchMaterialsCompleted = async (userId: string) => {
    const { data: materials } = await supabase
      .from('materials_completed')
      .select('material_type')
      .eq('user_id', userId);

    const labMaterials = materials?.filter(m => m.material_type === 'labs')?.length || 0;

    return {
      total: materials?.length || 0,
      labMaterials
    };
  };

  const fetchMCQAttempts = async (userId: string) => {
    const { data: attempts } = await supabase
      .from('mcq_attempts')
      .select('test_type')
      .eq('user_id', userId);

    const mockTests = attempts?.filter(a => a.test_type === 'mock-test')?.length || 0;
    const practiceTests = attempts?.filter(a => a.test_type === 'practice-set')?.length || 0;

    return {
      mockTests,
      practiceTests
    };
  };

  const fetchWeeklyGoals = async (userId: string): Promise<WeeklyGoal[]> => {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const { data: goals } = await supabase
      .from('user_goals')
      .select('*')
      .eq('user_id', userId)
      .eq('week_start', startOfWeek.toISOString().split('T')[0])
      .order('created_at', { ascending: true })
      .limit(4);

    if (!goals || goals.length === 0) {
      // Create default goals for the week if none exist
      const defaultGoals = [
        { goal_type: 'mcq-tests', goal_title: 'Complete 5 MCQ tests', target_value: 5, current_value: 0 },
        { goal_type: 'study-hours', goal_title: 'Study 10 hours', target_value: 10, current_value: 0 },
        { goal_type: 'lab-review', goal_title: 'Review lab materials', target_value: 1, current_value: 0 },
        { goal_type: 'assignments', goal_title: 'Complete 3 assignments', target_value: 3, current_value: 0 }
      ];

      const insertPromises = defaultGoals.map(goal =>
        supabase.from('user_goals').insert({
          user_id: userId,
          ...goal,
          week_start: startOfWeek.toISOString().split('T')[0]
        })
      );

      await Promise.all(insertPromises);

      return defaultGoals.map((g, i) => ({
        id: `goal-${i}`,
        title: g.goal_title,
        current: g.current_value,
        target: g.target_value,
        completed: false
      }));
    }

    return goals.map(g => ({
      id: g.id,
      title: g.goal_title,
      current: g.current_value,
      target: g.target_value,
      completed: g.completed
    }));
  };

  const fetchRecentActivities = async (userId: string): Promise<Activity[]> => {
    const { data: activities } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(4);

    if (!activities || activities.length === 0) {
      // Return default activities if none exist
      return [
        {
          id: '1',
          type: 'book',
          title: 'Completed: Data Structures Notes',
          time: '2 hours ago'
        },
        {
          id: '2',
          type: 'brain',
          title: 'MCQ Test: Computer Networks - Score: 92%',
          time: '5 hours ago'
        },
        {
          id: '3',
          type: 'chart',
          title: 'Reviewed: Database Lab Materials',
          time: '1 day ago'
        },
        {
          id: '4',
          type: 'award',
          title: 'Achievement Unlocked: Study Streak - 7 Days',
          time: '2 days ago'
        }
      ];
    }

    return activities.map(a => ({
      id: a.id,
      type: a.icon_type as 'book' | 'brain' | 'chart' | 'award',
      title: a.activity_title,
      time: getTimeAgo(new Date(a.created_at))
    }));
  };

  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
  };

  return { stats, progress, goals, activities, loading, refetch: fetchDashboardData };
}
