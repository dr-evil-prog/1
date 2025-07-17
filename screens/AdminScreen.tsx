
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { User, UserRole, Course } from '../types';
import { useNavigate } from 'react-router-dom';

const AdminScreen: React.FC = () => {
  const { t } = useAppContext();
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('admin.title')}</h1>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 rtl:space-x-reverse" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('users')}
            className={`${
              activeTab === 'users'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            {t('admin.tabs.users')}
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`${
              activeTab === 'courses'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            {t('admin.tabs.courses')}
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`${
              activeTab === 'analytics'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            {t('admin.tabs.analytics')}
          </button>
        </nav>
      </div>

      <div className="mt-8">
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'courses' && <CourseManagement />}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
      </div>
    </div>
  );
};

const UserManagement: React.FC = () => {
    const { users, activateUser, deactivateUser, t } = useAppContext();
    
    // Sort users to show pending users first
    const sortedUsers = [...users]
        .filter(u => u.role !== UserRole.ADMIN)
        .sort((a, b) => Number(a.isActive) - Number(b.isActive));

    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">{t('admin.users.title')}</h3>
            <p className="mt-1 text-sm text-gray-500">{t('admin.users.description')}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.users.table.name')}</th>
                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.users.table.email')}</th>
                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.users.table.status')}</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">{t('admin.users.table.actions')}</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedUsers.map((user: User) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.isActive ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">{t('profile.status.active')}</span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">{t('profile.status.pending')}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                    {user.isActive ? (
                      <button onClick={() => deactivateUser(user.id)} className="text-red-600 hover:text-red-900">
                        {t('admin.users.action.deactivate')}
                      </button>
                    ) : (
                      <button onClick={() => activateUser(user.id)} className="text-primary hover:text-primary-900">
                        {t('admin.users.action.activate')}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
};

const CourseManagement: React.FC = () => {
    const { courses, addCourse, deleteCourse, t } = useAppContext();
    const navigate = useNavigate();
    const [isCreating, setIsCreating] = useState(false);
    const [newCourseTitle, setNewCourseTitle] = useState('');
    const [newCourseDesc, setNewCourseDesc] = useState('');
    const [newCourseImg, setNewCourseImg] = useState('');

    const handleCreateCourse = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCourseTitle || !newCourseDesc) return;
        addCourse({ title: newCourseTitle, description: newCourseDesc, imageUrl: newCourseImg || 'https://picsum.photos/seed/new/600/400' });
        setNewCourseTitle('');
        setNewCourseDesc('');
        setNewCourseImg('');
        setIsCreating(false);
    }
    
    const handleDelete = (courseId: string) => {
        if (window.confirm(t('confirm.delete.course'))) {
            deleteCourse(courseId);
        }
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-medium leading-6 text-gray-900">{t('admin.courses.title')}</h3>
                        <p className="mt-1 text-sm text-gray-500">{t('admin.courses.description')}</p>
                    </div>
                    <button onClick={() => setIsCreating(!isCreating)} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-700">
                        {isCreating ? t('courseMgmt.cancel') : t('admin.courses.create')}
                    </button>
                </div>
            </div>

            {isCreating && (
                <div className="p-6">
                    <form onSubmit={handleCreateCourse} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('courseMgmt.courseTitle')}</label>
                            <input type="text" value={newCourseTitle} onChange={e => setNewCourseTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('courseMgmt.courseDescription')}</label>
                            <textarea value={newCourseDesc} onChange={e => setNewCourseDesc(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('courseMgmt.courseImageUrl')}</label>
                            <input type="text" value={newCourseImg} onChange={e => setNewCourseImg(e.target.value)} placeholder="https://picsum.photos/seed/..." className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                        </div>
                        <div className="flex justify-end space-x-3 rtl:space-x-reverse">
                             <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">{t('courseMgmt.cancel')}</button>
                            <button type="submit" className="px-4 py-2 bg-success text-white rounded-md hover:bg-green-600">{t('admin.courses.create')}</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.courses.table.title')}</th>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.courses.table.description')}</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">{t('admin.courses.table.actions')}</span></th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {courses.map((course: Course) => (
                    <tr key={course.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.title}</td>
                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 max-w-md truncate">{course.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium space-x-4 rtl:space-x-reverse">
                            <button onClick={() => navigate(`/admin/course/${course.id}`)} className="text-primary-600 hover:text-primary-900">{t('admin.courses.action.manage')}</button>
                            <button onClick={() => handleDelete(course.id)} className="text-red-600 hover:text-red-900">{t('admin.courses.action.delete')}</button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </div>
    );
};
  
const AnalyticsDashboard: React.FC = () => {
    const { users, examResults, t } = useAppContext();
  
    const totalUsers = users.length;
    const activatedUsers = users.filter(u => u.isActive).length;
    const totalExamsTaken = examResults.length;
    const averageScore = totalExamsTaken > 0 
      ? examResults.reduce((sum, r) => sum + r.score, 0) / totalExamsTaken
      : 0;
  
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <div className="ms-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{t('admin.analytics.totalUsers')}</dt>
                  <dd className="text-3xl font-semibold text-gray-900">{totalUsers}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div className="ms-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{t('admin.analytics.activatedUsers')}</dt>
                  <dd className="text-3xl font-semibold text-gray-900">{activatedUsers}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                 <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
              </div>
              <div className="ms-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{t('admin.analytics.examsTaken')}</dt>
                  <dd className="text-3xl font-semibold text-gray-900">{totalExamsTaken}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                 <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
              </div>
              <div className="ms-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{t('admin.analytics.averageScore')}</dt>
                  <dd className="text-3xl font-semibold text-gray-900">{averageScore.toFixed(1)}%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

export default AdminScreen;
