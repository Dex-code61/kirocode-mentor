/**
 * Simple test to verify Monaco Editor types are working
 */

import type { editor } from 'monaco-editor';

// Test that we can use Monaco Editor types
const testMonacoTypes = () => {
  // This should compile without errors if Monaco Editor types are properly installed
  const editorOptions: editor.IStandaloneEditorConstructionOptions = {
    value: 'console.log("Hello World");',
    language: 'javascript',
    theme: 'vs-dark',
    automaticLayout: true,
    minimap: { enabled: true },
    wordWrap: 'on',
  };

  console.log('Monaco Editor types are working!', editorOptions);
};

export { testMonacoTypes };