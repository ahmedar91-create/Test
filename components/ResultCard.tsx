import React from 'react';
import { FactCheckResult } from '../types';

interface ResultCardProps {
  result: FactCheckResult;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  // Function to map API color strings to Tailwind classes
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'vert':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'rouge':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'orange':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-800';
    }
  };

  const getVerdictBadgeColor = (color: string) => {
    switch (color) {
      case 'vert': return 'bg-green-600 text-white';
      case 'rouge': return 'bg-red-600 text-white';
      case 'orange': return 'bg-orange-500 text-white';
      default: return 'bg-slate-600 text-white';
    }
  };

  return (
    <div className="animate-fade-in-up">
      {/* Verdict Header */}
      <div className={`p-6 rounded-t-2xl border-t border-x ${getColorClasses(result.ui_hints.couleur_verdict)} border-b-0 relative overflow-hidden`}>
        
        {/* International Info Badge */}
        {result.is_tunisia_related === false && (
          <div className="absolute top-0 left-0 right-0 bg-amber-100 border-b border-amber-200 text-amber-900 text-xs py-1.5 px-4 text-center font-semibold flex items-center justify-center gap-2">
            <span>🌍</span> Info Internationale - Ne concerne pas directement la Tunisie
          </div>
        )}

        <div className={`flex items-center justify-between ${result.is_tunisia_related === false ? 'mt-6' : ''}`}>
          <div className="flex items-center gap-4">
            <span className="text-4xl">{result.ui_hints.icon}</span>
            <div>
              <p className="text-sm font-semibold opacity-80 uppercase tracking-wider">Verdict</p>
              <h2 className="text-2xl font-bold">{result.verdict}</h2>
            </div>
          </div>
          <div className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${getVerdictBadgeColor(result.ui_hints.couleur_verdict)}`}>
            {result.verdict}
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="bg-white border-x border-b border-slate-200 rounded-b-2xl p-6 shadow-sm">
        
        {/* Resume */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Résumé</h3>
          <p className="text-slate-800 leading-relaxed text-lg">{result.resume}</p>
        </div>

        {/* Explication */}
        <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100 relative overflow-hidden">
          {result.is_tunisia_related !== false && (
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/ce/Flag_of_Tunisia.svg" alt="Tunisia" className="w-16 h-10 object-cover rounded" />
            </div>
          )}
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
             Explication
          </h3>
          <p className="text-slate-800 leading-relaxed text-lg ar-text font-medium" dir="rtl">
            {result.explication_tunisien}
          </p>
        </div>

        {/* Sources */}
        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Sources Vérifiées</h3>
          {result.sources.length > 0 ? (
            <ul className="space-y-2">
              {result.sources.map((source, index) => (
                <li key={index}>
                  <a 
                    href={source.lien} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 hover:border-slate-300 transition-colors group"
                  >
                    <span className="text-slate-400 group-hover:text-red-500 transition-colors">🔗</span>
                    <span className="font-medium text-blue-600 group-hover:underline truncate flex-1">{source.nom}</span>
                    <svg className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 italic text-sm">Aucune source directe trouvée, mais l'analyse est basée sur les données disponibles.</p>
          )}
        </div>
      </div>
    </div>
  );
};