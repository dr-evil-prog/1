import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { UserRole } from '../types';

const Header: React.FC = () => {
  const { currentUser, logout, t, language, setLanguage } = useAppContext();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setLangMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false); // Close mobile menu if open
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive ? 'bg-primary-700 text-white' : 'text-gray-300 hover:bg-primary-600 hover:text-white'
    }`;
    
  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-3 py-2 rounded-md text-base font-medium ${
      isActive ? 'bg-primary-700 text-white' : 'text-gray-300 hover:bg-primary-600 hover:text-white'
    }`;

  if (!currentUser) {
    return null; // Don't show header on login/register screens
  }

  const LanguageSwitcher = () => (
    <div 
      className="relative"
      onMouseEnter={() => setLangMenuOpen(true)}
      onMouseLeave={() => setLangMenuOpen(false)}
    >
      <button
        onClick={() => setLangMenuOpen(!isLangMenuOpen)}
        className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-primary-600 hover:text-white flex items-center"
      >
        {t('language')}
        <svg className="w-4 h-4 ms-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>
      {isLangMenuOpen && (
        <div className="absolute end-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
          <button
            onClick={() => { setLanguage('en'); setLangMenuOpen(false); }}
            className={`block w-full text-start px-4 py-2 text-sm ${language === 'en' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} hover:bg-gray-100`}
          >
            {t('english')}
          </button>
          <button
            onClick={() => { setLanguage('ar'); setLangMenuOpen(false); }}
            className={`block w-full text-start px-4 py-2 text-sm ${language === 'ar' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} hover:bg-gray-100`}
          >
            {t('arabic')}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <nav className="bg-primary-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="text-white font-bold text-xl" onClick={() => setIsMenuOpen(false)}>
              {t('header.title')}
            </NavLink>
            <div className="hidden md:block">
              <div className="ms-10 flex items-baseline space-x-4 rtl:space-x-reverse">
                <NavLink to="/" className={navLinkClass}>{t('header.home')}</NavLink>
                <NavLink to="/profile" className={navLinkClass}>{t('header.profile')}</NavLink>
                {currentUser.role === UserRole.ADMIN && (
                  <NavLink to="/admin" className={navLinkClass}>{t('header.admin')}</NavLink>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
             <LanguageSwitcher />
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-primary-600 hover:text-white"
            >
              {t('header.logout')}
            </button>
          </div>
          <div className="-me-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-800 focus:ring-white"
            >
              <span className="sr-only">{t('header.openMenu')}</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/" className={mobileNavLinkClass} onClick={() => setIsMenuOpen(false)}>{t('header.home')}</NavLink>
            <NavLink to="/profile" className={mobileNavLinkClass} onClick={() => setIsMenuOpen(false)}>{t('header.profile')}</NavLink>
            {currentUser.role === UserRole.ADMIN && (
              <NavLink to="/admin" className={mobileNavLinkClass} onClick={() => setIsMenuOpen(false)}>{t('header.admin')}</NavLink>
            )}
             <div className="border-t border-gray-700 my-2"></div>
            <div className="px-2">
                <p className="text-gray-400 text-sm font-semibold mb-1">{t('language')}</p>
                 <button onClick={() => { setLanguage('en'); setIsMenuOpen(false); }} className={`block w-full text-start px-3 py-2 rounded-md text-base font-medium ${language === 'en' ? 'bg-primary-700 text-white' : 'text-gray-300 hover:bg-primary-600 hover:text-white'}`}>{t('english')}</button>
                 <button onClick={() => { setLanguage('ar'); setIsMenuOpen(false); }} className={`block w-full text-start px-3 py-2 rounded-md text-base font-medium ${language === 'ar' ? 'bg-primary-700 text-white' : 'text-gray-300 hover:bg-primary-600 hover:text-white'}`}>{t('arabic')}</button>
            </div>
             <div className="border-t border-gray-700 my-2"></div>
            <button
              onClick={handleLogout}
              className="block w-full text-start px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-primary-600 hover:text-white"
            >
              {t('header.logout')}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;