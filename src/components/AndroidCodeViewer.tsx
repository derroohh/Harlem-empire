import React, { useState } from 'react';
import { androidJavaFiles, type CodeFile } from '../androidCodeData';
import { 
  FileCode, Copy, Check, Info, Download, 
  Terminal, Globe, Shield, Smartphone 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AndroidCodeViewer: React.FC = () => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const activeFile = androidJavaFiles[selectedFileIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = (file: CodeFile) => {
    const element = document.createElement("a");
    const docFile = new Blob([file.content], {type: 'text/plain'});
    element.href = URL.createObjectURL(docFile);
    element.download = file.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Helper to colorize basic keywords of Java/XML/Gradle
  const formatCodeSyntax = (code: string, lang: string) => {
    const lines = code.split('\n');
    return lines.map((line, idx) => {
      // Basic aesthetic regex highlight markers
      let highlighted = line
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      if (lang === 'java') {
        highlighted = highlighted
          .replace(/\b(package|import|public|class|extends|implements|private|static|final|void|int|boolean|new|return|if|else|switch|case|break|try|catch|@Override|@NonNull|@Nullable)\b/g, '<span class="text-indigo-600 font-bold">$1</span>')
          .replace(/(".*?")/g, '<span class="text-emerald-600">$1</span>')
          .replace(/(\/\/.*)/g, '<span class="text-neutral-400 italic font-medium">$1</span>')
          .replace(/(\/\*\*[\s\S]*?\*\/)/g, '<span class="text-neutral-400 italic">$1</span>');
      } else if (lang === 'xml') {
        highlighted = highlighted
          .replace(/(&lt;\/?[a-zA-Z0-9.:\-_]+)/g, '<span class="text-indigo-600 font-semibold">$1</span>')
          .replace(/(\??&gt;)/g, '<span class="text-indigo-600 font-semibold">$1</span>')
          .replace(/\b([a-zA-Z0-9.:\-_]+)=/g, '<span class="text-amber-600 font-medium">$1</span>=')
          .replace(/(".*?")/g, '<span class="text-emerald-600">$1</span>')
          .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="text-neutral-400 italic">$1</span>');
      } else if (lang === 'gradle') {
        highlighted = highlighted
          .replace(/\b(apply|plugin|android|defaultConfig|buildTypes|release|dependencies|implementation)\b/g, '<span class="text-indigo-600 font-bold">$1</span>')
          .replace(/(".*?"|'.*?')/g, '<span class="text-emerald-600">$1</span>')
          .replace(/(\/\/.*)/g, '<span class="text-neutral-400 italic font-medium">$1</span>');
      }

      return (
        <div key={idx} className="table-row hover:bg-neutral-50/50">
          <span className="table-cell pr-4 text-right text-neutral-300 font-mono text-[10px] select-none border-r border-neutral-100 w-10">
            {idx + 1}
          </span>
          <span 
            className="table-cell pl-4 font-mono text-xs whitespace-pre text-neutral-700"
            dangerouslySetInnerHTML={{ __html: highlighted || ' ' }}
          />
        </div>
      );
    });
  };

  return (
    <div id="android-code-converter-section" className="w-full max-w-3xl mx-auto p-1">
      {/* Tab bar header listing files */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 gap-4">
        <div>
          <span className="text-[10px] text-neutral-400 font-black uppercase tracking-widest flex items-center space-x-1">
            <Smartphone size={12} className="text-indigo-500 animate-[bounce_1.5s_infinite]" />
            <span>Support v4 Compatibility</span>
          </span>
          <h2 className="text-xl font-black text-neutral-800 tracking-tight">
            Java Converting Sandbox
          </h2>
        </div>

        {/* Action controllers */}
        <div className="flex items-center space-x-2">
          <button
            id="btn-copy-active-code"
            onClick={handleCopy}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-800 font-bold text-xs rounded-xl transition-all select-none"
          >
            {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'Copy Source'}</span>
          </button>
          <button
            id="btn-download-active-code"
            onClick={() => downloadFile(activeFile)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-neutral-800 font-bold text-xs rounded-xl transition-all select-none"
            title="Download File"
          >
            <Download size={13} />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Grid containing selector rail and active text body */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Selector rail cards */}
        <div className="lg:col-span-1 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none shrink-0 select-none">
          {androidJavaFiles.map((file, idx) => {
            const isSelected = selectedFileIndex === idx;
            return (
              <button
                id={`btn-select-file-${file.name.replace('.', '-')}`}
                key={file.name}
                onClick={() => {
                  setSelectedFileIndex(idx);
                  setCopied(false);
                }}
                className={`flex flex-col text-left p-3 rounded-2xl border transition-all cursor-pointer min-w-[130px] lg:min-w-0 ${
                  isSelected 
                    ? 'bg-white border-indigo-200 shadow-md ring-2 ring-indigo-100/50' 
                    : 'bg-white/50 border-neutral-200/50 hover:bg-white hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FileCode size={14} className={isSelected ? 'text-indigo-600' : 'text-neutral-400'} />
                  <span className={`text-[11px] font-bold truncate ${isSelected ? 'text-indigo-900' : 'text-neutral-600'}`}>
                    {file.name}
                  </span>
                </div>
                <span className="text-[9px] text-neutral-400 font-semibold block mt-1 capitalize self-start bg-neutral-100 px-1.5 py-0.5 rounded">
                  {file.language}
                </span>
              </button>
            );
          })}
        </div>

        {/* Code viewing screen with lines and properties */}
        <div className="lg:col-span-3 flex flex-col h-[520px] bg-white rounded-3xl border border-neutral-100 shadow-[0_12px_40px_rgba(0,0,0,0.03)] overflow-hidden">
          {/* Header metadata bar */}
          <div className="bg-neutral-50 px-4 py-3 border-b border-neutral-100/80 flex items-center space-x-3.5 shrink-0">
            <Info size={14} className="text-indigo-500 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Target Virtual Path:</span>
              <p className="text-[10px] font-mono text-neutral-500 truncate mt-0.5">{activeFile.path}</p>
            </div>
          </div>

          <div className="px-4 py-2 bg-indigo-50/20 shrink-0 text-[10px] font-medium text-neutral-500 italic leading-relaxed border-b border-indigo-50/30">
            {activeFile.description}
          </div>

          {/* Code panel displaying highlighted code lines in clean table format */}
          <div className="flex-1 overflow-auto p-4 bg-white select-text">
            <div className="table w-full border-collapse">
              {formatCodeSyntax(activeFile.content, activeFile.language)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
