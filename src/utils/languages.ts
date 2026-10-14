const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Lua: '#000080',
  R: '#198CE7',
  Scala: '#c22d40',
  Haskell: '#5e5086',
  Clojure: '#db5855',
  Elixir: '#6e4a7e',
  Erlang: '#B83998',
  Perl: '#0298c3',
  Julia: '#a270ba',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  PowerShell: '#012456',
  Makefile: '#427819',
  Dockerfile: '#384d54',
  Jupyter: '#DA5B0B',
  JupyterNotebook: '#DA5B0B',
};

const FALLBACK_PALETTE = [
  '#2563eb',
  '#7c3aed',
  '#db2777',
  '#ea580c',
  '#16a34a',
  '#0891b2',
  '#ca8a04',
  '#dc2626',
];

export function getLanguageColor(language: string | null): string {
  if (!language) return '#8b949e';
  if (LANGUAGE_COLORS[language]) return LANGUAGE_COLORS[language];
  let hash = 0;
  for (let i = 0; i < language.length; i++) {
    hash = language.charCodeAt(i) + ((hash << 5) - hash);
  }
  return FALLBACK_PALETTE[Math.abs(hash) % FALLBACK_PALETTE.length];
}
