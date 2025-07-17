import React from 'react';
import { useAppContext } from '../context/AppContext';
import { UserRole } from '../types';

const ProfileScreen: React.FC = () => {
  const { currentUser, t } = useAppContext();

  if (!currentUser) {
    return <div>{t('profile.loading')}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('profile.title')}</h1>
        <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="grid grid-cols-1 gap-y-4 md:grid-cols-3 md:gap-x-4">
                <div className="md:col-span-1 font-semibold text-gray-600">{t('profile.name')}</div>
                <div className="md:col-span-2 text-gray-800">{currentUser.name}</div>

                <div className="md:col-span-1 font-semibold text-gray-600">{t('profile.email')}</div>
                <div className="md:col-span-2 text-gray-800">{currentUser.email}</div>

                <div className="md:col-span-1 font-semibold text-gray-600">{t('profile.role')}</div>
                <div className="md:col-span-2 text-gray-800 capitalize">
                    {currentUser.role === UserRole.ADMIN ? t('profile.role.admin') : t('profile.role.user')}
                </div>

                <div className="md:col-span-1 font-semibold text-gray-600">{t('profile.status')}</div>
                <div className="md:col-span-2">
                    {currentUser.isActive ? (
                        <span className="px-3 py-1 text-sm font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                            {t('profile.status.active')}
                        </span>
                    ) : (
                        <span className="px-3 py-1 text-sm font-semibold leading-5 text-yellow-800 bg-yellow-100 rounded-full">
                            {t('profile.status.pending')}
                        </span>
                    )}
                </div>
            </div>
            {currentUser.role === UserRole.ADMIN && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">{t('profile.adminMessage')}</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default ProfileScreen;
