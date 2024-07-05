
export default function getExtLang(ext){
      // Language extensions
  const extensionToLang = {
    // Markup languages
    ".xml": "xml",
    ".html": "htmlmixed",
    ".md": "markdown",
    ".rst": "rst",

    // Programming languages
    ".js": "javascript",
    ".ts": "typescript",
    ".py": "python",
    ".rb": "ruby",
    ".java": "java",
    ".c": "c",
    ".cpp": "cpp",
    ".cs": "csharp",
    ".go": "go",
    ".php": "php",
    ".pl": "perl",
    ".lua": "lua",
    ".swift": "swift",
    ".m": "objectivec",
    ".r": "r",
    ".kt": "kotlin",
    ".rs": "rust",

    // Stylesheet languages
    ".css": "css",
    ".sass": "sass",
    ".scss": "scss",
    ".less": "less",
    ".styl": "stylus",

    // Data formats
    ".json": "json",
    ".yml": "yaml",
    ".yaml": "yaml",
    ".toml": "toml",
    ".ini": "ini",
    ".csv": "csv",
    ".sql": "sql",

    // Scripting languages
    ".sh": "shell",
    ".ps1": "powershell",
    ".vbs": "vbscript",
    ".bash": "shell",

    // Other languages
    ".vb": "vb",
    ".matlab": "matlab",
    ".sas": "sas",
    ".stata": "stata",
    ".f90": "fortran",
    ".cob": "cobol",
    ".pas": "pascal",
    ".hs": "haskell",
    ".scm": "scheme",
    ".clj": "clojure",
    ".erl": "erlang",
    ".ex": "elixir",
    ".fs": "fsharp",
  };

  return extensionToLang[ext] || "plaintext";
}