export interface Source {
  nom: string;
  lien: string;
}

export interface UiHints {
  couleur_verdict: string; // 'vert' | 'rouge' | 'orange'
  icon: string;
}

export interface FactCheckResult {
  resume: string;
  verdict: string;
  explication_tunisien: string;
  sources: Source[];
  ui_hints: UiHints;
  is_tunisia_related: boolean; // Nouveau champ pour savoir si ça concerne la Tunisie
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}