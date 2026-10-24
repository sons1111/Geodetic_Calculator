import { useState } from 'react';
import { X } from 'lucide-react';
import { calculateForward, calculateInverse } from '../utils/geodesyCalculations';

type GeodesyMode = 'inverse' | 'forward';

interface GeodesyPanelProps {
  onClose: () => void;
}

const inputClassName = 'min-h-12 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 font-mono text-base text-white outline-none focus:border-emerald-500';

export function GeodesyPanel({ onClose }: GeodesyPanelProps) {
  const [mode, setMode] = useState<GeodesyMode>('inverse');
  const [values, setValues] = useState({ x1: '', y1: '', x2: '', y2: '', distance: '', azimuth: '' });
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateValue = (field: keyof typeof values, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setResult(null);
    setError(null);
  };

  const calculate = () => {
    const fields = mode === 'inverse'
      ? ['x1', 'y1', 'x2', 'y2'] as const
      : ['x1', 'y1', 'distance', 'azimuth'] as const;
    const parsed = Object.fromEntries(fields.map((field) => [field, Number(values[field])]));
    if (fields.some((field) => values[field].trim() === '' || !Number.isFinite(parsed[field]))) {
      setError('모든 입력란에 유효한 숫자를 입력해 주세요.');
      setResult(null);
      return;
    }
    if (mode === 'forward' && parsed.distance < 0) {
      setError('거리는 0 이상으로 입력해 주세요.');
      setResult(null);
      return;
    }

    try {
      const fixed = (value: number) => value.toFixed(4);
      if (mode === 'inverse') {
        const inverse = calculateInverse(
          { x: parsed.x1, y: parsed.y1 },
          { x: parsed.x2, y: parsed.y2 },
        );
        setResult(`거리: ${fixed(inverse.distance)}\n각도 (X축 기준): ${fixed(inverse.azimuthDegrees)}°`);
      } else {
        const forward = calculateForward(
          { x: parsed.x1, y: parsed.y1 },
          parsed.distance,
          parsed.azimuth,
        );
        setResult(`X: ${fixed(forward.x)}\nY: ${fixed(forward.y)}`);
      }
      setError(null);
    } catch (calculationError) {
      setResult(null);
      setError(calculationError instanceof Error ? calculationError.message : '측지 계산에 실패했습니다.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="geodesy-panel-title"
    >
      <div className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border-2 border-slate-700 bg-slate-900 text-slate-100 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <h2 id="geodesy-panel-title" className="text-lg font-bold text-emerald-400">측지 계산</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white" aria-label="측지 계산 닫기">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto p-5">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => { setMode('inverse'); setResult(null); setError(null); }}
              aria-pressed={mode === 'inverse'}
              className={`min-h-12 rounded-lg font-bold ${mode === 'inverse' ? 'bg-emerald-600 text-slate-950' : 'bg-slate-800 text-slate-300'}`}
            >
              역산 (두 점 → 거리/방위각)
            </button>
            <button
              type="button"
              onClick={() => { setMode('forward'); setResult(null); setError(null); }}
              aria-pressed={mode === 'forward'}
              className={`min-h-12 rounded-lg font-bold ${mode === 'forward' ? 'bg-emerald-600 text-slate-950' : 'bg-slate-800 text-slate-300'}`}
            >
              전산 (점/거리/방위각 → 좌표)
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-sm text-slate-400">
              {mode === 'inverse' ? '시점 X' : '기준점 X'}
              <input className={inputClassName} type="number" inputMode="decimal" value={values.x1} onChange={(event) => updateValue('x1', event.target.value)} />
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-400">
              {mode === 'inverse' ? '시점 Y' : '기준점 Y'}
              <input className={inputClassName} type="number" inputMode="decimal" value={values.y1} onChange={(event) => updateValue('y1', event.target.value)} />
            </label>
            {mode === 'inverse' ? (
              <>
                <label className="flex flex-col gap-1 text-sm text-slate-400">
                  종점 X
                  <input className={inputClassName} type="number" inputMode="decimal" value={values.x2} onChange={(event) => updateValue('x2', event.target.value)} />
                </label>
                <label className="flex flex-col gap-1 text-sm text-slate-400">
                  종점 Y
                  <input className={inputClassName} type="number" inputMode="decimal" value={values.y2} onChange={(event) => updateValue('y2', event.target.value)} />
                </label>
              </>
            ) : (
              <>
                <label className="flex flex-col gap-1 text-sm text-slate-400">
                  거리
                  <input className={inputClassName} type="number" min="0" inputMode="decimal" value={values.distance} onChange={(event) => updateValue('distance', event.target.value)} />
                </label>
                <label className="flex flex-col gap-1 text-sm text-slate-400">
                  각도 (X축 기준, 도)
                  <input className={inputClassName} type="number" inputMode="decimal" value={values.azimuth} onChange={(event) => updateValue('azimuth', event.target.value)} />
                </label>
              </>
            )}
          </div>

          <button type="button" onClick={calculate} className="min-h-12 rounded-xl bg-emerald-600 font-bold text-slate-950 transition-colors hover:bg-emerald-500">
            {mode === 'inverse' ? '역산 계산' : '전산 계산'}
          </button>
          {error && <p role="alert" className="text-sm text-rose-400">{error}</p>}
          {result && <pre aria-live="polite" className="whitespace-pre-wrap rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-right font-mono text-lg font-bold text-emerald-300">{result}</pre>}
        </div>
      </div>
    </div>
  );
}
