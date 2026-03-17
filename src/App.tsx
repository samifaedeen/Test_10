/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Delete, RotateCcw, Percent, Divide, X, Minus, Plus, Equal } from 'lucide-react';

export default function App() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [isResult, setIsResult] = useState(false);

  const handleNumber = (num: string) => {
    if (isResult) {
      setDisplay(num);
      setIsResult(false);
    } else {
      setDisplay(prev => (prev === '0' ? num : prev + num));
    }
  };

  const handleOperator = (op: string) => {
    setIsResult(false);
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const calculate = () => {
    try {
      const fullEquation = equation + display;
      // Using Function constructor instead of eval for a bit more safety in this context, 
      // though still careful with input. Since we control the buttons, it's relatively safe.
      const result = new Function(`return ${fullEquation.replace('×', '*').replace('÷', '/')}`)();
      setDisplay(String(Number(result.toFixed(8))));
      setEquation('');
      setIsResult(true);
    } catch (error) {
      setDisplay('Error');
      setEquation('');
    }
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
    setIsResult(false);
  };

  const backspace = () => {
    if (isResult) {
      clear();
    } else {
      setDisplay(prev => (prev.length > 1 ? prev.slice(0, -1) : '0'));
    }
  };

  const handlePercent = () => {
    setDisplay(prev => String(parseFloat(prev) / 100));
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(prev => prev + '.');
    }
  };

  const Button = ({ 
    children, 
    onClick, 
    className = "", 
    variant = "default" 
  }: { 
    children: ReactNode, 
    onClick: () => void, 
    className?: string,
    variant?: "default" | "operator" | "action" | "equal"
  }) => {
    const variants = {
      default: "bg-zinc-800 hover:bg-zinc-700 text-white",
      operator: "bg-orange-500 hover:bg-orange-400 text-white",
      action: "bg-zinc-700 hover:bg-zinc-600 text-zinc-300",
      equal: "bg-emerald-500 hover:bg-emerald-400 text-white"
    };

    return (
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`h-16 w-full rounded-2xl flex items-center justify-center text-xl font-medium transition-colors shadow-lg ${variants[variant]} ${className}`}
      >
        {children}
      </motion.button>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xs bg-zinc-900 rounded-[2.5rem] p-6 shadow-2xl border border-white/5"
      >
        {/* Display Area */}
        <div className="mb-8 px-2 text-right min-h-[120px] flex flex-col justify-end overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div 
              key={equation}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-zinc-500 text-sm mb-1 h-5"
            >
              {equation}
            </motion.div>
          </AnimatePresence>
          <motion.div 
            key={display}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-white text-5xl font-light tracking-tight truncate"
          >
            {display}
          </motion.div>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-3">
          <Button onClick={clear} variant="action"><RotateCcw size={20} /></Button>
          <Button onClick={backspace} variant="action"><Delete size={20} /></Button>
          <Button onClick={handlePercent} variant="action"><Percent size={20} /></Button>
          <Button onClick={() => handleOperator('/')} variant="operator"><Divide size={20} /></Button>

          <Button onClick={() => handleNumber('7')}>7</Button>
          <Button onClick={() => handleNumber('8')}>8</Button>
          <Button onClick={() => handleNumber('9')}>9</Button>
          <Button onClick={() => handleOperator('*')} variant="operator"><X size={20} /></Button>

          <Button onClick={() => handleNumber('4')}>4</Button>
          <Button onClick={() => handleNumber('5')}>5</Button>
          <Button onClick={() => handleNumber('6')}>6</Button>
          <Button onClick={() => handleOperator('-')} variant="operator"><Minus size={20} /></Button>

          <Button onClick={() => handleNumber('1')}>1</Button>
          <Button onClick={() => handleNumber('2')}>2</Button>
          <Button onClick={() => handleNumber('3')}>3</Button>
          <Button onClick={() => handleOperator('+')} variant="operator"><Plus size={20} /></Button>

          <Button onClick={() => handleNumber('0')} className="col-span-2">0</Button>
          <Button onClick={handleDecimal}>.</Button>
          <Button onClick={calculate} variant="equal"><Equal size={24} /></Button>
        </div>
      </motion.div>
    </div>
  );
}
