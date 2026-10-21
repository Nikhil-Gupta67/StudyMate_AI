import { useCallback, useEffect, useRef, useState } from 'react'
import {
  GraduationCap, Sparkles, Mic, Volume2, ClipboardList, CalendarDays,
  CircleCheck, Plus, ListChecks, LogOut, ChevronDown, Eye, EyeOff,
  LockKeyhole, Mail, UserRound, Trash2, Check, X, Radio, LoaderCircle
} from 'lucide-react'

const API = 'http://localhost:3001/api'
const tokenKey = 'studymate_token'
const userKey = 'studymate_user'

async function api(path, options = {}) {
  const token = localStorage.getItem(tokenKey)
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || 'Something went wrong')
  return data
}

function Brand() {
  return <div className="flex items-center gap-3">
    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-200"><GraduationCap size={27}/></div>
    <div className="text-[23px] font-extrabold tracking-tight"><span className="text-violet-700">StudyMate</span> <span className="text-slate-400">AI</span></div>
  </div>
}

function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const data = await api(mode === 'login' ? '/auth/login' : '/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      })
      localStorage.setItem(tokenKey, data.token)
      localStorage.setItem(userKey, JSON.stringify(data.user))
      onLogin(data.user)
    } catch (err) { setError(err.message) }
    finally { setBusy(false) }
  }

  return <main className="flex min-h-screen items-center justify-center px-4 py-10">
    <div className="grid w-full max-w-5xl overflow-hidden rounded-[30px] bg-white shadow-2xl shadow-violet-100 lg:grid-cols-2">
      <section className="relative hidden min-h-[620px] flex-col justify-between overflow-hidden bg-gradient-to-br from-violet-700 via-purple-600 to-indigo-500 p-12 text-white lg:flex">
        <div className="absolute -right-24 -top-16 h-80 w-80 rounded-full border-[42px] border-white/10"/>
        <div className="relative"><Brand/></div>
        <div className="relative max-w-md">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold"><Sparkles size={16}/> YOUR PERSONAL STUDY COMPANION</div>
          <h1 className="text-5xl font-black leading-tight">Make every study session count.</h1>
          <p className="mt-5 text-lg leading-8 text-white/85">One calm space for assignments, deadlines, and the next small step toward your goals.</p>
        </div>
        <p className="relative text-sm text-white/75">A little progress adds up. ✨</p>
      </section>
      <section className="p-7 sm:p-12">
        <div className="mb-8 lg:hidden"><Brand/></div>
        <p className="text-sm font-bold uppercase tracking-[.18em] text-violet-600">{mode === 'login' ? 'Welcome back' : 'Get started'}</p>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">{mode === 'login' ? 'Sign in to StudyMate' : 'Create your account'}</h2>
        <p className="mt-3 text-slate-500">{mode === 'login' ? 'Your study space is waiting for you.' : 'Create an account to keep your assignments together.'}</p>
        <form onSubmit={submit} className="mt-8 space-y-5">
          {mode === 'register' && <label className="block text-sm font-semibold text-slate-700">Your name
            <span className="relative mt-2 block"><UserRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/><input required value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"/></span>
          </label>}
          <label className="block text-sm font-semibold text-slate-700">Email address
            <span className="relative mt-2 block"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"/></span>
          </label>
          <label className="block text-sm font-semibold text-slate-700">Password
            <span className="relative mt-2 block"><LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/><input required minLength={6} type={showPassword ? 'text' : 'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 6 characters" className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"/><button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button></span>
          </label>
          {error && <div role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-4 font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:opacity-60">{busy && <LoaderCircle className="animate-spin" size={18}/>} {mode === 'login' ? 'Sign in' : 'Create account'}</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">{mode === 'login' ? "Don't have an account?" : 'Already have an account?'} <button onClick={()=>{setMode(mode==='login'?'register':'login');setError('')}} className="font-bold text-violet-700 hover:underline">{mode === 'login' ? 'Create one' : 'Sign in'}</button></p>
        <p className="mt-7 text-center text-xs leading-5 text-slate-400">Your account is for this local prototype. Do not reuse a sensitive password.</p>
      </section>
    </div>
  </main>
}

function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(userKey) || 'null') } catch { return null }
  })
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [voiceState, setVoiceState] = useState('idle')
  const [voiceMessage, setVoiceMessage] = useState('Your study space is ready.')
  const [wakeEnabled, setWakeEnabled] = useState(false)
  const [error, setError] = useState('')
  const recognitionRef = useRef(null)
  const wakeRef = useRef(false)
  const pendingCommandRef = useRef(false)
  const userName = user?.name || user?.email?.split('@')[0] || 'Student'

  const loadTasks = useCallback(async () => {
    try { const data = await api('/tasks'); setTasks(data.tasks || []); setError('') }
    catch (e) { setError(`${e.message}. Is the backend running?`) }
  }, [])

  useEffect(() => { if (user) loadTasks() }, [user, loadTasks])

  const say = useCallback((message) => {
    setVoiceMessage(message)
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(message)
      utterance.rate = 1
      window.speechSynthesis.speak(utterance)
    }
  }, [])

  const addTask = useCallback(async (taskTitle, taskDate = '') => {
    const clean = taskTitle.trim()
    if (!clean) { say('Tell me the assignment name first.'); return }
    try {
      const data = await api('/tasks', { method: 'POST', body: JSON.stringify({ title: clean, dueDate: taskDate }) })
      setTasks(prev => [data.task, ...prev])
      setTitle('')
      setDueDate('')
      say(`Added ${clean} to your assignments.`)
    } catch (e) { setError(e.message); say('I could not save that assignment. Please check the server.') }
  }, [say])

  const toggleTask = useCallback(async (task) => {
    try {
      const data = await api(`/tasks/${task.id}`, { method: 'PATCH', body: JSON.stringify({ completed: !task.completed }) })
      setTasks(prev => prev.map(t => t.id === task.id ? data.task : t))
    } catch (e) { setError(e.message) }
  }, [])

  const deleteTask = useCallback(async (task) => {
    try { await api(`/tasks/${task.id}`, { method: 'DELETE' }); setTasks(prev => prev.filter(t=>t.id!==task.id)) }
    catch (e) { setError(e.message) }
  }, [])

  const processCommand = useCallback(async (raw) => {
    const command = raw.toLowerCase().trim().replace(/[.!?]+$/, '')
    setVoiceState('processing')
    if (!command) { say('I did not catch that. Please try again.'); setVoiceState('idle'); return }
    if (command.includes('stop listening') || command.includes('turn off wake word')) {
      setWakeEnabled(false); wakeRef.current = false; say('Wake phrase listening is off.'); setVoiceState('idle'); return
    }
    if (command.startsWith('add ') || command.startsWith('create ') || command.startsWith('remember ')) {
      const taskTitle = raw.trim().replace(/^(add|create|remember)\s+(an?\s+)?(assignment|task|reminder)?\s*/i, '').trim()
      await addTask(taskTitle || raw, '')
    } else if (command.includes('show') || command.includes('list') || command.includes('my tasks') || command.includes('assignments')) {
      const open = tasks.filter(t=>!t.completed)
      say(open.length ? `You have ${open.length} tasks left. ${open.slice(0,3).map(t=>t.title).join('. ')}` : 'You have no unfinished assignments. Great job!')
    } else if (command.includes('how many') || command.includes('count')) {
      say(`You have ${tasks.length} assignments in total, and ${tasks.filter(t=>!t.completed).length} still to do.`)
    } else if (command.includes('hello') || command === 'hi' || command.includes('hey studymate')) {
      say(`Hello ${userName}! I'm ready to help with your studies.`)
    } else if (command.includes('help')) {
      say('You can say: add maths homework, show my tasks, or how many assignments do I have.')
    } else {
      say(`I heard: ${raw}. Try saying add followed by an assignment, show my tasks, or how many tasks do I have.`)
    }
    setVoiceState('idle')
  }, [addTask, say, tasks, userName])

  const startRecognition = useCallback((wakeMode = false) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setVoiceMessage('Voice recognition is not supported in this browser. Please try Google Chrome or Microsoft Edge.')
      setVoiceState('idle')
      return
    }
    try { recognitionRef.current?.stop() } catch {}
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.continuous = wakeMode
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.onstart = () => { setVoiceState(wakeMode ? 'wake' : 'listening'); setVoiceMessage(wakeMode ? 'Listening for “Hello Alexa”… keep this tab open.' : 'Listening now. Say your command.') }
    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim()
      if (wakeMode) {
        if (!pendingCommandRef.current && /hello\s+alexa|hey\s+alexa/i.test(transcript)) {
          pendingCommandRef.current = true
          say('I am listening. What would you like me to do?')
          setVoiceMessage('Wake phrase detected. Say your command now.')
          setVoiceState('listening')
          // Restart recognition in one-shot mode for the actual command.
          try { recognition.stop() } catch {}
          setTimeout(() => startRecognition(false), 700)
        } else if (pendingCommandRef.current) {
          pendingCommandRef.current = false
          processCommand(transcript)
        }
      } else {
        processCommand(transcript)
      }
    }
    recognition.onerror = (event) => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setVoiceMessage('Microphone permission was blocked. Allow microphone access in your browser settings.')
        setVoiceState('idle')
      } else if (event.error !== 'no-speech' && event.error !== 'aborted') {
        setVoiceMessage(`Voice error: ${event.error}. Try clicking the microphone again.`)
        setVoiceState('idle')
      }
    }
    recognition.onend = () => {
      if (wakeRef.current && wakeMode) {
        setTimeout(() => { if (wakeRef.current) startRecognition(true) }, 500)
      } else if (voiceState !== 'processing') {
        setVoiceState('idle')
      }
    }
    recognitionRef.current = recognition
    try { recognition.start() } catch {
      setVoiceMessage('Voice is already starting. Wait a moment and try again.')
    }
  }, [processCommand, say, voiceState])

  const toggleWake = () => {
    if (wakeEnabled) {
      wakeRef.current = false
      setWakeEnabled(false)
      try { recognitionRef.current?.stop() } catch {}
      setVoiceState('idle')
      setVoiceMessage('Wake phrase listening is off.')
    } else {
      wakeRef.current = true
      pendingCommandRef.current = false
      setWakeEnabled(true)
      startRecognition(true)
    }
  }

  const logout = () => {
    wakeRef.current = false
    try { recognitionRef.current?.stop() } catch {}
    localStorage.removeItem(tokenKey)
    localStorage.removeItem(userKey)
    setUser(null)
    setTasks([])
    setMenuOpen(false)
  }

  if (!user) return <AuthScreen onLogin={setUser}/>

  const remaining = tasks.filter(t => !t.completed).length
  const completed = tasks.length - remaining

  return <div className="min-h-screen bg-[#f5f6fd] pb-12">
    <header className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 md:px-10 xl:px-14">
      <Brand/>
      <div className="relative">
        <button onClick={()=>setMenuOpen(!menuOpen)} aria-expanded={menuOpen} className="flex items-center gap-2 rounded-full border border-violet-100 bg-white px-4 py-2.5 text-sm font-extrabold uppercase tracking-wider text-violet-700 shadow-sm transition hover:border-violet-300 hover:shadow-md">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"/><span className="max-w-32 truncate">Study space</span><ChevronDown size={16} className={`transition ${menuOpen?'rotate-180':''}`}/>
        </button>
        {menuOpen && <div className="absolute right-0 z-20 mt-3 w-64 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl">
          <div className="border-b border-slate-100 px-3 py-3"><p className="font-bold text-slate-800">{userName}</p><p className="mt-1 truncate text-xs text-slate-500">{user.email}</p></div>
          <button onClick={toggleWake} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-violet-50"><Radio size={17} className="text-violet-600"/>{wakeEnabled?'Disable wake phrase':'Enable “Hello Alexa” wake phrase'}</button>
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-red-600 hover:bg-red-50"><LogOut size={17}/>Log out</button>
        </div>}
      </div>
    </header>

    <main className="mx-auto max-w-[1440px] px-5 md:px-10 xl:px-14">
      <section className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-violet-700 via-purple-600 to-indigo-500 px-7 py-10 text-white shadow-2xl shadow-violet-200 md:px-12 md:py-14">
        <div className="pointer-events-none absolute -right-12 -top-24 h-80 w-80 rounded-full border-[42px] border-white/10"/>
        <div className="relative max-w-3xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-bold"><Sparkles size={16}/> YOUR PERSONAL STUDY COMPANION</div>
          <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight md:text-6xl">Make every study session count.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/85 md:text-xl">One calm space for assignments, deadlines, and the next small step toward your goals.</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button onClick={()=>startRecognition(false)} className="inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-4 font-semibold text-violet-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-violet-50 active:translate-y-0"><Mic size={21}/>{voiceState==='listening'?'Listening…':'Talk to StudyMate'}</button>
            <button onClick={toggleWake} className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-3 font-semibold transition ${wakeEnabled?'border-white bg-white/20 text-white':'border-white/20 bg-white/10 text-white hover:bg-white/20'}`}><Radio size={19}/>{wakeEnabled?'Wake phrase enabled':'Enable “Hello Alexa”'}</button>
            <span className="inline-flex items-center gap-2 text-sm text-white/90"><Volume2 size={18}/> Browser voice prototype</span>
          </div>
          <p aria-live="polite" className="mt-5 text-sm text-white/90">{voiceMessage}</p>
          <p className="mt-2 text-xs text-white/70">Wake phrase works only while this page is open and your browser allows microphone listening.</p>
        </div>
      </section>

      {error && <div className="mt-5 flex items-start justify-between gap-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"><span>{error}</span><button onClick={()=>setError('')} aria-label="Dismiss error"><X size={17}/></button></div>}

      <section className="mt-6 grid gap-5 md:grid-cols-3">
        <Stat icon={<ClipboardList size={22}/>} label="Total assignments" value={tasks.length} tint="violet"/>
        <Stat icon={<CalendarDays size={22}/>} label="Still to do" value={remaining} tint="amber"/>
        <Stat icon={<CircleCheck size={22}/>} label="Completed" value={completed} tint="green"/>
      </section>

      <section className="mt-6 grid items-start gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 flex items-center gap-4"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-violet-50 text-violet-700"><Plus size={28}/></div><div><h2 className="text-xl font-extrabold">Add an assignment</h2><p className="mt-1 text-sm text-slate-500">Make your next task easy to remember.</p></div></div>
          <form onSubmit={e=>{e.preventDefault();addTask(title,dueDate)}} className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700">Assignment name<input value={title} onChange={e=>setTitle(e.target.value)} required placeholder="e.g. Complete maths homework" className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"/></label>
            <label className="block text-sm font-semibold text-slate-700">Due date <span className="font-normal text-slate-400">(optional)</span><input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"/></label>
            <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-4 font-bold text-white shadow-lg shadow-violet-100 transition hover:bg-violet-700"><Plus size={19}/> Add to my planner</button>
          </form>
          <div className="mt-6 rounded-2xl bg-violet-50 p-4"><p className="text-sm font-bold text-violet-800">Voice tip</p><p className="mt-1 text-sm leading-6 text-violet-700">Try “Hello Alexa”, wait for the prompt, then say “add science homework”.</p></div>
        </div>

        <div className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 flex items-center justify-between gap-4"><div className="flex items-center gap-4"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-indigo-50 text-indigo-700"><ListChecks size={27}/></div><div><h2 className="text-xl font-extrabold">Your assignments</h2><p className="mt-1 text-sm text-slate-500">A little progress adds up.</p></div></div><span className="shrink-0 rounded-full bg-slate-100 px-4 py-2 text-xs font-extrabold text-slate-600">{remaining} left</span></div>
          {tasks.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-200 px-5 py-12 text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-50 text-slate-400"><ClipboardList size={26}/></div><h3 className="mt-4 font-bold text-slate-700">No assignments yet</h3><p className="mt-2 text-sm text-slate-500">Add your first task or use your voice to get started.</p></div> :
            <div className="space-y-3">{tasks.map(task=><div key={task.id} className={`flex items-start gap-3 rounded-2xl border p-4 transition ${task.completed?'border-emerald-100 bg-emerald-50/60':'border-slate-100 bg-white hover:border-violet-100'}`}>
              <button onClick={()=>toggleTask(task)} aria-label={task.completed?'Mark incomplete':'Mark complete'} className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg border transition ${task.completed?'border-emerald-500 bg-emerald-500 text-white':'border-slate-300 bg-white text-transparent hover:border-violet-500'}`}><Check size={15}/></button>
              <div className="min-w-0 flex-1"><p className={`break-words font-bold ${task.completed?'text-slate-400 line-through':'text-slate-800'}`}>{task.title}</p>{task.dueDate && <p className="mt-1 text-xs text-slate-500">Due {task.dueDate}</p>}</div>
              <button onClick={()=>deleteTask(task)} aria-label="Delete assignment" className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={17}/></button>
            </div>)}</div>}
        </div>
      </section>
      <p className="mt-8 text-center text-xs leading-5 text-slate-400">StudyMate AI is a browser-based prototype. It is not connected to Amazon Alexa or Alexa+.</p>
    </main>
  </div>
}

function Stat({ icon, label, value, tint }) {
  const colors = { violet: 'bg-violet-50 text-violet-600', amber: 'bg-amber-50 text-amber-600', green: 'bg-emerald-50 text-emerald-600' }
  return <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"><div className="flex items-center justify-between gap-4"><span className="text-sm font-medium text-slate-500">{label}</span><span className={`grid h-12 w-12 place-items-center rounded-2xl ${colors[tint]}`}>{icon}</span></div><p className="mt-4 text-4xl font-black tracking-tight text-slate-800">{value}</p></div>
}

export default App
