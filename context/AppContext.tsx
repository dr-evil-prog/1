import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Course, Exam, ExamResult, UserRole, Module, Material, UserProgress, Question } from '../types';
import { MOCK_USERS, MOCK_COURSES, MOCK_EXAMS } from '../constants';
import { translations } from '../locales/translations';

type Language = 'en' | 'ar';

// Helper to get initial state from localStorage or a default value
function getInitialState<T>(key: string, defaultValue: T): T {
  try {
    const storedItem = localStorage.getItem(key);
    if (storedItem) {
      return JSON.parse(storedItem);
    }
  } catch (error) {
    console.error(`Error parsing localStorage key “${key}”:`, error);
  }
  return defaultValue;
}


interface AppContextType {
  currentUser: User | null;
  users: User[];
  courses: Course[];
  exams: Exam[];
  examResults: ExamResult[];
  language: Language;
  login: (email: string, password?: string) => User | null;
  logout: () => void;
  register: (name: string, email: string, password?: string) => User;
  activateUser: (userId: string) => void;
  deactivateUser: (userId: string) => void;
  submitExam: (result: ExamResult) => void;
  getExamResult: (examId: string, userId: string) => ExamResult | undefined;
  setLanguage: (lang: Language) => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
  // Course Management
  addCourse: (courseData: Omit<Course, 'id' | 'modules' | 'examId'>) => void;
  updateCourse: (courseId: string, courseData: Partial<Course>) => void;
  deleteCourse: (courseId:string) => void;
  // Module Management
  addModule: (courseId: string, moduleData: { title: string }) => void;
  updateModule: (courseId: string, moduleId: string, moduleData: { title: string }) => void;
  deleteModule: (courseId: string, moduleId: string) => void;
  // Material Management
  addMaterial: (courseId: string, moduleId: string, materialData: Omit<Material, 'id'>) => void;
  updateMaterial: (courseId: string, moduleId: string, materialId: string, materialData: Partial<Material>) => void;
  deleteMaterial: (courseId: string, moduleId: string, materialId: string) => void;
  // User Progress
  userProgress: { [userId: string]: UserProgress };
  markMaterialAsCompleted: (materialId: string, completed: boolean) => void;
  isMaterialCompleted: (materialId: string) => boolean;
  hasCompletedAllMaterials: (courseId: string) => boolean;
  // Exam Management
  updateExam: (examId: string, examData: Partial<Exam>) => void;
  // Question Management (Now Module-based)
  addQuestionToModule: (courseId: string, moduleId: string, questionData: Omit<Question, 'id'>) => void;
  updateQuestionInModule: (courseId: string, moduleId: string, questionId: string, questionData: Partial<Question>) => void;
  deleteQuestionFromModule: (courseId: string, moduleId: string, questionId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => getInitialState('currentUser', null));
  const [users, setUsers] = useState<User[]>(() => getInitialState('users', MOCK_USERS));
  const [courses, setCourses] = useState<Course[]>(() => getInitialState('courses', MOCK_COURSES));
  const [exams, setExams] = useState<Exam[]>(() => getInitialState('exams', MOCK_EXAMS));
  const [examResults, setExamResults] = useState<ExamResult[]>(() => getInitialState('examResults', []));
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('language') as Language | null) || 'ar');
  const [userProgress, setUserProgress] = useState<{ [userId: string]: UserProgress }>(() => {
    const fromStorage = localStorage.getItem('userProgress');
    if (!fromStorage) return {};
    try {
      const parsed = JSON.parse(fromStorage);
      // Rehydrate Sets from stored arrays
      Object.keys(parsed).forEach(userId => {
        if (parsed[userId] && parsed[userId].completedMaterials) {
            parsed[userId].completedMaterials = new Set(parsed[userId].completedMaterials);
        }
      });
      return parsed;
    } catch {
        return {};
    }
  });

  // Effects to persist state changes to localStorage
  useEffect(() => { localStorage.setItem('currentUser', JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => { localStorage.setItem('users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('courses', JSON.stringify(courses)); }, [courses]);
  useEffect(() => { localStorage.setItem('exams', JSON.stringify(exams)); }, [exams]);
  useEffect(() => { localStorage.setItem('examResults', JSON.stringify(examResults)); }, [examResults]);

  useEffect(() => {
    // Dehydrate Sets to arrays for storage
    const progressToStore: { [key: string]: { completedMaterials: string[] } } = {};
    Object.keys(userProgress).forEach(userId => {
        progressToStore[userId] = {
            completedMaterials: Array.from(userProgress[userId].completedMaterials),
        };
    });
    localStorage.setItem('userProgress', JSON.stringify(progressToStore));
  }, [userProgress]);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key: string, replacements?: { [key: string]: string | number }): string => {
    let translation = translations[language][key as keyof typeof translations.ar] || translations['en'][key as keyof typeof translations.en] || key;
    if (replacements) {
        Object.keys(replacements).forEach(placeholder => {
            translation = translation.replace(`{${placeholder}}`, String(replacements[placeholder]));
        });
    }
    return translation;
  }

  const login = (email: string, password?: string): User | null => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      return user;
    }
    return null;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const register = (name: string, email: string, password?: string): User => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      isActive: false,
      role: UserRole.USER,
    };
    setUsers(prevUsers => [...prevUsers, newUser]);
    return newUser;
  };

  const activateUser = (userId: string) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, isActive: true } : user
      )
    );
     // If the activated user is the current user, update their state
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => prev ? {...prev, isActive: true} : null);
    }
  };

  const deactivateUser = (userId: string) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, isActive: false } : user
      )
    );
    if (currentUser && currentUser.id === userId) {
        logout();
    }
  };


  const submitExam = (result: ExamResult) => {
    setExamResults(prev => [...prev.filter(r => !(r.examId === result.examId && r.userId === result.userId)), result]);
  };

  const getExamResult = (examId: string, userId: string): ExamResult | undefined => {
      return examResults.find(r => r.examId === examId && r.userId === userId);
  };

  // Course Management
  const addCourse = (courseData: Omit<Course, 'id' | 'modules' | 'examId'>) => {
      const courseId = `course-${Date.now()}`;
      const examId = `exam-${Date.now()}`;
      const newCourse: Course = {
        id: courseId,
        ...courseData,
        modules: [],
        examId: examId
      };
      const newExam: Exam = {
          id: examId,
          courseId: courseId,
          title: `${courseData.title} Exam`,
          isLocked: true,
          timeLimit: 30,
          randomizeQuestions: true,
          numberOfQuestions: 5,
      }
      setCourses(prev => [...prev, newCourse]);
      setExams(prev => [...prev, newExam]);
  };

  const updateCourse = (courseId: string, courseData: Partial<Course>) => {
      setCourses(prev => prev.map(c => c.id === courseId ? {...c, ...courseData} : c));
  };
  
  const deleteCourse = (courseId: string) => {
      setCourses(prev => prev.filter(c => c.id !== courseId));
  };

  // Module Management
  const addModule = (courseId: string, moduleData: { title: string }) => {
    const newModule: Module = {
      id: `m-${Date.now()}`,
      title: moduleData.title,
      materials: [],
      questions: [],
    };
    setCourses(prev => prev.map(c => c.id === courseId ? {...c, modules: [...c.modules, newModule] } : c));
  };

  const updateModule = (courseId: string, moduleId: string, moduleData: { title: string }) => {
    setCourses(prev => prev.map(c => {
      if (c.id !== courseId) return c;
      return {...c, modules: c.modules.map(m => m.id === moduleId ? {...m, ...moduleData} : m)};
    }));
  };

  const deleteModule = (courseId: string, moduleId: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id !== courseId) return c;
      return {...c, modules: c.modules.filter(m => m.id !== moduleId)};
    }));
  };

  // Material Management
  const addMaterial = (courseId: string, moduleId: string, materialData: Omit<Material, 'id'>) => {
    const newMaterial: Material = {
      id: `mat-${Date.now()}`,
      ...materialData,
    };
    setCourses(prev => prev.map(c => {
        if (c.id !== courseId) return c;
        return {
            ...c, 
            modules: c.modules.map(m => 
                m.id === moduleId ? {...m, materials: [...m.materials, newMaterial] } : m
            )
        };
    }));
  };

  const updateMaterial = (courseId: string, moduleId: string, materialId: string, materialData: Partial<Material>) => {
    setCourses(prev => prev.map(c => {
        if (c.id !== courseId) return c;
        return {
            ...c, 
            modules: c.modules.map(m => {
                if (m.id !== moduleId) return m;
                return {...m, materials: m.materials.map(mat => mat.id === materialId ? {...mat, ...materialData} : mat)};
            })
        };
    }));
  };
  
  const deleteMaterial = (courseId: string, moduleId: string, materialId: string) => {
     setCourses(prev => prev.map(c => {
        if (c.id !== courseId) return c;
        return {
            ...c, 
            modules: c.modules.map(m => {
                if (m.id !== moduleId) return m;
                return {...m, materials: m.materials.filter(mat => mat.id !== materialId)};
            })
        };
    }));
  };

  // User Progress
    const markMaterialAsCompleted = (materialId: string, completed: boolean) => {
        if (!currentUser) return;
        setUserProgress(prev => {
            const currentUserProgress = prev[currentUser.id] || { completedMaterials: new Set() };
            const newCompletedMaterials = new Set(currentUserProgress.completedMaterials);
            if (completed) {
                newCompletedMaterials.add(materialId);
            } else {
                newCompletedMaterials.delete(materialId);
            }
            return {
                ...prev,
                [currentUser.id]: { completedMaterials: newCompletedMaterials }
            };
        });
    };

    const isMaterialCompleted = (materialId: string): boolean => {
        if (!currentUser) return false;
        return userProgress[currentUser.id]?.completedMaterials.has(materialId) || false;
    };

    const hasCompletedAllMaterials = (courseId: string): boolean => {
        if (!currentUser) return false;
        const course = courses.find(c => c.id === courseId);
        if (!course) return false;

        const allMaterialIds = course.modules.flatMap(m => m.materials.map(mat => mat.id));
        if (allMaterialIds.length === 0) return true; // No materials to complete

        const completedSet = userProgress[currentUser.id]?.completedMaterials;
        if (!completedSet) return false;
        
        return allMaterialIds.every(id => completedSet.has(id));
    };

    // Exam Management
    const updateExam = (examId: string, examData: Partial<Exam>) => {
        setExams(prev => prev.map(e => e.id === examId ? { ...e, ...examData } : e));
    };
    
    // Question Management
    const addQuestionToModule = (courseId: string, moduleId: string, questionData: Omit<Question, 'id'>) => {
        const newQuestion: Question = { ...questionData, id: `q-${Date.now()}` };
        setCourses(prev => prev.map(course => {
            if (course.id !== courseId) return course;
            const updatedModules = course.modules.map(module => {
                if (module.id !== moduleId) return module;
                return { ...module, questions: [...(module.questions || []), newQuestion] };
            });
            return { ...course, modules: updatedModules };
        }));
    };

    const updateQuestionInModule = (courseId: string, moduleId: string, questionId: string, questionData: Partial<Question>) => {
        setCourses(prev => prev.map(course => {
            if (course.id !== courseId) return course;
            const updatedModules = course.modules.map(module => {
                if (module.id !== moduleId) return module;
                const updatedQuestions = (module.questions || []).map(q =>
                    q.id === questionId ? { ...q, ...questionData } : q
                );
                return { ...module, questions: updatedQuestions };
            });
            return { ...course, modules: updatedModules };
        }));
    };

    const deleteQuestionFromModule = (courseId: string, moduleId: string, questionId: string) => {
        if (!window.confirm(t('confirm.delete.question'))) return;
        setCourses(prev => prev.map(course => {
            if (course.id !== courseId) return course;
            const updatedModules = course.modules.map(module => {
                if (module.id !== moduleId) return module;
                const filteredQuestions = (module.questions || []).filter(q => q.id !== questionId);
                return { ...module, questions: filteredQuestions };
            });
            return { ...course, modules: updatedModules };
        }));
    };


  const value = {
    currentUser,
    users,
    courses,
    exams,
    examResults,
    language,
    login,
    logout,
    register,
    activateUser,
    deactivateUser,
    submitExam,
    getExamResult,
    setLanguage,
    t,
    addCourse,
    updateCourse,
    deleteCourse,
    addModule,
    updateModule,
    deleteModule,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    userProgress,
    markMaterialAsCompleted,
    isMaterialCompleted,
    hasCompletedAllMaterials,
    updateExam,
    addQuestionToModule,
    updateQuestionInModule,
    deleteQuestionFromModule
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
