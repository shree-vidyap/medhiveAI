import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Activity, Bell, User, Menu, X, MessageSquare, HeartPulse, Building2, Home } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { notifications, user } = useApp();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const navLinks = [
    { name: t('nav.home', 'Home'), path: '/home', icon: Home },
    { name: t('nav.health', 'Health'), path: '/symptom-checker', icon: HeartPulse },
    { name: t('nav.care', 'Care'), path: '/facilities', icon: Building2 },
    { name: t('nav.assistant', 'Assistant'), path: '/assistant', icon: MessageSquare },
  ];

  const isActive = (path: string) => {
    if (path === '/home') return location.pathname === '/home';
    return location.pathname.startsWith(path);
  };

  const isLanding = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 bg-[#0B0F0E]/90 backdrop-blur-md border-b border-slate-800/80 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
        {/* Brand & Logo */}
        <Link to={isLanding ? '/' : '/home'} className="flex items-center gap-2.5 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 via-teal-500 to-emerald-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-2">
              Medihivi AI
            </h1>
          </div>
        </Link>

        {/* Desktop Nav Links (Hidden on landing page or desktop if preferred) */}
        {!isLanding && (
          <nav className="hidden md:flex items-center gap-1 bg-[#131C1E] p-1 rounded-xl border border-slate-800/80 text-xs font-semibold">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-2 ${
                    active
                      ? 'bg-teal-600/20 text-teal-300 border border-teal-500/30 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-teal-400' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right Side Controls: Language Switcher, Notifications, Profile & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Language Switcher - Always Visible */}
          <LanguageSwitcher />

          {/* Notifications Link */}
          <Link
            to="/notifications"
            className="p-2 bg-[#131C1E] hover:bg-slate-800/80 rounded-xl border border-slate-800 text-slate-300 relative transition cursor-pointer"
            title={t('nav.notifications', 'Notifications')}
          >
            <Bell className="w-4 h-4 text-slate-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-teal-500 text-slate-950 rounded-full text-[10px] font-extrabold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </Link>

          {/* User Profile Button */}
          <Link
            to="/profile"
            className="flex items-center gap-2 bg-[#131C1E] hover:bg-slate-800/80 border border-slate-800 text-slate-200 text-xs px-2.5 py-1.5 rounded-xl font-bold transition cursor-pointer"
            title={t('nav.profile', 'Profile')}
          >
            <User className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline max-w-[90px] truncate">{user.name}</span>
          </Link>

          {/* Mobile Hamburger Button (if not landing) */}
          {!isLanding && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 bg-[#131C1E] hover:bg-slate-800 rounded-xl border border-slate-800 text-slate-300 transition cursor-pointer"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-slate-300" /> : <Menu className="w-5 h-5 text-slate-300" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Nav Collapse Menu */}
      {!isLanding && mobileMenuOpen && (
        <div className="md:hidden bg-[#0B0F0E] border-b border-slate-800 px-4 py-3 space-y-2 animate-fade-in">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                  active
                    ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-4 h-4 text-teal-400" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
