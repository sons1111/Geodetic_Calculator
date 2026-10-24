import type { SyntheticEvent } from 'react';
import { Copy } from 'lucide-react';
import type { AngleUnit, DisplayMode } from '../types/calculator';

interface DisplayProps {
  formula: string;
  result: string;
  angleUnit: AngleUnit;
  displayMode: DisplayMode;
  isShiftActive: boolean;
  isAlphaActive: boolean;
  error?: string | null;
  isCopyDisabled?: boolean;
  onFormulaChange: (formula: string) => void;
  onFormulaSelectionChange: (selectionStart: number, selectionEnd: number) => void;
  onCopyResult: () => void;
}

export function Display({
  formula,
  result,
  angleUnit,
  displayMode,
  isShiftActive,
  isAlphaActive,
  error,
  isCopyDisabled = false,
  onFormulaChange,
  onFormulaSelectionChange,
  onCopyResult,
}: DisplayProps) {
  const syncSelection = (event: SyntheticEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    onFormulaSelectionChange(input.selectionStart ?? input.value.length, input.selectionEnd ?? input.value.length);
  };

  return (
    <div className="relative flex min-h-[140px] w-full flex-col justify-between overflow-hidden rounded-xl border-2 border-slate-700 bg-slate-900 p-4 font-mono text-emerald-400 shadow-inner select-none">
      <div className="mb-2 flex items-center justify-between border-b border-slate-800 pb-1 text-xs font-semibold tracking-wider">
        <div className="flex items-center gap-2">
          <span className={`rounded px-1.5 py-0.5 text-[10px] ${isShiftActive ? 'bg-amber-500 font-bold text-slate-950' : 'bg-slate-800/50 text-slate-600'}`}>
            SHIFT
          </span>
          <span className={`rounded px-1.5 py-0.5 text-[10px] ${isAlphaActive ? 'bg-rose-500 font-bold text-slate-950' : 'bg-slate-800/50 text-slate-600'}`}>
            ALPHA
          </span>
        </div>

        <div className="flex gap-3 text-[11px] text-emerald-500/80">
          <span className="font-bold text-emerald-400">{angleUnit}</span>
          <span className="opacity-80">{displayMode}</span>
        </div>
      </div>

      <input
        type="text"
        value={formula}
        onChange={(event) => {
          onFormulaChange(event.target.value);
          syncSelection(event);
        }}
        onSelect={syncSelection}
        onFocus={syncSelection}
        onKeyUp={syncSelection}
        onClick={syncSelection}
        maxLength={200}
        inputMode="text"
        aria-label="계산식 입력"
        placeholder="수식 입력"
        className="min-h-7 w-full bg-transparent text-right font-mono text-sm tracking-wide text-slate-300 outline-none caret-emerald-400"
      />

      <div className="mt-2 flex min-w-0 items-center justify-between gap-2">
        <div className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap text-right text-2xl font-bold tracking-wider scrollbar-none sm:text-3xl">
          {error ? (
            <span className="text-lg font-normal tracking-normal text-rose-400 animate-pulse">{error}</span>
          ) : (
            <span className="text-emerald-300">{result || '0'}</span>
          )}
        </div>
        <button
          type="button"
          onClick={onCopyResult}
          disabled={isCopyDisabled}
          className="flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 text-xs font-bold text-emerald-300 transition-colors hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="결과 복사"
          title="결과 복사"
        >
          <Copy className="h-4 w-4" /> 복사
        </button>
      </div>
    </div>
  );
}
