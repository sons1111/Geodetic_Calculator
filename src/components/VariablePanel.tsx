import { useState, type FormEvent } from 'react';
import Decimal from 'decimal.js';
import { ChevronDown, Edit3, Plus, Trash2, X } from 'lucide-react';
import type { VariableMap } from '../types/calculator';

interface VariablePanelProps {
  variables: VariableMap;
  onSaveVariable: (name: string, value: string) => void;
  onDeleteVariable: (name: string) => void;
  onClose: () => void;
}

export function VariablePanel({
  variables,
  onSaveVariable,
  onDeleteVariable,
  onClose,
}: VariablePanelProps) {
  const [varName, setVarName] = useState('');
  const [varValue, setVarValue] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [expandedVars, setExpandedVars] = useState<Record<string, boolean>>({});

  const toggleExpand = (name: string) => {
    setExpandedVars((current) => ({
      ...current,
      [name]: !current[name],
    }));
  };

  const handleSave = (event: FormEvent) => {
    event.preventDefault();
    const trimmedName = varName.trim();

    if (!/^[가-힣a-zA-Z_][가-힣a-zA-Z0-9_]*$/.test(trimmedName)) {
      setErrorMsg('변수명은 한글, 영문, 숫자, 밑줄(_) 조합이어야 하며 숫자로 시작할 수 없습니다.');
      return;
    }
    if (trimmedName.length > 50) {
      setErrorMsg('변수명은 최대 50자까지만 사용할 수 있습니다.');
      return;
    }
    if (['__proto__', 'prototype', 'constructor', 'sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'PI', 'e'].includes(trimmedName)) {
      setErrorMsg('내장 함수명이나 JavaScript 예약 키는 변수명으로 사용할 수 없습니다.');
      return;
    }

    try {
      const decimalValue = new Decimal(varValue);
      if (!decimalValue.isFinite()) throw new Error('Non-finite value');
      onSaveVariable(trimmedName, varValue);
      setVarName('');
      setVarValue('');
      setErrorMsg(null);
    } catch {
      setErrorMsg('유효한 숫자 값을 입력해주세요.');
    }
  };

  const variableEntries = Object.entries(variables);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="variable-panel-title"
    >
      <div className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border-2 border-slate-700 bg-slate-900 text-slate-100 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/50 px-6 py-4">
          <h3 id="variable-panel-title" className="flex items-center gap-2 text-lg font-bold text-emerald-400">
            <Edit3 className="h-5 w-5" /> 변수 메모리 관리
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            aria-label="변수 패널 닫기"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex max-h-[70vh] flex-col gap-6 overflow-y-auto p-6">
          <form onSubmit={handleSave} className="flex flex-col gap-3 rounded-xl border border-slate-700/60 bg-slate-800/60 p-4">
            <span className="text-xs font-semibold text-slate-400">새 변수 할당 / 값 수정 (한글/영문 단어 지원)</span>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={50}
                value={varName}
                onChange={(event) => setVarName(event.target.value)}
                className="w-36 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-center text-sm font-bold text-emerald-400 focus:border-emerald-500 focus:outline-none"
                placeholder="변수명 (예: 거리)"
                aria-label="변수명"
              />
              <input
                type="text"
                inputMode="decimal"
                value={varValue}
                onChange={(event) => setVarValue(event.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-white focus:border-emerald-500 focus:outline-none"
                placeholder="값 입력 (예: 123.456)"
                aria-label="변수 값"
              />
              <button
                type="submit"
                className="flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 font-bold text-slate-950 transition-colors hover:bg-emerald-500"
                aria-label="변수 저장"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            {errorMsg && <span className="text-xs text-rose-400" role="alert">{errorMsg}</span>}
          </form>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-400">저장된 변수 목록 ({variableEntries.length}개)</span>
            <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/40">
              {variableEntries.length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-500">
                  저장된 변수가 없습니다. 변수를 추가해 수식에 활용해보세요.
                </div>
              ) : (
                <div className="divide-y divide-slate-800/80">
                  {variableEntries.map(([name, item]) => {
                    const isExpanded = !!expandedVars[name];
                    return (
                      <div key={name} className="flex flex-col gap-2 px-4 py-3 transition-colors hover:bg-slate-900/60">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex min-w-0 flex-1 items-center gap-3">
                            <span
                              className={`rounded-lg bg-emerald-500/10 px-3 py-1 font-mono text-sm font-bold text-emerald-400 ${
                                isExpanded
                                  ? 'min-w-0 break-all whitespace-normal'
                                  : 'max-w-[120px] truncate whitespace-nowrap'
                              }`}
                              title={name}
                            >
                              {name}
                            </span>
                            <span
                              className={`font-mono text-sm tracking-wide text-slate-200 sm:text-base ${
                                isExpanded
                                  ? 'min-w-0 break-all whitespace-normal'
                                  : 'max-w-[150px] truncate whitespace-nowrap'
                              }`}
                            >
                              {item.value.toString()}
                            </span>
                          </div>
                          <div className="flex shrink-0 items-center gap-1">
                            <button
                              type="button"
                              onClick={() => toggleExpand(name)}
                              className="flex items-center rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-emerald-400"
                              title={isExpanded ? `${name} 접기` : `${name} 전체 보기`}
                              aria-label={isExpanded ? `${name} 접기` : `${name} 전체 보기`}
                              aria-expanded={isExpanded}
                            >
                              <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteVariable(name)}
                              className="shrink-0 rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-800 hover:text-rose-400"
                              title={`${name} 변수 삭제`}
                              aria-label={`${name} 변수 삭제`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-800 bg-slate-900/50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-5 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-700"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
