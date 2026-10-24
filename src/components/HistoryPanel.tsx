import { ArrowUpRight, History, Trash2, X } from 'lucide-react';
import type { CalculationHistory } from '../types/calculator';

interface HistoryPanelProps {
  history: CalculationHistory[];
  onSelectHistory: (item: CalculationHistory) => void;
  onClearHistory: () => void;
  onClose: () => void;
}

export function HistoryPanel({
  history,
  onSelectHistory,
  onClearHistory,
  onClose,
}: HistoryPanelProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-panel-title"
    >
      <div className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border-2 border-slate-700 bg-slate-900 text-slate-100 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/50 px-6 py-4">
          <h3 id="history-panel-title" className="flex items-center gap-2 text-lg font-bold text-emerald-400">
            <History className="h-5 w-5" /> 연산 히스토리
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            aria-label="히스토리 패널 닫기"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto p-6">
          {history.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500">
              저장된 연산 기록이 없습니다.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {[...history].reverse().map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-1 rounded-xl border border-slate-700/60 bg-slate-800/60 p-3 transition-colors hover:border-emerald-500/50"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{new Date(item.timestamp).toLocaleString()}</span>
                    <button
                      type="button"
                      onClick={() => onSelectHistory(item)}
                      className="flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-400 transition-colors hover:text-emerald-300"
                    >
                      가져오기 <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="overflow-x-auto whitespace-nowrap font-mono text-sm text-slate-300">
                    {item.formula}
                  </div>
                  <div className="text-right font-mono text-lg font-bold text-emerald-400">
                    = {item.result}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-900/50 px-6 py-4">
          {history.length > 0 && (
            <button
              type="button"
              onClick={onClearHistory}
              className="flex items-center gap-1.5 rounded-xl border border-rose-800/50 bg-rose-900/40 px-4 py-2 text-xs font-semibold text-rose-300 transition-colors hover:bg-rose-900/60"
            >
              <Trash2 className="h-4 w-4" /> 전체 기록 삭제
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-xl bg-slate-800 px-5 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-700"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
