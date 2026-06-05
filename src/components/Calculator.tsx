import React, { useState } from 'react';
import { Sparkles, Sliders } from 'lucide-react';
import { motion } from 'motion/react';

export const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('');
  const [equation, setEquation] = useState('');

  const handleNum = (num: string) => {
    setDisplay(prev => {
      if (prev === '0' || prev === 'Error') return num;
      return prev + num;
    });
    setEquation(prev => prev + num);
  };

  const handleOp = (op: string) => {
    setDisplay('');
    setEquation(prev => {
      if (!prev) return '';
      // Prevent consecutive operators
      const lastChar = prev.slice(-1);
      if (['+', '-', '*', '/'].includes(lastChar)) {
        return prev.slice(0, -1) + op;
      }
      return prev + op;
    });
  };

  const calculate = () => {
    if (!equation) return;
    try {
      // Safe evaluation of basic math expressions
      const sanitized = equation.replace(/[^0-9+\-*/.]/g, '');
      const result = new Function(`return ${sanitized}`)();
      
      if (result === undefined || isNaN(result)) {
        setDisplay('Error');
        setEquation('');
      } else {
        const formatted = Number(result.toFixed(6)).toString(); // avoid long decimal tails
        setDisplay(formatted);
        setEquation(formatted);
      }
    } catch (e) {
      setDisplay('Error');
      setEquation('');
    }
  };

  const clear = () => {
    setDisplay('');
    setEquation('');
  };

  const deleteLast = () => {
    setDisplay(prev => prev.slice(0, -1));
    setEquation(prev => prev.slice(0, -1));
  };

  const buttons = [
    { label: 'C', onClick: clear, type: 'clear' },
    { label: 'DEL', onClick: deleteLast, type: 'del' },
    { label: '%', onClick: () => handleOp('%'), type: 'op' }, // we can use simple remainder or op
    { label: '/', onClick: () => handleOp('/'), type: 'op' },
    { label: '7', onClick: () => handleNum('7'), type: 'num' },
    { label: '8', onClick: () => handleNum('8'), type: 'num' },
    { label: '9', onClick: () => handleNum('9'), type: 'num' },
    { label: '*', onClick: () => handleOp('*'), type: 'op' },
    { label: '4', onClick: () => handleNum('4'), type: 'num' },
    { label: '5', onClick: () => handleNum('5'), type: 'num' },
    { label: '6', onClick: () => handleNum('6'), type: 'num' },
    { label: '-', onClick: () => handleOp('-'), type: 'op' },
    { label: '1', onClick: () => handleNum('1'), type: 'num' },
    { label: '2', onClick: () => handleNum('2'), type: 'num' },
    { label: '3', onClick: () => handleNum('3'), type: 'num' },
    { label: '+', onClick: () => handleOp('+'), type: 'op' },
    { label: '0', onClick: () => handleNum('0'), type: 'num' },
    { label: '.', onClick: () => handleNum('.'), type: 'num' },
    { label: '=', onClick: calculate, type: 'equals' },
  ];

  const getBtnStyles = (type: string) => {
    switch (type) {
      case 'clear':
        return 'bg-rose-100 hover:bg-rose-200 text-rose-700 font-extrabold';
      case 'del':
        return 'bg-amber-100 hover:bg-amber-200 text-amber-700 font-extrabold';
      case 'op':
        return 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-base';
      case 'equals':
        return 'bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg col-span-2 rounded-2xl';
      default:
        return 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-sm';
    }
  };

  return (
    <div id="calculator-section" className="w-full max-w-md mx-auto p-2">
      <div className="flex items-center space-x-2 mb-4">
        <Sliders className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-bold text-neutral-800 tracking-tight">Active Material Tools</h2>
      </div>

      <div 
        id="calculator-card-root"
        className="bg-white rounded-3xl p-6 shadow-[0_12px_44px_rgba(0,0,0,0.035)] border border-neutral-100 flex flex-col relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full filter blur-xl -mr-10 -mt-10 pointer-events-none" />

        <div className="flex justify-between items-center mb-2 z-10 shrink-0">
          <span className="text-[10px] text-neutral-400 font-bold tracking-wider uppercase flex items-center space-x-1">
            <Sparkles size={11} className="text-amber-400" />
            <span>Math Engine</span>
          </span>
          <span className="text-[10px] text-indigo-500 font-semibold bg-indigo-50 px-2.5 py-0.5 rounded-full">
            Float v3.2
          </span>
        </div>

        {/* Display Register */}
        <div className="w-full h-24 mb-4 bg-neutral-50 rounded-2xl p-4 flex flex-col justify-end items-end shadow-inner border border-neutral-100 select-all z-10">
          <div className="text-neutral-400 text-xs font-mono tracking-wider max-w-full truncate h-5">
            {equation || '0'}
          </div>
          <div id="calculator-display" className="text-neutral-800 text-2xl font-black font-mono tracking-tight max-w-full truncate">
            {display || '0'}
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-2.5 z-10">
          {buttons.map((btn, idx) => (
            <button
              id={`btn-calc-${btn.label === '*' ? 'mul' : btn.label === '/' ? 'div' : btn.label === '+' ? 'add' : btn.label === '-' ? 'sub' : btn.label}`}
              key={idx}
              onClick={btn.onClick}
              className={`p-3.5 rounded-xl transition-all active:scale-95 flex items-center justify-center font-mono cursor-pointer select-none ${getBtnStyles(btn.type)}`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
