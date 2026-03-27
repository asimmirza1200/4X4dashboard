import React, { useState,useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FiEdit, FiCopy, FiTrash2, FiEye, FiMoreVertical } from "react-icons/fi";
import { createPortal } from "react-dom";
const ProductRowActions = ({
  product,
  onEdit,
  onQuickEdit,
  onView,
  onDuplicate,
  onTrash,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState(null);
const buttonRef = React.useRef();

  const handleClick = (e) => {
    e.stopPropagation();
    const rect = buttonRef.current.getBoundingClientRect();

  setPosition({
    top: rect.bottom + window.scrollY,
    left: rect.right + window.scrollX - 200, // adjust width
  });

    setIsOpen(!isOpen);
  };

  const handleAction = (action) => {
    setIsOpen(false);
    action();
  };

  useEffect(() => {
  const handleOutsideClick = (e) => {
    // if click is NOT on button AND NOT inside dropdown → close
    if (!buttonRef.current?.contains(e.target)) {
      setIsOpen(false);
    }
  };

  if (isOpen) {
    document.addEventListener("click", handleOutsideClick);
  }

  return () => {
    document.removeEventListener("click", handleOutsideClick);
  };
}, [isOpen]);

const handleMouseEnter = () => {
  const rect = buttonRef.current.getBoundingClientRect();

  setPosition({
    top: rect.bottom + window.scrollY + 4,
    left: rect.right + window.scrollX - 200,
  });

  setIsOpen(true);
};

  return (
    <div className="relative inline-block">
      {/* Hover trigger - shows on hover over product name */}
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
  onMouseLeave={() => setIsOpen(false)}
      >
        <button
        ref={buttonRef}
          type="button"

          className="p-1 text-gray-400 hover:text-emerald-600 focus:outline-none transition-colors"
        >
          <FiMoreVertical className="w-4 h-4" />
        </button>

        {/* Dropdown menu */}
        {isOpen && (
            createPortal(
          <div
          onClick={(e) => e.stopPropagation()}
           style={{
    position: "absolute",
    top: position?.top,
    left: position?.left,
    width: "200px",
  }}
           className="bg-white dark:bg-gray-800 rounded-md shadow-lg z-[9999] border border-gray-200 dark:border-gray-700"
          >
            <div className="py-1">
              {/* Edit */}
              <button
                type="button"
                onClick={() => handleAction(onEdit)}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 min-h-[44px] touch-manipulation"
              >
                <FiEdit className="w-4 h-4" />
                {t("Edit")}
              </button>

              {/* Quick Edit */}
              <button
                type="button"
                onClick={() => handleAction(onQuickEdit)}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 min-h-[44px] touch-manipulation"
              >
                <FiEdit className="w-4 h-4" />
                {t("Quick Edit")}
              </button>

              {/* View Product */}
              <button
                type="button"
                onClick={() => handleAction(onView)}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 min-h-[44px] touch-manipulation"
              >
                <FiEye className="w-4 h-4" />
                {t("View Product")}
              </button>

              {/* Duplicate */}
              <button
                type="button"
                onClick={() => handleAction(onDuplicate)}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 min-h-[44px] touch-manipulation"
              >
                <FiCopy className="w-4 h-4" />
                {t("Duplicate")}
              </button>

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

              {/* Move to Trash */}
              <button
                type="button"
                onClick={() => handleAction(onTrash)}
                className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 min-h-[44px] touch-manipulation"
              >
                <FiTrash2 className="w-4 h-4" />
                {t("Move to Trash")}
              </button>
            </div>
          </div>
          ,
    document.body
  )
        )}
      </div>
    </div>
  );
};

export default ProductRowActions;

