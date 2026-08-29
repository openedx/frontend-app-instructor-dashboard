import { useCallback, useRef } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';

interface CodeEditorProps {
  data: string;
}

const decodeHtml = (raw: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(raw, 'text/html');
  return doc.documentElement.textContent || '';
};

const CodeEditor = ({ data }: CodeEditorProps) => {
  const editorRef = useRef<EditorView | null>(null);

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (editorRef.current) {
      editorRef.current.destroy();
      editorRef.current = null;
    }
    if (node && data) {
      editorRef.current = new EditorView({
        state: EditorState.create({
          doc: decodeHtml(data),
          extensions: [
            basicSetup,
            EditorState.readOnly.of(true),
            EditorView.editable.of(false),
          ],
        }),
        parent: node,
      });
    }
  }, [data]);

  return <div ref={containerRef} />;
};

export default CodeEditor;
