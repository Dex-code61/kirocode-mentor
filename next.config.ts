import type { NextConfig } from "next";
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Monaco Editor configuration
    if (!isServer) {
      config.plugins.push(
        new MonacoWebpackPlugin({
          languages: ['javascript', 'typescript', 'python', 'java', 'cpp', 'csharp', 'go', 'rust'],
          features: [
            'bracketMatching',
            'caretOperations',
            'clipboard',
            'codeAction',
            'codelens',
            'colorPicker',
            'comment',
            'contextmenu',
            'cursorUndo',
            'dnd',
            'find',
            'folding',
            'fontZoom',
            'format',
            'gotoError',
            'gotoLine',
            'gotoSymbol',
            'hover',
            'iPadShowKeyboard',
            'inPlaceReplace',
            'indentation',
            'inspectTokens',
            'linesOperations',
            'linkedEditing',
            'links',
            'multicursor',
            'parameterHints',
            'quickCommand',
            'quickHelp',
            'quickOutline',
            'referenceSearch',
            'rename',
            'smartSelect',
            'snippet',
            'suggest',
            'toggleHighContrast',
            'toggleTabFocusMode',
            'unusualLineTerminators',
            'wordHighlighter',
            'wordOperations',
            'wordPartOperations'
          ]
        })
      );
    }

    return config;
  },
};

export default nextConfig;
