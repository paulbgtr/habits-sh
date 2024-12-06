import classNames from "classnames";
import React, { MouseEventHandler } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  children?: React.ReactNode;
  color?: "white" | "red";
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

export const Button: React.FC<Props> = ({
  children,
  color = "white",
  className,
  onClick,
  disabled,
}) => {
  return (
    <button
      className={twMerge(
        classNames("rounded-md px-4 py-1 font-bold duration-100", {
          "hover:bg-opacity-80": !disabled,
          "bg-white text-black": color === "white",
          "bg-red-500": color === "red",
          "opacity-50": disabled,
        }),
        className,
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
