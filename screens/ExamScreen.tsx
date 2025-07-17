import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Question, QuestionType, ExamResult } from '../types';

const ExamScreen: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const { exams, submitExam, currentUser, courses, t } = useAppContext();
  
  const exam = useMemo(() => exams.find(e => e.id === examId), [exams, examId]);
  const course = useMemo(() => courses.find(c => c.id === exam?.courseId), [courses, exam]);

  const [answers, setAnswers] = useState<{ [key: string]: string | boolean }>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<ExamResult | null>(null);
  
  const [timeLeft, setTimeLeft] = useState(exam?.timeLimit ? exam.timeLimit * 60 : null);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };
  
  const questionsToDisplay = useMemo(() => {
    if (!exam || !course) return [];
    
    // 1. Gather all questions from all modules in the course
    const allQuestions = course.modules.flatMap(module => module.questions || []);
    
    // 2. Shuffle the entire question pool to get a random subset
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    
    // 3. Slice to get the desired number of questions
    let selectedQuestions = shuffled.slice(0, exam.numberOfQuestions);

    // 4. Optionally re-shuffle the selected questions for display order
    if (exam.randomizeQuestions) {
        selectedQuestions = selectedQuestions.sort(() => Math.random() - 0.5);
    }
    
    return selectedQuestions;
  }, [exam, course]);


  const handleSubmit = useCallback(() => {
    if (!exam || !currentUser || questionsToDisplay.length === 0) return;

    let correctCount = 0;
    questionsToDisplay.forEach(q => {
      let userAnswer = answers[q.id];
      if (q.type === QuestionType.TRUE_FALSE) {
        userAnswer = userAnswer === 'true';
      }
      if (q.type === QuestionType.SHORT_ANSWER) {
          if (typeof userAnswer === 'string' && userAnswer.toLowerCase().trim() === q.correctAnswer.toString().toLowerCase().trim()){
              correctCount++;
          }
      } else if (userAnswer === q.correctAnswer) {
        correctCount++;
      }
    });

    const score = (correctCount / questionsToDisplay.length) * 100;
    const newResult: ExamResult = {
      userId: currentUser.id,
      examId: exam.id,
      score,
      answers,
      timestamp: Date.now(),
    };
    
    setResult(newResult);
    submitExam(newResult);
    setSubmitted(true);
  }, [exam, currentUser, answers, submitExam, questionsToDisplay]);
  
  useEffect(() => {
    if (submitted) return;
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, submitted, handleSubmit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  if (!currentUser) return <Navigate to="/login" />;
  if (!exam) return <div>{t('exam.notFound')}</div>;
  
  if (submitted && result) {
    const correctAnswersCount = Math.round((result.score / 100) * questionsToDisplay.length);
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800">{t('exam.title')}</h1>
        <p className="text-lg text-gray-600 mt-2">{t('exam.subtitle', { title: exam.title })}</p>
        <div className={`mt-8 text-6xl font-bold ${result.score >= 70 ? 'text-green-500' : 'text-red-500'}`}>
          {t('exam.score', { score: result.score.toFixed(1) })}
        </div>
        <p className="text-xl text-gray-700 mt-2">
          {t('exam.summary', { correct: correctAnswersCount, total: questionsToDisplay.length })}
        </p>
        {course && (
          <Link to={`/course/${course.id}`} className="mt-8 inline-block px-6 py-3 text-white bg-primary rounded-md hover:bg-primary-700">
            {t('exam.backToCourse')}
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold text-gray-900">{exam.title}</h1>
        {timeLeft !== null && (
            <div className="text-2xl font-bold text-primary bg-primary-50 px-4 py-2 rounded-lg">
                {t('exam.timer')}: {formatTime(timeLeft)}
            </div>
        )}
      </div>

      <p className="text-gray-600 mb-8">{t('exam.prompt')}</p>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-8">
        {questionsToDisplay.map((q: Question, index) => (
          <div key={q.id} className="p-6 bg-white rounded-lg shadow-md">
            <p className="font-semibold text-lg text-gray-800">{t('exam.question', { index: index + 1, text: q.text })}</p>
            <div className="mt-4 space-y-3">
              {q.type === QuestionType.MULTIPLE_CHOICE && q.options?.map(option => (
                <label key={option} className="flex items-center p-3 rounded-md hover:bg-gray-100 cursor-pointer">
                  <input
                    type="radio"
                    name={q.id}
                    value={option}
                    onChange={e => handleAnswerChange(q.id, e.target.value)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <span className="ms-3 text-gray-700">{option}</span>
                </label>
              ))}
              {q.type === QuestionType.TRUE_FALSE && (
                <>
                  <label className="flex items-center p-3 rounded-md hover:bg-gray-100 cursor-pointer">
                    <input type="radio" name={q.id} value="true" onChange={e => handleAnswerChange(q.id, e.target.value)} className="h-4 w-4 text-primary focus:ring-primary border-gray-300" />
                    <span className="ms-3 text-gray-700">{t('exam.true')}</span>
                  </label>
                  <label className="flex items-center p-3 rounded-md hover:bg-gray-100 cursor-pointer">
                    <input type="radio" name={q.id} value="false" onChange={e => handleAnswerChange(q.id, e.target.value)} className="h-4 w-4 text-primary focus:ring-primary border-gray-300" />
                    <span className="ms-3 text-gray-700">{t('exam.false')}</span>
                  </label>
                </>
              )}
              {q.type === QuestionType.SHORT_ANSWER && (
                <input
                  type="text"
                  name={q.id}
                  onChange={e => handleAnswerChange(q.id, e.target.value)}
                  className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder={t('exam.yourAnswer')}
                />
              )}
            </div>
          </div>
        ))}
        <button type="submit" className="w-full py-3 px-6 text-lg font-semibold text-white bg-success rounded-lg shadow-md hover:bg-green-600">
          {t('exam.submit')}
        </button>
      </form>
    </div>
  );
};

export default ExamScreen;