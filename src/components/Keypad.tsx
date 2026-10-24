import type { CalculatorButton, VariableMap } from '../types/calculator';

interface KeypadProps {
  onButtonClick: (button: CalculatorButton) => void;
  variables: VariableMap;
  onOpenVariablePicker: () => void;
  onOpenHistoryPanel: () => void;
  onOpenSettingsPanel: () => void;
}

const utilityButtons: CalculatorButton[] = [
  { id: 'history', label: 'HIST', type: 'CONTROL', actionValue: 'OPEN_HISTORY' },
  { id: 'settings', label: 'SET', type: 'CONTROL', actionValue: 'OPEN_SETTINGS' },
  { id: 'sin', label: 'sin', type: 'FUNCTION', actionValue: 'sin' },
  { id: 'cos', label: 'cos', type: 'FUNCTION', actionValue: 'cos' },
  { id: 'tan', label: 'tan', type: 'FUNCTION', actionValue: 'tan' },
  { id: 'asin', label: 'asin', type: 'FUNCTION', actionValue: 'asin' },
  { id: 'acos', label: 'acos', type: 'FUNCTION', actionValue: 'acos' },
  { id: 'atan', label: 'atan', type: 'FUNCTION', actionValue: 'atan' },
  { id: 'degree', label: '°', type: 'OPERATOR', actionValue: '°' },
  { id: 'minute', label: "'", type: 'OPERATOR', actionValue: "'" },
  { id: 'second', label: '"', type: 'OPERATOR', actionValue: '"' },
  { id: 'lparen', label: '(', type: 'OPERATOR', actionValue: '(' },
  { id: 'rparen', label: ')', type: 'OPERATOR', actionValue: ')' },
];

const calculatorRows: CalculatorButton[][] = [
  [
    { id: 'ac', label: 'AC', type: 'CONTROL', actionValue: 'AC' },
    { id: 'del', label: 'DEL', type: 'CONTROL', actionValue: 'DEL' },
    { id: 'sqrt', label: 'sqrt', type: 'FUNCTION', actionValue: 'sqrt' },
    { id: 'pow', label: 'x^y', type: 'FUNCTION', actionValue: '^' },
    { id: 'divide', label: '÷', type: 'OPERATOR', actionValue: '/' },
  ],
  [
    { id: '7', label: '7', type: 'NUMBER', actionValue: '7' },
    { id: '8', label: '8', type: 'NUMBER', actionValue: '8' },
    { id: '9', label: '9', type: 'NUMBER', actionValue: '9' },
    { id: 'pi', label: 'π', type: 'FUNCTION', actionValue: 'pi' },
    { id: 'multiply', label: '×', type: 'OPERATOR', actionValue: '*' },
  ],
  [
    { id: '4', label: '4', type: 'NUMBER', actionValue: '4' },
    { id: '5', label: '5', type: 'NUMBER', actionValue: '5' },
    { id: '6', label: '6', type: 'NUMBER', actionValue: '6' },
    { id: 'ans', label: 'Ans', type: 'FUNCTION', actionValue: 'Ans' },
    { id: 'subtract', label: '-', type: 'OPERATOR', actionValue: '-' },
  ],
  [
    { id: '1', label: '1', type: 'NUMBER', actionValue: '1' },
    { id: '2', label: '2', type: 'NUMBER', actionValue: '2' },
    { id: '3', label: '3', type: 'NUMBER', actionValue: '3' },
    { id: 'dot', label: '.', type: 'NUMBER', actionValue: '.' },
    { id: 'add', label: '+', type: 'OPERATOR', actionValue: '+' },
  ],
  [
    { id: 'variable', label: 'VARS', type: 'CONTROL', actionValue: 'OPEN_VARIABLES' },
    { id: '0', label: '0', type: 'NUMBER', actionValue: '0' },
    { id: 'equals', label: '=', type: 'CONTROL', actionValue: '=' },
  ],
];

const baseButtonClass = 'flex min-h-11 items-center justify-center rounded-lg px-1 py-2.5 text-sm font-bold shadow-md transition-colors active:scale-95 touch-manipulation';

export function Keypad({
  onButtonClick,
  variables,
  onOpenVariablePicker,
  onOpenHistoryPanel,
  onOpenSettingsPanel,
}: KeypadProps) {
  const variableNames = Object.keys(variables);

  const renderButton = (button: CalculatorButton, key: string) => (
    <button
      key={key}
      type="button"
      onClick={() => {
        if (button.actionValue === 'OPEN_HISTORY') onOpenHistoryPanel();
        else if (button.actionValue === 'OPEN_SETTINGS') onOpenSettingsPanel();
        else if (button.actionValue === 'OPEN_VARIABLES') onOpenVariablePicker();
        else onButtonClick(button);
      }}
      className={`${baseButtonClass} ${
        button.actionValue === 'AC'
          ? 'bg-rose-800 text-white'
          : button.actionValue === '='
            ? 'col-span-3 bg-emerald-600 text-xl text-slate-950'
            : button.type === 'FUNCTION' || button.type === 'VARIABLE'
              ? 'bg-slate-800 text-emerald-400'
              : button.type === 'OPERATOR'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-700 text-slate-100'
      }`}
      aria-label={button.label}
    >
      {button.label}
    </button>
  );

  return (
    <div className="flex w-full flex-col gap-2 rounded-xl border border-slate-800 bg-slate-900/95 p-2 shadow-2xl select-none sm:p-3">
      <button
        type="button"
        onClick={onOpenVariablePicker}
        className="flex min-h-11 w-full items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 text-sm font-bold text-emerald-300 transition-colors hover:bg-emerald-500/20"
        aria-label={`변수 선택, ${variableNames.length}개`}
      >
        <span>변수 선택</span>
        <span className="rounded-full bg-slate-950/50 px-2.5 py-1 text-xs">{variableNames.length}개</span>
      </button>

      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {utilityButtons.map((button) => renderButton(button, `utility-${button.id}`))}
        {calculatorRows.map((row, rowIndex) => row.map((button) => renderButton(button, `row-${rowIndex}-${button.id}`)))}
      </div>
    </div>
  );
}
