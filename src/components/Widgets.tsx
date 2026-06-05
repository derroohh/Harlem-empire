import React, { useState, useEffect } from 'react';
import { 
  CloudSun, CloudRain, Sun, Wind, Droplets, Plus, Trash2, 
  Check, FileText, Calendar, Activity, ChevronRight, Sparkles 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { WeatherData, QuickNote, TaskItem, EventItem } from '../types';

// ==========================================
// 1. WEATHER WIDGET
// ==========================================
export const WeatherWidget: React.FC = () => {
  const [city, setCity] = useState('San Francisco');
  const [searchWord, setSearchWord] = useState('');
  const [weather, setWeather] = useState<WeatherData>({
    temp: 72,
    condition: 'Sunny',
    humidity: 45,
    windSpeed: 8,
    location: 'San Francisco, CA'
  });

  const weatherPresets: Record<string, WeatherData> = {
    'san francisco': { temp: 68, condition: 'Sunny', humidity: 45, windSpeed: 8, location: 'San Francisco, CA' },
    'new york': { temp: 75, condition: 'Cloudy', humidity: 60, windSpeed: 12, location: 'New York, NY' },
    'london': { temp: 58, condition: 'Rainy', humidity: 80, windSpeed: 15, location: 'London, UK' },
    'tokyo': { temp: 70, condition: 'Sunny', humidity: 50, windSpeed: 6, location: 'Tokyo, JP' },
    'nairobi': { temp: 78, condition: 'Sunny', humidity: 35, windSpeed: 10, location: 'Nairobi, KE' }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchWord.trim().toLowerCase();
    if (weatherPresets[query]) {
      setWeather(weatherPresets[query]);
      setCity(weatherPresets[query].location.split(',')[0]);
    } else {
      // Simulate random matching weather for other cities
      const conditions = ['Sunny', 'Cloudy', 'Rainy'];
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      const randomTemp = Math.floor(Math.random() * 35) + 50; // 50 to 85 F
      setWeather({
        temp: randomTemp,
        condition: randomCondition,
        humidity: Math.floor(Math.random() * 50) + 30,
        windSpeed: Math.floor(Math.random() * 15) + 3,
        location: `${searchWord.charAt(0).toUpperCase() + searchWord.slice(1)}, World`
      });
      setCity(searchWord);
    }
    setSearchWord('');
  };

  const getIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'rainy': return <CloudRain className="w-14 h-14 text-indigo-500" />;
      case 'cloudy': return <CloudSun className="w-14 h-14 text-neutral-400" />;
      default: return <Sun className="w-14 h-14 text-amber-500 animate-[spin_12s_linear_infinite]" />;
    }
  };

  return (
    <div id="weather-widget" className="relative group overflow-hidden bg-white/95 rounded-3xl p-6 shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_50px_rgba(99,102,241,0.08)] border border-neutral-100/80 transition-all duration-300">
      <div className="absolute top-0 right-0 w-24 h-24 bg-sky-100/40 rounded-full filter blur-xl -mr-6 -mt-6 pointer-events-none" />
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] text-neutral-400 font-bold tracking-wider uppercase">System Widget</span>
          <h3 className="text-sm font-bold text-neutral-800 tracking-tight flex items-center space-x-1">
            <span>Atmos Weather</span>
          </h3>
        </div>
        <span className="text-[11px] font-medium text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full">{weather.location}</span>
      </div>

      <div className="grid grid-cols-2 gap-4 items-center mb-4">
        <div className="flex items-center space-x-3">
          {getIcon(weather.condition)}
          <div>
            <div className="text-3xl font-extrabold text-neutral-900 tracking-tight">{weather.temp}°F</div>
            <div className="text-xs font-semibold text-neutral-500">{weather.condition}</div>
          </div>
        </div>

        <div className="text-right text-xs text-neutral-500 font-medium space-y-1">
          <div className="flex items-center justify-end space-x-1.5">
            <Droplets size={13} className="text-sky-500" />
            <span>Humidity: {weather.humidity}%</span>
          </div>
          <div className="flex items-center justify-end space-x-1.5">
            <Wind size={13} className="text-neutral-500" />
            <span>Wind: {weather.windSpeed} mph</span>
          </div>
        </div>
      </div>

      {/* City Search Selector */}
      <form onSubmit={handleSearch} className="flex gap-2 mt-4">
        <input 
          id="weather-search-input"
          type="text" 
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
          placeholder="Try 'London', 'Tokyo'..."
          className="flex-1 text-xs px-3 py-2 bg-neutral-100 hover:bg-neutral-100/80 focus:bg-white border border-transparent focus:border-indigo-400 focus:outline-none rounded-xl transition-all placeholder-neutral-400 text-neutral-700"
        />
        <button 
          id="btn-weather-search"
          type="submit" 
          className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 text-xs font-semibold rounded-xl transition-all"
        >
          Check
        </button>
      </form>
    </div>
  );
};


