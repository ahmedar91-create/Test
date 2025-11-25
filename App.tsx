import React, { useState } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { ResultCard } from './components/ResultCard';
import { checkFactWithGemini } from './services/geminiService';
import { FactCheckResult } from './types';

function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FactCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async (query: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await checkFactWithGemini(query);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de la vérification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header />
      
      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Vérifiez l'info, stop à l'intox.</h2>
          <p className="text-slate-500">
            L'intelligence artificielle au service de la vérité en Tunisie. 
            Analysez des textes ou des liens en temps réel.
          </p>
        </div>

        <InputSection onCheck={handleCheck} isLoading={loading} />

        {error && (
          <div className="p-4 mb-6 rounded-lg bg-red-50 text-red-700 border border-red-200 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {result && <ResultCard result={result} />}
        
        {!result && !loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm text-center">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-semibold text-slate-800 mb-1">Rapide</h3>
              <p className="text-sm text-slate-500">Analyse instantanée grâce à Gemini 2.5 Flash.</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm text-center">
              <div className="mb-2 flex justify-center h-8 items-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/ce/Flag_of_Tunisia.svg" alt="Drapeau Tunisie" className="h-6 w-auto shadow-sm rounded-sm" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">100% Tounsi</h3>
              <p className="text-sm text-slate-500">Explications en Derja adaptées au contexte local.</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm text-center">
              <div className="text-2xl mb-2">🔍</div>
              <h3 className="font-semibold text-slate-800 mb-1">Sources Fiables</h3>
              <p className="text-sm text-slate-500">Recherche croisée sur les médias de confiance.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;