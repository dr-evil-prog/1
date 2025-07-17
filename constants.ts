import { User, Course, Exam, UserRole, QuestionType } from './types';

// Mock Users
export const MOCK_USERS: User[] = [
  {
    id: 'admin-01',
    name: 'Admin User',
    email: 'aljaareh.bh@gmail.com',
    password: 'Password@123',
    isActive: true,
    role: UserRole.ADMIN,
  },
  {
    id: 'user-01',
    name: 'Inactive User',
    email: 'inactive@edu.com',
    password: 'password123',
    isActive: false,
    role: UserRole.USER,
  },
  {
    id: 'user-02',
    name: 'Active User',
    email: 'active@edu.com',
    password: 'password123',
    isActive: true,
    role: UserRole.USER,
  },
];

// Mock Exams
export const MOCK_EXAMS: Exam[] = [
  {
    id: 'exam-react-101',
    courseId: 'course-react-101',
    title: 'React Basics Final Exam',
    isLocked: true,
    timeLimit: 30, // 30 minutes
    randomizeQuestions: true,
    numberOfQuestions: 3,
  },
  {
    id: 'exam-ux-101',
    courseId: 'course-ux-101',
    title: 'UX Design Fundamentals Exam',
    isLocked: false,
    timeLimit: 0, // No time limit
    randomizeQuestions: false,
    numberOfQuestions: 2,
  },
];


// Mock Courses
export const MOCK_COURSES: Course[] = [
  {
    id: 'course-react-101',
    title: 'React for Beginners',
    description: 'Learn the fundamentals of React, including components, state, and props.',
    imageUrl: 'https://picsum.photos/seed/react/600/400',
    examId: 'exam-react-101',
    modules: [
      {
        id: 'm1-r',
        title: 'Module 1: Introduction to React',
        materials: [
          { id: 'mat1-r', type: 'VIDEO', title: 'What is React?', url: 'https://www.youtube.com/embed/SqcY0GlETPk' },
          { id: 'mat2-r', type: 'PDF', title: 'React Core Concepts', url: '#' },
        ],
        questions: [
          {
            id: 'q1',
            type: QuestionType.MULTIPLE_CHOICE,
            text: 'What is JSX?',
            options: ['A JavaScript library', 'A syntax extension for JavaScript', 'A CSS preprocessor', 'A database'],
            correctAnswer: 'A syntax extension for JavaScript',
          },
          {
            id: 'q2',
            type: QuestionType.TRUE_FALSE,
            text: 'React components must always return a single root element.',
            correctAnswer: true,
          },
        ]
      },
      {
        id: 'm2-r',
        title: 'Module 2: Components and Props',
        materials: [
          { id: 'mat3-r', type: 'VIDEO', title: 'Building Your First Component', url: 'https://www.youtube.com/embed/SqcY0GlETPk' },
        ],
        questions: [
           {
            id: 'q3',
            type: QuestionType.SHORT_ANSWER,
            text: 'Which hook is used to manage state in a functional component?',
            correctAnswer: 'useState',
          },
          {
            id: 'q4',
            type: QuestionType.TRUE_FALSE,
            text: 'Props are mutable and can be changed inside a component.',
            correctAnswer: false,
          },
        ]
      },
    ],
  },
  {
    id: 'course-ux-101',
    title: 'UX Design Fundamentals',
    description: 'An introduction to the principles of User Experience design.',
    imageUrl: 'https://picsum.photos/seed/ux/600/400',
    examId: 'exam-ux-101',
    modules: [
      {
        id: 'm1-ux',
        title: 'Module 1: The Basics of UX',
        materials: [
          { id: 'mat1-ux', type: 'VIDEO', title: 'Understanding User Needs', url: 'https://www.youtube.com/embed/SqcY0GlETPk' },
          { id: 'mat2-ux', type: 'PDF', title: 'The 5 Elements of UX', url: '#' },
        ],
        questions: [
          {
            id: 'q1-ux',
            type: QuestionType.MULTIPLE_CHOICE,
            text: 'What does "UX" stand for?',
            options: ['User Experience', 'User Exit', 'Universal Exchange', 'User Extension'],
            correctAnswer: 'User Experience',
          },
          {
            id: 'q2-ux',
            type: QuestionType.TRUE_FALSE,
            text: 'A wireframe is a high-fidelity visual design.',
            correctAnswer: false,
          },
        ]
      },
    ],
  },
  {
    id: 'course-node-101',
    title: 'Node.js Backend Development',
    description: 'Create powerful and scalable backend services with Node.js and Express.',
    imageUrl: 'https://picsum.photos/seed/node/600/400',
    examId: 'exam-node-101', // Assume this exists
    modules: [
       {
        id: 'm1-n',
        title: 'Module 1: Getting Started',
        materials: [
          { id: 'mat1-n', type: 'VIDEO', title: 'Setting up your environment', url: 'https://www.youtube.com/embed/SqcY0GlETPk' },
        ],
        questions: []
      },
    ]
  },
];