// ==========================================
// 2. FITNESS STEP ACCUMULATOR WIDGET
// ==========================================
export const FitnessWidget: React.FC = () => {
  const [steps, setSteps] = useState(6420);
  const goal = 10000;
  const percentage = Math.min((steps / goal) * 100, 100);

  const addSteps = (amount: number) => {
    setSteps(prev => prev + amount);
  };

  const calories = Math.round(steps * 0.04);
  const distance = (steps * 0.0008).toFixed(2); // in miles

  return (
    <div id="fitness-widget" className="bg-white/95 rounded-3xl p-6 shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_50px_rgba(99,102,241,0.08)] border border-neutral-100/80 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] text-neutral-400 font-bold tracking-wider uppercase">Active Wellness</span>
          <h3 className="text-sm font-bold text-neutral-800 tracking-tight flex items-center space-x-1">
            <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span>Google Fit Tracker</span>
          </h3>
        </div>
        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">Active</span>
      </div>

      <div className="grid grid-cols-5 gap-4 items-center">
        {/* Step Circular Gauge Progress */}
        <div className="col-span-2 flex flex-col items-center justify-center relative">
          <svg className="w-20 h-20 transform -rotate-90">
            <circle cx="40" cy="40" r="34" className="stroke-neutral-100" strokeWidth="5.5" fill="transparent" />
            <circle 
              cx="40" 
              cy="40" 
              r="34" 
              className="stroke-emerald-500 transition-all duration-500 ease-out" 
              strokeWidth="5.5" 
              strokeDasharray={2 * Math.PI * 34} 
              strokeDashoffset={2 * Math.PI * 34 * (1 - percentage / 100)} 
              fill="transparent" 
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute text-center mt-1">
            <span className="block text-xs font-extrabold text-neutral-800 tracking-tight">{Math.round(percentage)}%</span>
            <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-wider">Goal</span>
          </div>
        </div>

        {/* Stats Column */}
        <div className="col-span-3 space-y-2">
          <div>
            <span className="text-[11px] text-neutral-400 font-medium block">Total Daily Steps</span>
            <span id="steps-count-display" className="text-2xl font-black text-neutral-800 tracking-tight">
              {steps.toLocaleString()} <span className="text-xs text-neutral-400 font-semibold">/ {goal.toLocaleString()}</span>
            </span>
          </div>

          <div className="flex justify-between items-center text-[11px] font-semibold text-neutral-500 pt-1 border-t border-neutral-100">
            <span>🔥 {calories} kcal</span>
            <span>📍 {distance} mi</span>
          </div>
        </div>
      </div>

      {/* Stepper buttons */}
      <div className="flex space-x-2 mt-5">
        <button 
          id="btn-fitness-add-500"
          onClick={() => addSteps(500)}
          className="flex-1 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl transition-all pointer-events-auto"
        >
          +500 steps
        </button>
        <button 
          id="btn-fitness-add-1000"
          onClick={() => addSteps(1500)}
          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-all"
        >
          +1,500 steps
        </button>
      </div>
    </div>
  );
};


// ==========================================
// 3. PERSISTENT TASKS & CHECKLIST WIDGET
// ==========================================
export const TasksWidget: React.FC = () => {
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem('android_tasks');
    return saved ? JSON.parse(saved) : [
      { id: '1', text: 'Set up Google cloud credentials', completed: true },
      { id: '2', text: 'Check card aesthetic padding', completed: false },
      { id: '3', text: 'Refactor light-theme components', completed: false }
    ];
  });
  const [newTaskText, setNewTaskText] = useState('');

  useEffect(() => {
    localStorage.setItem('android_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const item: TaskItem = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false
    };
    setTasks(prev => [...prev, item]);
    setNewTaskText('');
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <div id="tasks-widget" className="bg-white/95 rounded-3xl p-6 shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_50px_rgba(99,102,241,0.08)] border border-neutral-100/80 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[10px] text-neutral-400 font-bold tracking-wider uppercase">Android Utility</span>
          <h3 className="text-sm font-bold text-neutral-800 tracking-tight flex items-center space-x-1">
            <span>Material Checklist</span>
          </h3>
        </div>
        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
          {completedCount}/{tasks.length} Done
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden mb-4">
        <div 
          className="bg-indigo-500 h-full transition-all duration-500 ease-out" 
          style={{ width: `${progressPercent}%` }} 
        />
      </div>

      {/* Scrollable list area */}
      <div className="space-y-1.5 max-h-[170px] overflow-y-auto pr-1 mb-4 scrollbar-thin scrollbar-thumb-neutral-200">
        <AnimatePresence initial={false}>
          {tasks.map(task => (
            <motion.div 
              key={task.id}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between p-2 hover:bg-neutral-50 rounded-xl transition-all group"
            >
              <div className="flex items-center space-x-2.5 flex-1 min-w-0">
                <button
                  id={`btn-toggle-task-${task.id}`}
                  onClick={() => toggleTask(task.id)}
                  className={`w-[18px] h-[18px] rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                    task.completed 
                      ? 'bg-indigo-500 border-indigo-500 text-white' 
                      : 'border-neutral-300 hover:border-indigo-400 bg-white'
                  }`}
                >
                  {task.completed && <Check size={11} className="stroke-[3.5px]" />}
                </button>
                <span className={`text-xs truncate transition-all flex-1 ${
                  task.completed ? 'line-through text-neutral-400 font-medium' : 'text-neutral-700 font-medium'
                }`}>
                  {task.text}
                </span>
              </div>
              <button 
                id={`btn-delete-task-${task.id}`}
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-500 text-neutral-400 rounded-lg hover:bg-rose-50 transition-all shrink-0"
              >
                <Trash2 size={13} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {tasks.length === 0 && (
          <div className="text-center py-4 text-xs font-semibold text-neutral-400">
            No active goals. Add some below!
          </div>
        )}
      </div>

      {/* Form and Input */}
      <form onSubmit={addTask} className="flex gap-2">
        <input 
          id="task-add-input"
          type="text" 
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="New tasks e.g. Design UI..."
          className="flex-1 text-xs px-3 py-2 bg-neutral-100 hover:bg-neutral-100/80 focus:bg-white border border-transparent focus:border-indigo-400 focus:outline-none rounded-xl transition-all placeholder-neutral-400 text-neutral-700"
        />
        <button 
          id="btn-add-task"
          type="submit" 
          className="p-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl transition-all"
        >
          <Plus size={16} />
        </button>
      </form>
    </div>
  );
};


// ==========================================
// 4. QUICK PERSISTENT NOTES WIDGET
// ==========================================
export const NotesWidget: React.FC = () => {
  const [notes, setNotes] = useState<QuickNote[]>(() => {
    const saved = localStorage.getItem('android_notes');
    return saved ? JSON.parse(saved) : [
      { id: '1', text: 'Android standard cards always look better when styled with customized elevation shadows like shadow-lg.', createdAt: 'June 4, 10:30 AM' },
      { id: '2', text: 'Light themed color tones utilize pure white (#FFF) cards overlaid on warm off-white, light gray backgrounds.', createdAt: 'June 5, 2:15 PM' }
    ];
  });
  const [noteInput, setNoteInput] = useState('');

  useEffect(() => {
    localStorage.setItem('android_notes', JSON.stringify(notes));
  }, [notes]);

  const saveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + `, ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    
    const newNote: QuickNote = {
      id: Date.now().toString(),
      text: noteInput.trim(),
      createdAt: formattedDate
    };
    setNotes(prev => [newNote, ...prev]);
    setNoteInput('');
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div id="notes-widget" className="bg-white/95 rounded-3xl p-6 shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_50px_rgba(99,102,241,0.08)] border border-neutral-100/80 transition-all duration-300 flex flex-col h-[340px]">
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div>
          <span className="text-[10px] text-neutral-400 font-bold tracking-wider uppercase">Android Scratchpad</span>
          <h3 className="text-sm font-bold text-neutral-800 tracking-tight flex items-center space-x-1.5">
            <FileText className="w-4 h-4 text-amber-500" />
            <span>Google Keep Notes</span>
          </h3>
        </div>
      </div>

      {/* Note input form */}
      <form onSubmit={saveNote} className="flex gap-2 mb-3 shrink-0">
        <input 
          id="note-add-input"
          type="text" 
          value={noteInput}
          onChange={(e) => setNoteInput(e.target.value)}
          placeholder="Jot down a quick thought..."
          className="flex-1 text-xs px-3 py-2.5 bg-neutral-100 hover:bg-neutral-100/80 focus:bg-white border border-transparent focus:border-indigo-400 focus:outline-none rounded-xl transition-all placeholder-neutral-400 text-neutral-700"
        />
        <button 
          id="btn-save-note"
          type="submit" 
          className="px-3 py-2 bg-amber-500 hover:bg-amber-600 font-bold text-white text-xs rounded-xl transition-all flex items-center"
        >
          <Plus size={16} />
        </button>
      </form>

      {/* Overflow notes grid/list */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin scrollbar-thumb-neutral-200">
        <AnimatePresence initial={false}>
          {notes.map(note => (
            <motion.div 
              key={note.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="p-3 bg-amber-50/50 hover:bg-amber-50 rounded-2xl border border-amber-100/30 relative group transition-all"
            >
              <button 
                id={`btn-delete-note-${note.id}`}
                onClick={() => deleteNote(note.id)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 hover:text-rose-500 text-neutral-400 hover:bg-rose-50 rounded-lg transition-all"
                title="Delete note"
              >
                <Trash2 size={12} />
              </button>
              <p className="text-xs font-medium text-neutral-700 leading-relaxed pr-5">
                {note.text}
              </p>
              <span className="text-[9px] font-bold text-amber-600 block mt-1.5">{note.createdAt}</span>
            </motion.div>
          ))}
        </AnimatePresence>

        {notes.length === 0 && (
          <div className="text-center py-8 text-xs font-semibold text-neutral-400 italic">
            Scratchpad is empty. Create your first note.
          </div>
        )}
      </div>
    </div>
  );
};


// ==========================================
// 5. CALENDAR SCHEDULE WIDGET
// ==========================================
export const CalendarWidget: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'work' | 'personal'>('all');
  const [events, setEvents] = useState<EventItem[]>([
    { id: '1', title: 'Android UI Refactor syncing', time: '10:30 AM', category: 'work' },
    { id: '2', title: 'Gym Workout & Google Fit logging', time: '2:00 PM', category: 'health' },
    { id: '3', title: 'Dinner with team', time: '7:30 PM', category: 'personal' },
    { id: '4', title: 'Deploy workspace updates', time: '9:00 PM', category: 'work' }
  ]);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('12:00 PM');
  const [newEventCat, setNewEventCat] = useState<'work' | 'personal'>('work');

  const addEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;
    const item: EventItem = {
      id: Date.now().toString(),
      title: newEventTitle.trim(),
      time: newEventTime,
      category: newEventCat
    };
    setEvents(prev => [...prev, item]);
    setNewEventTitle('');
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'work': return 'bg-indigo-500';
      case 'health': return 'bg-emerald-500';
      default: return 'bg-amber-500';
    }
  };

  const filteredEvents = events.filter(e => filter === 'all' || e.category === filter);

  return (
    <div id="calendar-widget" className="bg-white/95 rounded-3xl p-6 shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_50px_rgba(99,102,241,0.08)] border border-neutral-100/80 transition-all duration-300 flex flex-col h-[340px]">
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div>
          <span className="text-[10px] text-neutral-400 font-bold tracking-wider uppercase">Android Calendar</span>
          <h3 className="text-sm font-bold text-neutral-800 tracking-tight flex items-center space-x-1.5">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span>Today's Schedule</span>
          </h3>
        </div>
      </div>

      {/* Tabs category filter */}
      <div className="flex bg-neutral-100 p-0.5 rounded-full mb-3 text-[10px] font-bold select-none shrink-0">
        {(['all', 'work', 'personal'] as const).map(tab => (
          <button
            id={`btn-calendar-filter-${tab}`}
            key={tab}
            onClick={() => setFilter(tab)}
            className={`flex-1 py-1 rounded-full capitalize transition-all cursor-pointer ${
              filter === tab ? 'bg-white shadow-sm text-indigo-600' : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Display List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-neutral-200">
        {filteredEvents.map(evt => (
          <div key={evt.id} className="flex items-center justify-between p-2.5 hover:bg-neutral-50 rounded-2xl border border-neutral-100/50 transition-all">
            <div className="flex items-center space-x-2.5 min-w-0">
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${getCategoryColor(evt.category)}`} />
              <div className="min-w-0">
                <p className="text-xs font-bold text-neutral-800 truncate">{evt.title}</p>
                <span className="text-[10px] text-neutral-400 font-semibold">{evt.time}</span>
              </div>
            </div>
            <span className="text-[10px] capitalize text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md font-bold shrink-0">
              {evt.category}
            </span>
          </div>
        ))}

        {filteredEvents.length === 0 && (
          <div className="text-center py-10 text-xs font-semibold text-neutral-400">
            Clear schedule for selected filter. Add one!
          </div>
        )}
      </div>

      {/* Quick Add Event Form */}
      <form onSubmit={addEvent} className="flex flex-col gap-1.5 pt-3 border-t border-neutral-100 shrink-0">
        <div className="flex gap-2">
          <input 
            id="event-title-input"
            type="text"
            required
            value={newEventTitle}
            onChange={(e) => setNewEventTitle(e.target.value)}
            placeholder="Add title..."
            className="flex-1 text-xs px-2.5 py-1.5 bg-neutral-100 focus:bg-white rounded-xl focus:border-indigo-400 border border-transparent focus:outline-none placeholder-neutral-400 text-neutral-700"
          />
          <input 
            id="event-time-input"
            type="text"
            value={newEventTime}
            onChange={(e) => setNewEventTime(e.target.value)}
            placeholder="12:00 PM"
            className="w-20 text-xs px-2.5 py-1.5 bg-neutral-100 focus:bg-white rounded-xl text-center focus:border-indigo-400 border border-transparent focus:outline-none text-neutral-700"
          />
        </div>
        <div className="flex justify-between items-center text-[11px]">
          <div className="flex items-center space-x-2">
            <span className="text-neutral-400 font-bold uppercase text-[9px]">Type:</span>
            <select
              id="event-category-select"
              value={newEventCat}
              onChange={(e) => setNewEventCat(e.target.value as any)}
              className="bg-neutral-100 focus:bg-white border-transparent focus:border-indigo-400 outline-none rounded-lg text-neutral-700 font-bold"
            >
              <option value="work">Work</option>
              <option value="personal">Personal</option>
            </select>
          </div>
          <button 
            id="btn-save-event"
            type="submit" 
            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl transition-all flex items-center space-x-1"
          >
            <Plus size={12} strokeWidth={2.5} />
            <span>Create</span>
          </button>
        </div>
      </form>
    </div>
  );
};


// ==========================================
// 6. ANDROID SYSTEM ASSIST / SECURITY DETAILS
// ==========================================
export const AndroidTipsWidget: React.FC = () => {
  const [tipIndex, setTipIndex] = useState(0);

  const tips = [
    { title: "Material You dynamic colors", body: "Android automatically samples the dominant color of your wallpaper to style buttons, clock sliders, and notification badges seamlessly." },
    { title: "Lock Screen safety widgets", body: "Always use highly encrypted popups like Google OAuth identity systems to handle tokens securely in memory, bypassing storage leaks." },
    { title: "Aesthetic floating elevation", body: "Elevating widgets with realistic custom shadows and a 24px border radius results in an immersive tactile grid perfect for light interfaces." }
  ];

  const nextTip = () => {
    setTipIndex(prev => (prev + 1) % tips.length);
  };

  return (
    <div id="tips-widget" className="bg-white/95 rounded-3xl p-6 shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_50px_rgba(99,102,241,0.08)] border border-neutral-100/80 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-1.5 text-neutral-800">
          <Sparkles className="w-4 h-4 text-amber-500 animate-[bounce_1.5s_infinite]" />
          <h3 className="text-sm font-bold tracking-tight">Android Pixel Tips</h3>
        </div>
        <button 
          id="btn-next-tip"
          onClick={nextTip}
          className="p-1.5 hover:bg-neutral-100 rounded-lg text-indigo-600 font-bold text-xs flex items-center space-x-1"
        >
          <span>Next</span>
          <ChevronRight size={13} />
        </button>
      </div>

      <div className="min-h-[85px] flex flex-col justify-between">
        <div>
          <h4 id="tip-title" className="text-xs font-bold text-neutral-800 mb-1">{tips[tipIndex].title}</h4>
          <p id="tip-body" className="text-[11px] font-medium text-neutral-500 leading-relaxed">
            {tips[tipIndex].body}
          </p>
        </div>
        <div className="flex justify-start space-x-1 mt-3">
          {tips.map((_, i) => (
            <span key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === tipIndex ? 'bg-indigo-600 w-3' : 'bg-neutral-200'}`} />
          ))}
        </div>
      </div>
    </div>
  );
};
