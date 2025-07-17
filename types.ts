export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Should not be stored in a real app's frontend state
  isActive: boolean;
  role: UserRole;
}

export interface Material {
  id: string;
  type: 'PDF' | 'VIDEO';
  title: string;
  url: string; // URL to PDF or video embed
}

export interface Module {
  id:string;
  title: string;
  materials: Material[];
  questions: Question[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  modules: Module[];
  examId: string;
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  SHORT_ANSWER = 'SHORT_ANSWER',
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
  correctAnswer: string | boolean;
}

export interface Exam {
  id: string;
  courseId: string;
  title: string;
  numberOfQuestions: number; // The number of questions to pull from the course's question bank
  // New properties for admin control
  isLocked: boolean; // If true, user must complete all materials
  timeLimit: number; // in minutes, 0 means no limit
  randomizeQuestions: boolean; // If true, question order is randomized
}

export interface ExamResult {
  userId: string;
  examId: string;
  score: number; // percentage
  answers: { [questionId: string]: string | boolean };
  timestamp: number;
}

export interface UserProgress {
    completedMaterials: Set<string>;
}