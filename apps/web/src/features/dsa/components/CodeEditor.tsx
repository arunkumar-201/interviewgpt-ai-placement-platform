import { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { Minus, Plus } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { LANGUAGE_OPTIONS } from '../lib/dsa-utils';
import type { DsaLanguage } from '@interviewgpt/shared';
import { Button } from '@/components/ui/button';

const FONT_KEY = 'dsa-editor-font-size';

interface CodeEditorProps {
  language: DsaLanguage;
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export function CodeEditor({ language, value, onChange, readOnly }: CodeEditorProps) {
  const { theme } = useTheme();
  const monacoLang = LANGUAGE_OPTIONS.find((l) => l.value === language)?.monaco ?? 'python';
  const [fontSize, setFontSize] = useState(() => {
    const stored = localStorage.getItem(FONT_KEY);
    return stored ? Number(stored) : 14;
  });

  useEffect(() => {
    localStorage.setItem(FONT_KEY, String(fontSize));
  }, [fontSize]);

  const handleMount = (ed: editor.IStandaloneCodeEditor) => {
    ed.updateOptions({
      tabCompletion: 'on',
      suggestOnTriggerCharacters: true,
      quickSuggestions: true,
    });
  };

  return (
    <div className="flex h-full min-h-[320px] flex-col overflow-hidden rounded-lg border border-border/60">
      <div className="flex items-center justify-between border-b border-border/50 bg-muted/30 px-3 py-1.5">
        <span className="text-xs text-muted-foreground">Monaco Editor</span>
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">Font</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setFontSize((f) => Math.max(12, f - 1))}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-6 text-center text-xs">{fontSize}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setFontSize((f) => Math.min(22, f + 1))}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="min-h-0 flex-1">
        <Editor
          height="100%"
          language={monacoLang}
          value={value}
          onChange={(v) => onChange(v ?? '')}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          onMount={handleMount}
          options={{
            minimap: { enabled: false },
            fontSize,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            readOnly,
            tabSize: 2,
            wordWrap: 'on',
            formatOnPaste: true,
            formatOnType: true,
          }}
        />
      </div>
    </div>
  );
}
