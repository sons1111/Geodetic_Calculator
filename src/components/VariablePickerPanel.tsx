import { Database, X } from 'lucide-react';
import type { VariableMap } from '../types/calculator';

interface VariablePickerPanelProps {
  variables: VariableMap;
  onSelectVariable: (name: string) => void;
  onAddVariable: () => void;
  onClose: () => void;
}

export function VariablePickerPanel({
  variables,
  onSelectVariable,
  onAddVariable,
  onClose,
}: VariablePickerPanelProps) {
  const entries = Object.entries(variables);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="variable-picker-title"
    >
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border-2 border-slate-700 bg-slate-900 text-slate-100 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <h2 id="variable-picker-title" className="flex items-center gap-2 text-lg font-bold text-emerald-400">
            <Database className="h-5 w-5" /> 변수 선택 ({entries.length}개)
          </h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white" aria-label="변수 선택 닫기">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="overflow-y-auto p-4">
          {entries.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <p className="text-sm text-slate-400">선택할 변수가 없습니다. 먼저 변수를 추가해 주세요.</p>
              <button
                type="button"
                onClick={onAddVariable}
                className="min-h-12 rounded-xl bg-emerald-600 px-5 font-bold text-slate-950"
              >
                변수 추가
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {entries.map(([name, item]) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => onSelectVariable(name)}
                  className="flex min-h-20 min-w-0 flex-col items-start justify-center gap-1 rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-3 text-left transition-colors hover:border-emerald-500 hover:bg-emerald-500/10 active:scale-[0.99]"
                  aria-label={`수식에 ${name}, 값 ${item.value.toString()} 삽입`}
                >
                  <span className="max-w-full truncate font-mono text-base font-bold text-emerald-300">{name}</span>
                  <span className="max-w-full break-all font-mono text-sm text-slate-300">{item.value.toString()}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
