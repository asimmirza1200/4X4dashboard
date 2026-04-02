import React, { useState, useEffect, useRef } from "react";
import { FiShield, FiXCircle, FiTrash2, FiMoreVertical } from "react-icons/fi";
import { createPortal } from "react-dom";

const UserRowActions = ({
  user,
  onBlockUser,
  onDeleteUser,
}) => {
  const buttonRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleAction = (action) => {
    setIsOpen(false);
    action();
  };

  // Update dropdown position
  const updatePosition = () => {
    const rect = buttonRef.current.getBoundingClientRect();
    const dropdownHeight = 200; // adjust based on your dropdown content
    const viewportHeight = window.innerHeight;

    let top = rect.bottom + window.scrollY + 4; // default below
    if (rect.bottom + dropdownHeight > viewportHeight) {
      top = rect.top + window.scrollY - dropdownHeight - 4; // show above if overflow
    }

    setPosition({
      top,
      left: rect.right + window.scrollX - 200,
    });
  };

  // Hover logic: show when hovering button or dropdown
  useEffect(() => {
    if (isHovering) {
      updatePosition();
      setIsOpen(true);
    } else {
      // slight delay to avoid flicker
      const timeout = setTimeout(() => setIsOpen(false), 100);
      return () => clearTimeout(timeout);
    }
  }, [isHovering]);

  // Click outside to close
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!buttonRef.current?.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isOpen]);

  return (
    <div className="relative inline-block">
      {/* Button */}
      <div
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="relative"
      >
        <button
          ref={buttonRef}
          type="button"
          className="p-1 text-gray-400 hover:text-emerald-600 focus:outline-none transition-colors"
        >
          <FiMoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Dropdown */}
      {isOpen &&
        createPortal(
          <div
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            style={{
              position: "absolute",
              top: position?.top,
              left: position?.left,
              width: "200px",
            }}
            className="bg-white dark:bg-gray-800 rounded-md shadow-lg z-[9999] border border-gray-200 dark:border-gray-700"
          >
            <div className="py-1">
              <button
                type="button"
                onClick={() => handleAction(() => onBlockUser(user))}
                className={`w-full text-left px-4 py-3 text-sm flex items-center gap-2 min-h-[44px] touch-manipulation ${
                  (user.isBlocked || false)
                    ? "text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                    : "text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                }`}
              >
                <FiXCircle className="w-4 h-4" />
                {(user.isBlocked || false) ? "Unblock User" : "Block User"}
              </button>

              <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

              <button
                type="button"
                onClick={() => handleAction(() => onDeleteUser(user))}
                className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 min-h-[44px] touch-manipulation"
              >
                <FiTrash2 className="w-4 h-4" />
                Delete User
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default UserRowActions;
