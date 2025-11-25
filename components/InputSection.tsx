import React, { useState } from 'react';

interface InputSectionProps {
  onCheck: (query: string) => void;
  isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onCheck, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onCheck(input);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
      <label htmlFor="fact-input" className="block text-sm font-medium text-slate-700 mb-2">
        Information, rumeur ou lien à vérifier
      </label>
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          id="fact-input"
          className="w-full p-4 pr-12 text-slate-800 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all resize-none h-32"
          placeholder="Collez un lien Facebook, un texte ou une rumeur ici..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />
        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`
              px-6 py-2.5 rounded-lg font-semibold text-white transition-all
              ${!input.trim() || isLoading 
                ? 'bg-slate-300 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700 shadow-md hover:shadow-lg active:scale-95'}
            `}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Vérification...
              </span>
            ) : (
              'Vérifier'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
