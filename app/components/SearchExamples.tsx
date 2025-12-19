"use client";

interface SearchExamplesProps {
  examples: string[];
}

export default function SearchExamples({ examples }: SearchExamplesProps) {
  const handleExampleClick = (example: string) => {
    window.location.href = `/search?q=${encodeURIComponent(example)}&semantic=true`;
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {examples.map((example, index) => (
        <button
          key={index}
          onClick={() => handleExampleClick(example)}
          className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-full border border-gray-700 hover:border-red-500 transition-all duration-200"
        >
          {example}
        </button>
      ))}
    </div>
  );
}
