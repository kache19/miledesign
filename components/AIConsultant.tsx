import { useState, useRef, FormEvent, ChangeEvent, Dispatch, SetStateAction, RefObject } from 'react';
import { ChatMessage } from '../types';

interface AIConsultantProps {
  messages: ChatMessage[];
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  input: string;
  setInput: (input: string) => void;
  handleSend: () => void;
  scrollRef: RefObject<HTMLDivElement>;
}

export default function AIConsultant({
  messages,
  isLoading,
  input,
  setInput,
  handleSend,
  scrollRef,
}: AIConsultantProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    handleSend();
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInput(e.target.value);
  };

  return (
    <div className="flex flex-col h-[500px] md:h-[600px] bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-800 shadow-2xl">
      <div className="px-5 py-4 md:px-6 md:py-5 bg-slate-800/50 border-b border-slate-700 flex items-center space-x-3">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-amber-500 flex items-center justify-center text-white text-xl shadow-lg ring-4 ring-amber-500/10">
          🤖
        </div>
        <div>
          <h3 className="text-white font-bold text-sm md:text-base tracking-tight">MILEDESIGN CONSTRUCTION AND PROJECT MANAGEMENT AI Architect</h3>
          <p className="text-[10px] md:text-xs text-slate-400 font-medium">Online • Designing with Gemini</p>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-slate-800/50 to-slate-950"
      >
        {messages.map((msg: ChatMessage, i: number) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] md:max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-amber-600 text-white rounded-tr-none' 
                : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 text-slate-400 rounded-2xl rounded-tl-none px-4 py-3 text-sm flex space-x-1 border border-slate-700">
              <span className="animate-bounce">.</span>
              <span className="animate-bounce delay-100">.</span>
              <span className="animate-bounce delay-200">.</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4 bg-slate-800/50 border-t border-slate-700">
        <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
          <input 
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask anything..."
            className="w-full bg-slate-900 border border-slate-700 text-white rounded-2xl py-3 pl-4 sm:pl-5 pr-12 sm:pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all placeholder:text-slate-600"
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-1.5 p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:bg-slate-700 shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
        <p className="mt-3 text-[9px] text-center text-slate-500 uppercase tracking-widest font-bold">24/7 Expert Architecture Consultant</p>
      </div>
    </div>
  );
}
