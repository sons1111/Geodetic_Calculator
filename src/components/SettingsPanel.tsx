import { Compass, Settings, Sliders, X } from 'lucide-react';
import type { AngleUnit } from '../types/calculator';

interface SettingsPanelProps {
  angleUnit: AngleUnit;
  onAngleUnitChange: (unit: AngleUnit) => void;
  decimalPlaces: number;
  onDecimalPlacesChange: (places: number) => void;
  onClose: () => void;
}

export function SettingsPanel({
  angleUnit,
  onAngleUnitChange,
  decimalPlaces,
  onDecimalPlacesChange,
  onClose,
}: SettingsPanelProps) {
  const angleUnits: AngleUnit[] = ['DEG', 'RAD', 'GRAD'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-panel-title"
    >
      <div className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border-2 border-slate-700 bg-slate-900 text-slate-100 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/50 px-6 py-4">
          <h3 id="settings-panel-title" className="flex items-center gap-2 text-lg font-bold text-emerald-400">
            <Settings className="h-5 w-5" /> 환경 설정
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            aria-label="환경 설정 닫기"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex max-h-[70vh] flex-col gap-6 overflow-y-auto p-6">
          <div className="flex flex-col gap-3 rounded-xl border border-slate-700/60 bg-slate-800/60 p-4">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <Compass className="h-4 w-4 text-emerald-400" /> 기본 각도 단위
            </span>
            <div className="grid grid-cols-3 gap-2">
              {angleUnits.map((unit) => (
                <button
                  key={unit}
                  type="button"
                  onClick={() => onAngleUnitChange(unit)}
                  aria-pressed={angleUnit === unit}
                  className={`rounded-lg py-2.5 text-sm font-bold transition-all ${
                    angleUnit === unit
                      ? 'bg-emerald-600 text-slate-950 shadow-md shadow-emerald-900/40'
                      : 'border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-slate-700/60 bg-slate-800/60 p-4">
            <label htmlFor="decimal-places" className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <Sliders className="h-4 w-4 text-emerald-400" /> 결과 소수점 자릿수
            </label>
            <div className="flex items-center gap-4">
              <input
                id="decimal-places"
                type="range"
                min="0"
                max="8"
                step="1"
                value={decimalPlaces}
                onChange={(event) => onDecimalPlacesChange(Number(event.target.value))}
                className="flex-1 cursor-pointer accent-emerald-500"
              />
              <span className="w-12 rounded-lg border border-slate-700 bg-slate-900 py-1 text-center font-mono font-bold text-emerald-400">
                {decimalPlaces}자
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              현장 측량 정밀도에 맞춰 출력 결과의 소수점 표기 자릿수를 조절합니다.
            </span>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-800 bg-slate-900/50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-emerald-600 px-5 py-2 text-sm font-bold text-slate-950 transition-colors hover:bg-emerald-500"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
