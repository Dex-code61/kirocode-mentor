import { CodeEditorExample } from '@/components/code-editor';

export default function TestMonacoPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Monaco Editor Integration Test</h1>
        <p className="text-muted-foreground">
          Testing the Monaco Editor implementation for Task 5 of the KiroCode Mentor Platform.
        </p>
      </div>
      
      <CodeEditorExample />
    </div>
  );
}