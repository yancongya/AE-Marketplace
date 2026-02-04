import { Terminal } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick?: () => void;
}

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-full bg-white text-black font-medium text-sm flex items-center gap-2 shadow-lg hover:bg-gray-100 transition-all hover:scale-105"
    >
      <Terminal className="w-4 h-4" />
      <span>一键运行任何 Script</span>
    </button>
  );
}
