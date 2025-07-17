import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Module, Material, UserRole } from '../types';

const VideoIcon = () => <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const PdfIcon = () => <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;


const CourseDetailScreen: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { courses, currentUser, getExamResult, t, exams, isMaterialCompleted, markMaterialAsCompleted, hasCompletedAllMaterials } = useAppContext();
  const course = courses.find(c => c.id === courseId);
  const exam = exams.find(e => e.id === course?.examId);

  if (!currentUser) return <Navigate to="/login" />;
  if (!course || !exam) return <div className="text-center text-red-500">{t('course.notFound')}</div>;
  
  const examResult = getExamResult(course.examId, currentUser.id);
  const canTakeExam = !exam.isLocked || hasCompletedAllMaterials(course.id) || currentUser.role === UserRole.ADMIN;

  const renderMaterial = (material: Material) => {
    const completed = isMaterialCompleted(material.id);
    const commonClasses = "flex items-center space-x-3 rtl:space-x-reverse p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors";

    if (material.type === 'VIDEO') {
        return (
            <div className="mt-4">
                <div className="flex items-center mb-2">
                    <input
                        id={`mat-check-${material.id}`}
                        type="checkbox"
                        className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        checked={completed}
                        onChange={(e) => markMaterialAsCompleted(material.id, e.target.checked)}
                     />
                     <label htmlFor={`mat-check-${material.id}`} className="ms-2 font-semibold text-gray-700">{material.title}</label>
                </div>
                <div className="aspect-w-16 aspect-h-9">
                    <iframe 
                        src={material.url} 
                        title={material.title} 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                        className="w-full h-full rounded-md shadow-lg"
                    ></iframe>
                </div>
            </div>
        );
    }
    return (
        <label htmlFor={`mat-check-${material.id}`} className={commonClasses + " cursor-pointer"}>
             <input
                id={`mat-check-${material.id}`}
                type="checkbox"
                className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                checked={completed}
                onChange={(e) => markMaterialAsCompleted(material.id, e.target.checked)}
                onClick={(e) => e.stopPropagation()} // prevent label click from double-triggering
            />
            {material.type === 'PDF' ? <PdfIcon /> : <VideoIcon />}
            <a href={material.url} target="_blank" rel="noopener noreferrer" className="text-gray-800 font-medium hover:underline" onClick={(e) => e.stopPropagation()}>
                {material.title}
            </a>
        </label>
    );
  };
  
  return (
    <div>
      <div className="relative mb-8">
        <img src={course.imageUrl} alt={course.title} className="w-full h-64 object-cover rounded-lg shadow-lg"/>
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
            <h1 className="text-4xl font-bold text-white text-center px-4">{course.title}</h1>
        </div>
      </div>
      <p className="text-lg text-gray-600 mb-8">{course.description}</p>
      
      <div className="space-y-6">
        {course.modules.map((module: Module) => (
          <div key={module.id} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{module.title}</h2>
            <div className="space-y-4">
              {module.materials.map((material: Material) => (
                <div key={material.id}>
                  {renderMaterial(material)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('course.examTitle')}</h2>
        {examResult ? (
             <div className="p-6 bg-green-50 border-s-4 border-green-500 rounded-e-lg">
                <p className="text-lg text-green-800">{t('course.examCompleted')}</p>
                <p className="text-2xl font-bold text-green-900 mt-2">{t('course.yourScore', { score: examResult.score.toFixed(1) })}</p>
                <p className="text-sm text-green-700 mt-2">{t('course.reviewHint')}</p>
             </div>
        ) : (
             <div className="inline-block">
                {canTakeExam ? (
                     <Link 
                        to={`/exam/${course.examId}`} 
                        className="px-8 py-4 text-lg font-semibold text-white bg-primary rounded-lg shadow-md hover:bg-primary-700 transition-transform transform hover:scale-105"
                     >
                        {t('course.startExam')}
                    </Link>
                ) : (
                    <div className="p-4 bg-yellow-50 border-s-4 border-yellow-400 rounded-e-lg">
                        <p className="text-yellow-800">{t('course.examLocked')}</p>
                    </div>
                )}
             </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetailScreen;