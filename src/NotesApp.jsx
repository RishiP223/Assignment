/*
NotesApp Groq Preview - Dark mode icon polish

What I changed:
- Added standardized icon styling helpers (`iconClass`, `accentIcon`) to make icons look cohesive and visually appealing in dark mode.
- Icons now have smooth transitions, slightly larger tap targets, and subtle color accents in dark mode to improve visibility and hierarchy.
- Important action icons (Pin, Lock, Trash) use gentle accent colors in dark mode so they remain legible but not harsh.
- Kept all functionality intact.
*/

import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Pin, Trash2, Lock, Unlock, Save, Tag, Sparkles, Check, X } from 'lucide-react';

// Encryption utilities (unchanged)
const encryptNote = async (content, password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const key = await crypto.subtle.digest('SHA-256', encoder.encode(password));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const algorithm = { name: 'AES-GCM', iv };
  const cryptoKey = await crypto.subtle.importKey('raw', key, algorithm, false, ['encrypt']);
  const encrypted = await crypto.subtle.encrypt(algorithm, cryptoKey, data);
  return {
    iv: Array.from(iv),
    data: Array.from(new Uint8Array(encrypted))
  };
};

const decryptNote = async (encryptedData, password) => {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.digest('SHA-256', encoder.encode(password));
  const iv = new Uint8Array(encryptedData.iv);
  const data = new Uint8Array(encryptedData.data);
  const algorithm = { name: 'AES-GCM', iv };
  const cryptoKey = await crypto.subtle.importKey('raw', key, algorithm, false, ['decrypt']);
  try {
    const decrypted = await crypto.subtle.decrypt(algorithm, cryptoKey, data);
    return new TextDecoder().decode(decrypted);
  } catch (e) {
    throw new Error('Invalid password');
  }
};

// Rich Text Editor Component
const RichTextEditor = ({ content, onChange, onGrammarCheck, darkMode }) => {
  const editorRef = useRef(null);
  const [fontSize, setFontSize] = useState('16px');

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const changeFontSize = (size) => {
    setFontSize(size);
    if (editorRef.current) {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        execCommand('fontSize', '7');
        const fontElements = editorRef.current.querySelectorAll('font[size="7"]');
        fontElements.forEach(el => {
          el.removeAttribute('size');
          el.style.fontSize = size;
        });
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className={`flex flex-wrap gap-2 p-3 border-b ${
        darkMode 
          ? 'bg-gray-700 border-gray-600' 
          : 'bg-gray-100 border-gray-300'
      }`}>
        <button 
          onClick={() => execCommand('bold')} 
          className={`p-2 rounded transition-all duration-200 ${
            darkMode ? 'bg-gray-700 text-gray-500 hover:bg-gray-600 hover:text-gray-100' : 'hover:bg-gray-200 text-gray-900'
          }`} 
          title="Bold"
        >
          <strong className="font-bold">B</strong>
        </button>
        <button 
          onClick={() => execCommand('italic')} 
          className={`p-2 rounded transition-all duration-200 ${
            darkMode ? 'bg-gray-700 text-gray-500 hover:bg-gray-600 hover:text-gray-100' : 'hover:bg-gray-200 text-gray-900'
          }`} 
          title="Italic"
        >
          <em className="italic">I</em>
        </button>
        <button 
          onClick={() => execCommand('underline')} 
          className={`p-2 rounded transition-all duration-200 ${
            darkMode ? 'bg-gray-700 text-gray-500 hover:bg-gray-600 hover:text-gray-100' : 'hover:bg-gray-200 text-gray-900'
          }`} 
          title="Underline"
        >
          <u className="underline">U</u>
        </button>
        <div className={`w-px mx-1 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
        <button 
          onClick={() => execCommand('justifyLeft')} 
          className={`p-2 rounded transition-all duration-200 ${
            darkMode ? 'bg-gray-700 text-gray-500 hover:bg-gray-600 hover:text-gray-100' : 'hover:bg-gray-200 text-gray-900'
          }`} 
          title="Align Left"
        >
          <span>≡</span>
        </button>
        <button 
          onClick={() => execCommand('justifyCenter')} 
          className={`p-2 rounded transition-all duration-200 ${
            darkMode ? 'bg-gray-700 text-gray-500 hover:bg-gray-600 hover:text-gray-100' : 'hover:bg-gray-200 text-gray-900'
          }`} 
          title="Align Center"
        >
          <span>≡</span>
        </button>
        <button 
          onClick={() => execCommand('justifyRight')} 
          className={`p-2 rounded transition-all duration-200 ${
            darkMode ? 'bg-gray-700 text-gray-500 hover:bg-gray-600 hover:text-gray-100' : 'hover:bg-gray-200 text-gray-900'
          }`} 
          title="Align Right"
        >
          <span>≡</span>
        </button>
        <div className={`w-px mx-1 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
        <select 
          onChange={(e) => changeFontSize(e.target.value)} 
          className={`p-2 rounded border transition-all duration-200 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-gray-500 hover:bg-gray-600 hover:text-gray-100' 
              : 'border-gray-300'
          }`}
          value={fontSize}
        >
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
          <option value="24px">24px</option>
          <option value="32px">32px</option>
        </select>
        <div className={`w-px mx-1 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
        <button 
          onClick={onGrammarCheck} 
          className={`p-2 rounded flex items-center gap-1 transition-all duration-200 ${
            darkMode ? 'bg-gray-700 text-gray-500 hover:bg-gray-600 hover:text-gray-100' : 'hover:bg-gray-200 text-gray-900'
          }`} 
          title="Grammar Check"
        >
          <Check size={16} />
          <span>Grammar</span>
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className={`flex-1 p-4 outline-none overflow-auto ${
          darkMode ? 'text-gray-100' : 'text-gray-900'
        }`}
        style={{ minHeight: '300px' }}
      />
    </div>
  );
};

// Main App Component
export default function NotesApp() {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordAction, setPasswordAction] = useState(null);
  const [password, setPassword] = useState('');
  const [glossaryTerms, setGlossaryTerms] = useState([]);
  const [showGlossary, setShowGlossary] = useState(null);
  const [aiSummary, setAiSummary] = useState('');
  const [aiTags, setAiTags] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(true);
  const [aiDataByNote, setAiDataByNote] = useState({});

  // Groq endpoint helper
  const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
  const getGroqKey = () => {
    // Use environment variable for production (Vite requires VITE_ prefix)
    // For local development, you can create a .env file with VITE_GROQ_API_KEY=your_key
    return import.meta.env.VITE_GROQ_API_KEY || '';
  };

  // Icon color helpers for consistent, pleasant UI
  const iconClass = darkMode ? 'text-gray-300 transition-colors duration-200' : 'text-gray-600 transition-colors duration-200';
  const iconButtonClass = 'p-2 rounded hover:opacity-95 transition-all duration-150';
  const accent = darkMode ? {
    primary: 'text-purple-300',
    pin: 'text-blue-400 transition-colors duration-200 hover:text-blue-300',
    lock: 'text-red-400 transition-colors duration-200 hover:text-red-300',
    trash: 'text-red-400',
    plus: 'text-white'
  } : {
    primary: 'text-purple-600',
    pin: 'text-blue-600',
    lock: 'text-red-600',
    trash: 'text-red-600',
    plus: 'text-white'
  };

  useEffect(() => {
    const saved = localStorage.getItem('notes');
    if (saved) {
      setNotes(JSON.parse(saved));
    }
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
    const savedAIData = localStorage.getItem('aiDataByNote');
    if (savedAIData) {
      setAiDataByNote(JSON.parse(savedAIData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('aiDataByNote', JSON.stringify(aiDataByNote));
  }, [aiDataByNote]);

  useEffect(() => {
    if (currentNote) {
      const noteAIData = aiDataByNote[currentNote.id] || {};
      setGlossaryTerms(noteAIData.glossaryTerms || []);
      setAiSummary(noteAIData.aiSummary || '');
      setAiTags(noteAIData.aiTags || []);
    } else {
      setGlossaryTerms([]);
      setAiSummary('');
      setAiTags([]);
    }
  }, [currentNote, aiDataByNote]);

  const createNote = () => {
    const newNote = {
      id: Date.now(),
      title: 'Untitled Note',
      content: '',
      pinned: false,
      encrypted: false,
      tags: [],
      createdAt: new Date().toISOString()
    };
    setNotes([newNote, ...notes]);
    setCurrentNote(newNote);
  };

  const updateNote = (updates) => {
    const updated = { ...currentNote, ...updates };
    setCurrentNote(updated);
    setNotes(notes.map(n => n.id === updated.id ? updated : n));
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
    if (currentNote?.id === id) {
      setCurrentNote(null);
    }
  };

  const togglePin = (id) => {
    setNotes(notes.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
  };

  const encryptCurrentNote = async () => {
    if (!password || !currentNote) return;
    try {
      const encrypted = await encryptNote(currentNote.content, password);
      updateNote({ 
        content: '',
        encryptedContent: encrypted, 
        encrypted: true 
      });
      setPassword('');
      setShowPasswordModal(false);
    } catch (e) {
      alert('Encryption failed');
    }
  };

  const decryptCurrentNote = async () => {
    if (!password || !currentNote) return;
    try {
      const decrypted = await decryptNote(currentNote.encryptedContent, password);
      updateNote({ 
        content: decrypted,
        encrypted: false,
        encryptedContent: null
      });
      setPassword('');
      setShowPasswordModal(false);
    } catch (e) {
      alert('Invalid password');
    }
  };

  const handlePasswordAction = () => {
    if (passwordAction === 'encrypt') {
      encryptCurrentNote();
    } else {
      decryptCurrentNote();
    }
  };

  const extractText = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  const updateAIData = (noteId, updates) => {
    setAiDataByNote(prev => ({
      ...prev,
      [noteId]: {
        ...prev[noteId],
        ...updates
      }
    }));
  };

  // Generic helper to call Groq Chat Completions
  const callGroq = async (prompt, maxTokens = 512, model = 'llama-3.3-70b-versatile') => {
    const key = getGroqKey();
    if (!key) {
      alert('Groq API key not configured. Please contact the administrator.');
      return null;
    }

    try {
      const body = {
        model,
        messages: [
          { role: 'user', content: prompt }
        ],
        max_completion_tokens: maxTokens
      };

      const res = await fetch(GROQ_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('Groq error:', res.status, errText);
        throw new Error(`Groq API error (${res.status}): ${errText}`);
      }

      const data = await res.json();
      const content =
        data?.choices?.[0]?.message?.content ??
        data?.choices?.[0]?.text ??
        (typeof data === 'string' ? data : '');
      return content;
    } catch (e) {
      console.error('callGroq error', e);
      return null;
    }
  };

  const performGrammarCheck = async () => {
    if (!currentNote?.content) return;
    setIsProcessing(true);
    try {
      const text = extractText(currentNote.content);
      const prompt = `Check this text for grammar errors and return ONLY a JSON array of objects with "error" and "correction" fields. Text: "${text.slice(0, 2000)}"`;
      const resultText = await callGroq(prompt, 1000);
      if (resultText === null) {
        alert('Grammar check unavailable (API key / network issue).');
      } else {
        const cleaned = resultText.replace(/```json|```/g, '').trim();
        try {
          const parsed = JSON.parse(cleaned);
          alert(parsed.length === 0 ? 'No grammar errors found!' : `Grammar suggestions:\n${JSON.stringify(parsed, null, 2)}`);
        } catch (e) {
          alert(`Grammar suggestions:\n${cleaned}`);
        }
      }
    } catch (e) {
      alert('Grammar check unavailable');
    } finally {
      setIsProcessing(false);
    }
  };

  const identifyGlossaryTerms = async () => {
    if (!currentNote?.content) return;
    setIsProcessing(true);
    try {
      const text = extractText(currentNote.content);
      const prompt = `Identify 5 key terms from this text and provide definitions. Return ONLY a JSON array of objects with "term" and "definition" fields: "${text.slice(0, 2000)}"`;
      const resultText = await callGroq(prompt, 800);
      if (!resultText) throw new Error('No response');
      const cleaned = resultText.replace(/```json|```/g, '').trim();
      const terms = JSON.parse(cleaned);
      updateAIData(currentNote.id, { glossaryTerms: terms });
    } catch (e) {
      console.error(e);
      alert('Glossary identification unavailable or returned invalid JSON.');
    } finally {
      setIsProcessing(false);
    }
  };

  const generateSummary = async () => {
    if (!currentNote?.content) return;
    setIsProcessing(true);
    try {
      const text = extractText(currentNote.content);
      const prompt = `Summarize this text in 1-2 sentences: "${text.slice(0, 2000)}"`;
      const resultText = await callGroq(prompt, 200);
      if (resultText === null) throw new Error('No response');
      updateAIData(currentNote.id, { aiSummary: resultText.trim() });
    } catch (e) {
      alert('Summary generation unavailable');
    } finally {
      setIsProcessing(false);
    }
  };

  const generateTags = async () => {
    if (!currentNote?.content) return;
    setIsProcessing(true);
    try {
      const text = extractText(currentNote.content);
      const prompt = `Suggest 3-5 relevant tags for this text. Return ONLY a JSON array of strings: "${text.slice(0, 2000)}"`;
      const resultText = await callGroq(prompt, 200);
      if (!resultText) throw new Error('No response');
      const cleaned = resultText.replace(/```json|```/g, '').trim();
      const tags = JSON.parse(cleaned);
      updateAIData(currentNote.id, { aiTags: tags });
      updateNote({ tags });
    } catch (e) {
      console.error(e);
      alert('Tag generation unavailable or returned invalid JSON.');
    } finally {
      setIsProcessing(false);
    }
  };


  const filteredNotes = notes
    .filter(n => 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      extractText(n.content).toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return 0;
    });

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <div className={`w-80 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col`}>
        <div className={`p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={22} className={`${accent.primary} ${iconClass}`} />
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>My Notes</h1>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-600'}`}
              title="Toggle Dark Mode"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
          <div className="relative mb-3">
            <Search size={20} className={`${iconClass} absolute left-3 top-2.5`} />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
          <button
            onClick={createNote}
            className="w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700"
          >
            <Plus size={20} className={`${accent.plus}`} />
            New Note
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredNotes.map(note => (
            <div
              key={note.id}
              onClick={() => setCurrentNote(note)}
              className={`p-4 border-b cursor-pointer ${
                darkMode 
                  ? `border-gray-700 hover:bg-gray-700 ${currentNote?.id === note.id ? 'bg-gray-700' : ''}`
                  : `border-gray-200 hover:bg-gray-50 ${currentNote?.id === note.id ? 'bg-blue-50' : ''}`
              }`}
            >
              <div className="flex items-start justify-between mb-1">
                <h3 className={`font-semibold flex-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{note.title}</h3>
                <div className="flex gap-2">
                  {note.pinned && <Pin size={16} className={`${accent.pin} ${darkMode ? 'drop-shadow-[0_0_4px_rgba(96,165,250,0.4)]' : ''}`} />}
                  {note.encrypted && <Lock size={16} className={`${accent.lock} ${darkMode ? 'drop-shadow-[0_0_4px_rgba(248,113,113,0.4)]' : ''}`} />}
                </div>
              </div>
              <p className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {extractText(note.content).slice(0, 60)}...
              </p>
              {note.tags?.length > 0 && (
                <div className="flex gap-1 mt-2 flex-wrap">
                  {note.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className={`text-xs px-2 py-1 rounded ${
                      darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {currentNote ? (
          <>
            <div className={`p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b flex items-center justify-between`}>
              <input
                type="text"
                value={currentNote.title}
                onChange={(e) => updateNote({ title: e.target.value })}
                className={`text-2xl font-bold border-none outline-none flex-1 ${
                  darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                }`}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => togglePin(currentNote.id)}
                  className={`p-2 rounded transition-all duration-200 ${
                    darkMode ? 'bg-gray-700 text-gray-500 hover:bg-gray-600 hover:text-gray-100' : 'hover:bg-gray-200 text-gray-900'
                  }`}
                  title="Pin Note"
                >
                  <Pin size={20} />
                </button>
                <button
                  onClick={() => {
                    setPasswordAction(currentNote.encrypted ? 'decrypt' : 'encrypt');
                    setShowPasswordModal(true);
                  }}
                  className={`p-2 rounded transition-all duration-200 ${
                    darkMode ? 'bg-gray-700 text-gray-500 hover:bg-gray-600 hover:text-gray-100' : 'hover:bg-gray-200 text-gray-900'
                  }`}
                  title={currentNote.encrypted ? 'Decrypt Note' : 'Encrypt Note'}
                >
                  {currentNote.encrypted ? <Lock size={20} /> : <Unlock size={20} />}
                </button>
                <button
                  onClick={() => deleteNote(currentNote.id)}
                  className={`${iconButtonClass} hover:bg-red-50`}
                  title="Delete Note"
                >
                  <Trash2 size={20} className={accent.trash} />
                </button>
              </div>
            </div>

            {currentNote.encrypted ? (
              <div className={`flex-1 flex items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="text-center">
                  <Lock size={48} className={`${darkMode ? 'text-gray-400' : 'text-gray-400'} mx-auto mb-4`} />
                  <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>This note is encrypted</p>
                  <button
                    onClick={() => {
                      setPasswordAction('decrypt');
                      setShowPasswordModal(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    Unlock Note
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex">
                <div className={`flex-1 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <RichTextEditor
                    content={currentNote.content}
                    onChange={(content) => updateNote({ content })}
                    onGrammarCheck={performGrammarCheck}
                    darkMode={darkMode}
                  />
                </div>

                {/* AI Features Panel */}
                {showAIPanel && (
                  <div className={`w-80 ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'} border-l p-4 overflow-y-auto`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`font-bold text-lg flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        <Sparkles size={20} className={`${accent.primary} ${iconClass}`} />
                        AI Features
                      </h3>
                      <button
                        onClick={() => setShowAIPanel(false)}
                        className={`${iconButtonClass} ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
                        title="Hide AI Panel"
                      >
                        <X size={20} className={iconClass} />
                      </button>
                    </div>

                  <button
                    onClick={identifyGlossaryTerms}
                    disabled={isProcessing}
                    className="w-full bg-purple-600 text-white py-2 rounded-lg mb-3 hover:bg-purple-700 disabled:opacity-50"
                  >
                    Identify Key Terms
                  </button>

                  {glossaryTerms.length > 0 && (
                    <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Glossary</h4>
                      {glossaryTerms.map((term, i) => (
                        <div key={i} className="mb-3">
                          <div 
                            className={`font-medium ${darkMode ? 'text-purple-300' : 'text-purple-600'} cursor-pointer hover:underline`}
                            onMouseEnter={() => setShowGlossary(i)}
                            onMouseLeave={() => setShowGlossary(null)}
                          >
                            {term.term}
                          </div>
                          {showGlossary === i && (
                            <div className={`text-sm mt-1 p-2 rounded ${
                              darkMode ? 'bg-purple-900 text-gray-300' : 'bg-purple-50 text-gray-700'
                            }`}>
                              {term.definition}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={generateSummary}
                    disabled={isProcessing}
                    className="w-full bg-green-600 text-white py-2 rounded-lg mb-3 hover:bg-green-700 disabled:opacity-50"
                  >
                    Generate Summary
                  </button>

                  {aiSummary && (
                    <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Summary</h4>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{aiSummary}</p>
                    </div>
                  )}

                  <button
                    onClick={generateTags}
                    disabled={isProcessing}
                    className="w-full bg-orange-600 text-white py-2 rounded-lg mb-3 hover:bg-orange-700 disabled:opacity-50"
                  >
                    <Tag size={16} className="inline mr-2" />
                    Suggest Tags
                  </button>

                  {aiTags.length > 0 && (
                    <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Suggested Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {aiTags.map((tag, i) => (
                          <span key={i} className={`px-2 py-1 rounded text-sm ${
                            darkMode ? 'bg-orange-900 text-orange-200' : 'bg-orange-100 text-orange-800'
                          }`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                )}

                {!showAIPanel && (
                  <button
                    onClick={() => setShowAIPanel(true)}
                    className={`absolute right-4 top-24 p-2 rounded-full shadow-lg ${
                      darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-600 hover:bg-purple-700'
                    } text-white`}
                    title="Show AI Panel"
                  >
                    <Sparkles size={20} className={accent.primary} />
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className={`flex-1 flex items-center justify-center ${darkMode ? 'bg-gray-800 text-gray-500' : 'bg-white text-gray-400'}`}>
            <div className="text-center">
              <p className="text-xl mb-2">No note selected</p>
              <p>Create a new note or select one from the sidebar</p>
            </div>
          </div>
        )}
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg p-6 w-96 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {passwordAction === 'encrypt' ? 'Encrypt Note' : 'Decrypt Note'}
            </h3>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className={`w-full p-2 border rounded mb-4 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              onKeyPress={(e) => e.key === 'Enter' && handlePasswordAction()}
            />
            <div className="flex gap-2">
              <button
                onClick={handlePasswordAction}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPassword('');
                }}
                className={`flex-1 py-2 rounded ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// Small Preview Wrapper to render in a standalone preview environment
export function PreviewWrapper() {
  return (
    <div style={{width: '100%', height: '100%'}}>
      <NotesApp />
    </div>
  );
}
