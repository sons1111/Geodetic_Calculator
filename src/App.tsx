import Decimal from 'decimal.js'
import { Compass, Database, History, Settings } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Display } from './components/Display'
import { GeodesyPanel } from './components/GeodesyPanel'
import { Keypad } from './components/Keypad'
import { VariablePickerPanel } from './components/VariablePickerPanel'
import { VariablePanel } from './components/VariablePanel'
import { HistoryPanel } from './components/HistoryPanel'
import { SettingsPanel } from './components/SettingsPanel'
import type { AngleUnit, CalculatorButton, CalculationHistory, VariableMap } from './types/calculator'
import { loadHistory, loadSettings, loadVariables, saveHistory, saveSettings, saveVariables } from './utils/storage'
import { formatFixedResult } from './utils/formatters'

export default function App() {
  const [formula, setFormula] = useState('A + sin(45)')
  const [formulaSelection, setFormulaSelection] = useState({ start: 'A + sin(45)'.length, end: 'A + sin(45)'.length })
  const [isShiftActive, setIsShiftActive] = useState(false)
  const [isAlphaActive, setIsAlphaActive] = useState(false)
  const [isVariablePanelOpen, setIsVariablePanelOpen] = useState(false)
  const [isVariablePickerOpen, setIsVariablePickerOpen] = useState(false)
  const [isGeodesyPanelOpen, setIsGeodesyPanelOpen] = useState(false)
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false)
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false)
  const [initialSettings] = useState(() => loadSettings())
  const [angleUnit, setAngleUnit] = useState<AngleUnit>(initialSettings.angleUnit)
  const [decimalPlaces, setDecimalPlaces] = useState(initialSettings.decimalPlaces)
  const [result, setResult] = useState('123.456789')
  const [error, setError] = useState<string | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const calculationWorkerRef = useRef<Worker | null>(null)
  const calculationTimeoutRef = useRef<number | null>(null)
  const [variables, setVariables] = useState<VariableMap>(() => loadVariables())
  const [history, setHistory] = useState<CalculationHistory[]>(() => loadHistory())

  useEffect(() => () => {
    calculationWorkerRef.current?.terminate()
    if (calculationTimeoutRef.current !== null) {
      window.clearTimeout(calculationTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (!saveVariables(variables)) {
      setError('변수를 기기에 저장하지 못했습니다. 저장 공간이나 개인정보 보호 설정을 확인해 주세요.')
    }
  }, [variables])

  useEffect(() => {
    if (!saveHistory(history)) {
      setError('연산 기록을 기기에 저장하지 못했습니다. 앱을 다시 열어도 기록이 유지되지 않을 수 있습니다.')
    }
  }, [history])

  useEffect(() => {
    if (!saveSettings({ angleUnit, decimalPlaces, displayMode: 'FIX' })) {
      setError('환경 설정을 저장하지 못했습니다. 이 세션에서는 설정이 유지됩니다.')
    }
  }, [angleUnit, decimalPlaces])

  const insertFormulaText = (text: string) => {
    setFormula((current) => {
      const start = Math.min(formulaSelection.start, current.length)
      const end = Math.min(formulaSelection.end, current.length)
      const inserted = `${current.slice(0, start)}${text}${current.slice(end)}`
      const nextSelection = start + text.length
      setFormulaSelection({ start: nextSelection, end: nextSelection })
      return inserted.slice(0, 200)
    })
  }

  const handleButtonClick = (button: CalculatorButton) => {
    if (button.actionValue === 'SHIFT') {
      setIsShiftActive((active) => !active)
    } else if (button.actionValue === 'ALPHA') {
      setIsAlphaActive((active) => !active)
    } else if (button.actionValue === 'AC') {
      setFormula('')
      setResult('0')
      setError(null)
    } else if (button.actionValue === 'DEL') {
      setFormula((value) => value.slice(0, -1))
      setError(null)
    } else if (button.actionValue === '=') {
      const trimmedFormula = formula.trim()
      if (!trimmedFormula) {
        setError('계산할 수식이 없습니다. 수식을 입력해 주세요.')
        return
      }
      if (trimmedFormula.length > 200) {
        setError('수식이 너무 깁니다. 200자 이하로 입력해 주세요.')
        return
      }

      if (isCalculating) return
      setIsCalculating(true)
      setError(null)

      calculationWorkerRef.current?.terminate()
      const worker = new Worker(new URL('./workers/calculator.worker.ts', import.meta.url), { type: 'module' })
      calculationWorkerRef.current = worker

      const finishCalculation = (nextError: string | null, nextResult?: string) => {
        if (calculationTimeoutRef.current !== null) {
          window.clearTimeout(calculationTimeoutRef.current)
          calculationTimeoutRef.current = null
        }
        worker.terminate()
        calculationWorkerRef.current = null
        setIsCalculating(false)

        if (nextError) {
          setError(nextError)
          return
        }

        const formattedResult = formatFixedResult(nextResult ?? '0', decimalPlaces)
        setResult(formattedResult)
        setHistory((current) => [
          ...current,
          {
            id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            formula: trimmedFormula,
            result: formattedResult,
            timestamp: Date.now(),
          },
        ].slice(-100))
      }

      worker.onmessage = (event: MessageEvent<{ ok: boolean; result?: string; message?: string }>) => {
        finishCalculation(event.data.ok ? null : event.data.message ?? '계산에 실패했습니다.', event.data.result)
      }
      worker.onerror = () => {
        finishCalculation('계산 엔진을 실행하지 못했습니다. 다시 시도해 주세요.')
      }
      calculationTimeoutRef.current = window.setTimeout(() => {
        finishCalculation('계산 시간이 3초를 초과했습니다. 수식을 간단하게 나눠 다시 시도해 주세요.')
      }, 3000)

      const serializedVariables = Object.fromEntries(
        Object.entries(variables).map(([name, item]) => [name, item.value.toString()]),
      )
      worker.postMessage({ formula: trimmedFormula, variables: serializedVariables, angleUnit })
    } else if (
      button.type === 'FUNCTION'
      && ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sqrt'].includes(button.actionValue)
    ) {
      insertFormulaText(`${button.actionValue}(`)
    } else if (button.actionValue === 'pi') {
      insertFormulaText('pi')
    } else {
      insertFormulaText(button.actionValue)
    }
  }

  const handleSaveVariable = (name: string, value: string) => {
    setVariables((current) => ({
      ...current,
      [name]: { value: new Decimal(value), rawString: value },
    }))
  }

  const handleSelectHistory = (item: CalculationHistory) => {
    setFormula(item.formula)
    setResult(item.result)
    setError(null)
    setIsHistoryPanelOpen(false)
  }

  const handleDeleteVariable = (name: string) => {
    setVariables((current) => {
      const next = { ...current }
      delete next[name]
      return next
    })
  }

  const handleCopyResult = async () => {
    if (!navigator.clipboard?.writeText) {
      setError('이 환경에서는 클립보드를 사용할 수 없습니다. 보안 연결에서 다시 시도해 주세요.')
      return
    }
    try {
      await navigator.clipboard.writeText(result)
    } catch {
      setError('결과를 클립보드에 복사하지 못했습니다. 브라우저의 클립보드 권한을 확인해 주세요.')
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 p-2 sm:p-4">
      <section className="flex w-full max-w-md flex-col gap-3">
        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={() => setIsGeodesyPanelOpen(true)}
            className="flex min-h-10 items-center justify-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 text-sm font-semibold text-emerald-300 shadow-md transition-colors hover:bg-emerald-500/20"
          >
            <Compass className="h-4 w-4" /> 측지 계산
          </button>
          <button
            type="button"
            onClick={() => setIsSettingsPanelOpen(true)}
            className="flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm font-semibold text-emerald-400 shadow-md transition-colors hover:bg-slate-800"
          >
            <Settings className="h-4 w-4" /> 설정
          </button>
          <button
            type="button"
            onClick={() => setIsHistoryPanelOpen(true)}
            className="flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm font-semibold text-emerald-400 shadow-md transition-colors hover:bg-slate-800"
          >
            <History className="h-4 w-4" /> 히스토리
          </button>
          <button
            type="button"
            onClick={() => setIsVariablePanelOpen(true)}
            className="flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm font-semibold text-emerald-400 shadow-md transition-colors hover:bg-slate-800"
          >
            <Database className="h-4 w-4" /> 변수 메모리
          </button>
        </div>
        <Display
          formula={formula}
          result={isCalculating ? '계산 중...' : result}
          angleUnit={angleUnit}
          displayMode="FIX"
          isShiftActive={isShiftActive}
          isAlphaActive={isAlphaActive}
          error={error}
          isCopyDisabled={isCalculating}
          onCopyResult={() => { void handleCopyResult() }}
          onFormulaChange={(nextFormula) => {
            setFormula(nextFormula)
            setFormulaSelection({ start: nextFormula.length, end: nextFormula.length })
          }}
          onFormulaSelectionChange={(start, end) => setFormulaSelection({ start, end })}
        />
        <Keypad
          onButtonClick={handleButtonClick}
          variables={variables}
          onOpenVariablePicker={() => setIsVariablePickerOpen(true)}
          onOpenHistoryPanel={() => setIsHistoryPanelOpen(true)}
          onOpenSettingsPanel={() => setIsSettingsPanelOpen(true)}
        />
      </section>

      {isHistoryPanelOpen && (
        <HistoryPanel
          history={history}
          onSelectHistory={handleSelectHistory}
          onClearHistory={() => setHistory([])}
          onClose={() => setIsHistoryPanelOpen(false)}
        />
      )}

      {isVariablePickerOpen && (
        <VariablePickerPanel
          variables={variables}
          onSelectVariable={(name) => {
            insertFormulaText(name)
            setIsVariablePickerOpen(false)
          }}
          onAddVariable={() => {
            setIsVariablePickerOpen(false)
            setIsVariablePanelOpen(true)
          }}
          onClose={() => setIsVariablePickerOpen(false)}
        />
      )}

      {isGeodesyPanelOpen && <GeodesyPanel onClose={() => setIsGeodesyPanelOpen(false)} />}

      {isSettingsPanelOpen && (
        <SettingsPanel
          angleUnit={angleUnit}
          onAngleUnitChange={setAngleUnit}
          decimalPlaces={decimalPlaces}
          onDecimalPlacesChange={setDecimalPlaces}
          onClose={() => setIsSettingsPanelOpen(false)}
        />
      )}

      {isVariablePanelOpen && (
        <VariablePanel
          variables={variables}
          onSaveVariable={handleSaveVariable}
          onDeleteVariable={handleDeleteVariable}
          onClose={() => setIsVariablePanelOpen(false)}
        />
      )}
    </main>
  )
}
