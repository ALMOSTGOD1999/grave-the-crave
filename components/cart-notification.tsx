"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X } from "lucide-react";

interface Notification {
  id: string;
  message: string;
  type: "success" | "error";
}

export default function CartNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const handleCartUpdate = (event: CustomEvent) => {
      const { message, type } = event.detail;
      const id = Date.now().toString();

      setNotifications((prev) => [...prev, { id, message, type }]);

      // Auto remove after 3 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    };

    window.addEventListener("cart-updated", handleCartUpdate as EventListener);

    return () => {
      window.removeEventListener(
        "cart-updated",
        handleCartUpdate as EventListener
      );
    };
  }, []);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.3 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.5 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`
              flex items-center gap-3 p-4 rounded-lg shadow-lg max-w-sm
              ${
                notification.type === "success"
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }
            `}
          >
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <p className="flex-1 text-sm font-medium">{notification.message}</p>
            <button
              onClick={() => removeNotification(notification.id)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
