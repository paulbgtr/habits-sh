import React from "react";

interface Props {
  children?: React.ReactNode;
  onClose?: () => void;
}

export const Modal: React.FC<Props> = ({ children, onClose }) => {
  return (
    <div
      className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-20 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-dark-gray border-gray flex min-h-[200px] w-full flex-col gap-2 rounded-lg border-[1px] p-4 sm:w-fit"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {children}
      </div>
    </div>
  );
};
