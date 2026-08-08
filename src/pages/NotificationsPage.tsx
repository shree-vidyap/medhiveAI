import React from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  Check, 
  Trash2, 
  Siren, 
  Send, 
  RefreshCw, 
  Info, 
  Clock 
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationAsRead, clearAllNotifications } = useApp();
  const { t } = useTranslation();

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'EMERGENCY':
        return <Siren className="w-4 h-4 text-rose-400" />;
      case 'REFERRAL':
        return <Send className="w-4 h-4 text-teal-400" />;
      case 'SYNC':
        return <RefreshCw className="w-4 h-4 text-amber-400" />;
      case 'SYSTEM':
      default:
        return <Info className="w-4 h-4 text-teal-300" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-teal-400" />
            {t('nav.notifications', 'Notifications')}
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            System alerts, referral acceptance updates, and health report status
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={clearAllNotifications}
            className="text-xs font-bold text-slate-400 hover:text-rose-300 bg-[#131C1E] px-3.5 py-2 rounded-xl border border-slate-800 hover:border-rose-900/50 flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="bento-card p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
            <Bell className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-300">No active notifications</p>
          <p className="text-xs text-slate-500">You are all caught up with your healthcare updates.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`bento-card p-4 sm:p-5 flex items-start justify-between gap-4 transition ${
                !notif.read ? 'border-teal-500/40 bg-[#131C1E]' : 'opacity-70 bg-[#0B0F0E]'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  {getNotifIcon(notif.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-white">{notif.title}</h3>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {notif.message}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1 pt-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </p>
                </div>
              </div>

              {!notif.read && (
                <button
                  onClick={() => markNotificationAsRead(notif.id)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-teal-400 rounded-lg text-xs font-bold transition cursor-pointer shrink-0"
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
