import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Course } from '../types';

const CourseCard: React.FC<{ course: Course }> = ({ course }) => (
  <Link to={`/course/${course.id}`} className="block overflow-hidden bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
    <img className="object-cover w-full h-48" src={course.imageUrl} alt={course.title} />
    <div className="p-6">
      <h3 className="text-xl font-semibold text-gray-900">{course.title}</h3>
      <p className="mt-2 text-gray-600">{course.description}</p>
    </div>
  </Link>
);


const HomeScreen: React.FC = () => {
  const { currentUser, courses, t } = useAppContext();

  if (!currentUser) return null;

  if (!currentUser.isActive) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white rounded-lg shadow-md">
        <svg className="w-16 h-16 mb-4 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h1 className="text-3xl font-bold text-gray-800">{t('home.pending.title', { name: currentUser.name })}</h1>
        <p className="mt-4 text-lg text-gray-600">
          {t('home.pending.status')}
        </p>
        <p className="mt-2 text-gray-500">
          {t('home.pending.message')}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-2">{t('home.welcome', { name: currentUser.name })}</h1>
      <p className="text-xl text-gray-600 mb-8">{t('home.continueLearning')}</p>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {courses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default HomeScreen;
