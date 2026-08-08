import React from 'react';
import { Bell, CheckCheck, Trash2, X, AlertTriangle, Send, CheckCircle2 } from 'lucide-react';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'TRIAGE' | 'REFERRAL' | 'EMERGENCY' | 'SYSTEM';
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onClearAll: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-scale-up text-slate-800">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-50 border border-teal-200 text-teal-600 rounded-2xl relative">
              <Bell className="w-5 h-5 text-teal-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Notifications</h3>
              <p className="text-xs text-slate-500 font-medium">Updates on referrals, assessments & triage</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action controls */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-between text-xs font-bold mb-4 px-1">
            <button
              onClick={onMarkAllRead}
              className="text-teal-700 hover:text-teal-800 flex items-center gap-1 transition cursor-pointer"
            >
              <CheckCheck className="w-4 h-4 text-teal-600" />
              <span>Mark all as read</span>
            </button>
            <button
              onClick={onClearAll}
              className="text-slate-400 hover:text-rose-600 flex items-center gap-1 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear all</span>
            </button>
          </div>
        )}

        {/* List */}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {notifications.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <Bell className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">No notifications right now</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border transition flex items-start gap-3 ${
                  item.read ? 'bg-slate-50 border-slate-200/80 opacity-80' : 'bg-white border-teal-200 shadow-xs'
                }`}
              >
                <div className="p-2 rounded-xl shrink-0 mt-0.5">
                  {item.type === 'EMERGENCY' ? (
                    <div className="p-1.5 bg-rose-100 text-rose-600 rounded-lg">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  ) : item.type === 'REFERRAL' ? (
                    <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
                      <Send className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{item.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
