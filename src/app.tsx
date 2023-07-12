import React, { useState } from 'react';
import { CodeEditor } from '$components/code-editor/code-editor';

export function App() {
  const [query, setQuery] = useState<string>('MATCH (p:Person)-[:LIVES_IN]->(c:City)\n');

  return (
    <div className="App" data-testid="ti-app-container">
      <CodeEditor value={query} onValueChange={setQuery} />
    </div>
  );
}
