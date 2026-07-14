import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { notificationApi } from "../../api";
import { useSiteAuth } from "../../context/SiteAuthContext";
import { formatDateTime } from "../../utils";

const NotificationBell = () => {
  const { site } = useSiteAuth();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!site?._id) return;
    let active = true;
    notificationApi
      .getSiteUnreadCount()
      .then((res) => {
        if (active) setUnread(res.data?.data?.count || 0);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [site?._id]);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const toggle = async () => {
    const next = !open;
    setOpen(next);
    if (next) {
      setLoading(true);
      try {
        const res = await notificationApi.getSite();
        setItems(res.data?.data?.notifications || []);
        const countRes = await notificationApi.getSiteUnreadCount();
        setUnread(countRes.data?.data?.count || 0);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    }
  };

  const markAll = async () => {
    try {
      await notificationApi.readSiteAll();
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnread(0);
    } catch {
      /* ignore */
    }
  };

  const markRead = async (id) => {
    try {
      await notificationApi.readSite(id);
      setItems((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
      setUnread((prev) => Math.max(0, prev - 1));
    } catch {
      /* ignore */
    }
  };

  const remove = async (id) => {
    try {
      await notificationApi.deleteSite(id);
      setItems((prev) => prev.filter((n) => n._id !== id));
      setUnread((prev) => {
        const target = items.find((n) => n._id === id);
        if (target && !target.isRead) return Math.max(0, prev - 1);
        return prev;
      });
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggle}
        className="relative p-2 rounded-lg bg-secondary-100 dark:bg-secondary-800 hover:bg-secondary-200 dark:hover:bg-secondary-700 transition-theme"
        aria-label="Notifications"
      >
        <span className="text-secondary-700 dark:text-secondary-300 text-lg leading-none">🔔</span>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold rounded-full bg-red-500 text-white">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-[calc(100%+8px)] right-0 w-80 max-w-[calc(100vw-24px)] bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl shadow-xl z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-secondary-200 dark:border-secondary-700">
              <span className="font-semibold text-secondary-900 dark:text-white">Notifications</span>
              <button
                onClick={markAll}
                className="text-xs text-primary-600 dark:text-primary-400 font-medium"
              >
                Mark all read
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <p className="p-4 text-sm text-secondary-500 dark:text-secondary-400">Loading...</p>
              ) : items.length === 0 ? (
                <p className="p-4 text-sm text-secondary-500 dark:text-secondary-400">No notifications</p>
              ) : (
                items.map((n) => (
                  <div
                    key={n._id}
                    className={`px-4 py-3 border-b border-secondary-100 dark:border-secondary-700 ${
                      n.isRead ? "" : "bg-primary-50/60 dark:bg-primary-900/10"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-secondary-900 dark:text-white">{n.title}</p>
                        <p className="text-xs text-secondary-600 dark:text-secondary-400 mt-0.5">{n.message}</p>
                        <p className="text-[11px] text-secondary-400 dark:text-secondary-500 mt-1">
                          {formatDateTime(n.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!n.isRead && (
                          <button
                            onClick={() => markRead(n._id)}
                            className="p-1 rounded text-[10px] font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-theme"
                            title="Mark as read"
                          >
                            Read
                          </button>
                        )}
                        <button
                          onClick={() => remove(n._id)}
                          className="p-1 rounded text-[10px] font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition-theme"
                          title="Delete"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
