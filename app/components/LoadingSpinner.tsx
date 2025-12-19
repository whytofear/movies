"use client";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "blue" | "green" | "purple" | "gray";
  text?: string;
}

export default function LoadingSpinner({
  size = "md",
  color = "blue",
  text,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const colorClasses = {
    blue: "border-blue-500",
    green: "border-green-500",
    purple: "border-purple-500",
    gray: "border-gray-500",
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div
        className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]}`}
      ></div>
      {text && (
        <p className={`mt-2 text-${color}-600 text-sm font-medium`}>{text}</p>
      )}
    </div>
  );
}
