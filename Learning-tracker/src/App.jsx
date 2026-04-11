import { useEffect, useState } from "react"
import LearningForm from "./LearningForm"
import FilterControls from "./FilterControls"
import Stats from "./Stats"
import Topics from './Services/topics'
import LoginForm from "./LoginForm"
import loginServices from './Services/login'
import UserServices from './Services/user'
import RegisterForm from "./RegisterForm"
import { Routes, Route, Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

function App() {
  const [allTopic, setAllTopic] = useState([])
  const [newTopic, setNewTopic] = useState('')
  const [confidence, setConfidence] = useState(0)
  const [filter, setFilter] = useState('')
  const [checked, setChecked] = useState(false)
  const [selected, setSelected] = useState('')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [registerUsername, setRegisterUsername] = useState('')
  const [registerName, setRegisterName] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if(user) {
      Topics.getItem()
      .then(r => {
        setAllTopic(r)
        setLoading(false)
      })
      .catch(error => console.log(error))
    }
  }, [user])

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  useEffect(() => {
    const savedUser = localStorage.getItem('loggedInUser')
    if(savedUser){
      const userToSave = JSON.parse(savedUser)
      Topics.getToken(userToSave.token)
      setUser({username: userToSave.username})
    }
  }, [])

  useEffect(() => {
    const handleUnauthorized = () => {
      Topics.getToken(null)
      setUser(null)
      localStorage.removeItem('loggedInUser')
    }

    window.addEventListener('unauthorized', handleUnauthorized)

    return () => {
      window.removeEventListener('unauthorized', handleUnauthorized)
    }
  }, [])
  
  const add = () => {
    if(newTopic.trim()){
      const selected = allTopic.find(element => element.topic.trim().toLowerCase() === newTopic.trim().toLowerCase())
        if(selected){
          if(window.confirm(`${newTopic} already exists!, Change the confidence instead?`)){
            const newConfidence = {...selected, confidence: confidence}
            Topics.updateItem(selected.id, newConfidence)
            .then(r => {
              setAllTopic(prev => prev.map(element => element.id === selected.id ? r : element))
              toast.success(`You have updated "${r.topic}"`)
              setNewTopic('')
              setConfidence(0)
            })
            .catch(error => {              
              toast.error(`Error: ${error.response?.data?.error}`)
              console.log(error)
            })
          }
        } else {
          const newValue = {
            topic: newTopic,
            hoursStudied: 0,
            confidence: confidence,
            mastered: false,
            lastPracticed: new Date().toISOString().split('T')[0]
          }
        
          Topics.createItem(newValue)
          .then(r => {
            setAllTopic(prev => prev.concat(r))
            toast.success(`You have added "${r.topic}"`)
            setConfidence(0)
            setNewTopic('')
          })
          .catch(error => {
            if(error.response?.data?.error === 'Topic validation failed: topic: Path `topic` (`as`, length 2) is shorter than the minimum allowed length (5).'){
              const message = 'Topic must have atleast 5 characters'
              toast.error(`Error: ${message}`)
            }else {
              toast.error(`Error: ${error.response?.data?.error}`)
            }
            
          })
      }
    }
  }
  const filteredTopic = allTopic.filter(t => {
    const searchAll = t.topic.toLowerCase().includes(filter.toLowerCase())
    const filterToggled = !checked || t.mastered
    const filterConfidence = t.confidence.toString() === selected || !selected

    return searchAll && filterConfidence && filterToggled
  })

  const activeFilter = filter !== '' || selected !== '' || checked


  const reset = () => {
    setChecked(false)
    setSelected('')
    setFilter('')
  }

  const toggleMastered = (id) => {
    const masteredEl = allTopic.find(e => e.id === id)
    const oldState = allTopic
    const selectedMastered = {...masteredEl, mastered: !masteredEl.mastered}
    setAllTopic(prev => prev.map(el => el.id === id ? selectedMastered : el))
    toast.success(`You have ${selectedMastered.mastered ? 'mastered' : 'not mastered'} "${selectedMastered.topic}"`)
    Topics.updateItem(id, selectedMastered)
    .then(r => {
      setAllTopic(prev => prev.map(el => el.id === id ? r : el))
    })
    .catch(error => {
      toast.error(`Error: ${error.response?.data?.error}`)
      setAllTopic(oldState)
    })
  }

  const confidenceOnChange = (e) => {
    const value = Number(e.target.value)
    if(value >= 0 && value <= 5){
      setConfidence(value)
    } else {
      toast.error('Number should be less than 5 and grater than 0')
      setConfidence(0)
    }
  }

  const incrementConfidence = (id) => {
      const topic = allTopic.find(e => e.id === id)

        if(topic.confidence >= 5){
          toast.error('Confidence can not go above 5')
          return
        }
          const selectedConf = {...topic, confidence: topic.confidence + 1}
          const oldState = allTopic
          setAllTopic(prev => prev.map(el => el.id === id ? selectedConf : el) )
          Topics.updateItem(id, selectedConf)
          .then(r => setAllTopic(prev => prev.map(el => el.id === id ? r : el)))
          .catch(error => {
            toast.error(`Error: ${error.response?.data?.error}`)
            setAllTopic(oldState)
          })
  }

  const decrementConfidence = (id) => {
      const topic = allTopic.find(e => e.id === id)
        if(topic.confidence <= 0){
          toast.error('Confidence can not go below 0')
          return
        }
          const selectedConf = {...topic, confidence: topic.confidence - 1}
          const oldState = allTopic
          setAllTopic(prev => prev.map(el => el.id === id ? selectedConf : el) )
          Topics.updateItem(id, selectedConf)
          .then(r => setAllTopic(prev => prev.map(el => el.id === id ? r : el)))
          .catch(error => {
            toast.error(`Error: ${error.response?.data?.error}`)
            setAllTopic(oldState)
          })
  }

  const hourChange = (id) => {
    const topic = allTopic.find(e => e.id === id)
    const updated = {...topic, hoursStudied: topic.hoursStudied + 1, lastPracticed: new Date().toISOString().split('T')[0]}
    const oldState = allTopic
    setAllTopic(prev => prev.map(p => p.id === id ? updated : p))
    Topics.updateItem(id, updated)
    .then(r => setAllTopic(prev => prev.map(el => el.id === id ? r : el)))
    .catch(error => {
      toast.error(`Error: ${error.response?.data?.error}`)
      setAllTopic(oldState)
    })
    
  }

  const remove = (id, name) => {
    if(window.confirm(`Delete ${name}`)){
      Topics.removeItem(id)
      .then(() => {
        setAllTopic(prev => prev.filter(e => e.id !== id))
        toast.success(`You removed "${name}"`)
      })
      .catch(error => {
        toast.error(`Error: ${error.response?.data?.error}`)
        console.log(error)
      })
    }
  }

  const registerFormHandler = async(e) => {
    e.preventDefault()

    try{
      const newUser = await UserServices.registerUser({username: registerUsername, name: registerName, password: registerPassword})
      const logginUserIn = await loginServices.userLoggin({username: newUser.username, password: registerPassword})
      Topics.getToken(logginUserIn.token)
      localStorage.setItem('loggedInUser', JSON.stringify(logginUserIn))
      setUser({username: logginUserIn.username, name: logginUserIn.name})
      setRegisterUsername('')
      setRegisterName('')
      setRegisterPassword('')
    } catch(error) {
      toast.error(error.response?.data?.error || 'Registration failed')
      setRegisterUsername('')
      setRegisterName('')
      setRegisterPassword('')
    }
  }

  const loginHandler = async(e) => {
    e.preventDefault()
    if(username.trim() && password.trim()){
      try{
        const returnedUser = await loginServices.userLoggin({username, password})
        Topics.getToken(returnedUser.token)
        localStorage.setItem('loggedInUser', JSON.stringify(returnedUser))
        setUser({username: returnedUser.username})
        setUsername('')
        setPassword('')
      }catch(error) {
        const message = error.response?.data?.error || 'Login failed'
        toast.error(message)
        setUsername('')
        setPassword('')
      }
    }else{
      toast.error('Login failed')
      setUsername('')
      setPassword('')
    }
  }

  const loggout = () => {
    localStorage.removeItem('loggedInUser')
    setUser(null)
    Topics.getToken(null)
  }

  const total = {
    totalTopic: allTopic.length,
    totalHoursStudied: allTopic.length > 0 ? allTopic.reduce((acc, val) => acc + val.hoursStudied, 0) : 0,
    averageConfidence: allTopic.length > 0 ? (allTopic.reduce((acc, val) => acc + val.confidence, 0) / allTopic.length).toFixed(1) : 'None',
    masteredPercentage: allTopic.length > 0 
    ? Math.round((allTopic.filter(t => t.mastered).length / allTopic.length) * 100)
    : 0,
    masteredCount: allTopic.filter(t => t.mastered).length,
    mostPracticed: allTopic.length > 0 ? allTopic.reduce((acc, val) => acc.hoursStudied > val.hoursStudied ? acc : val, allTopic[0]) : {topic: 'None'}
  }
  
  const homeContent = (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">My Learning Tracker</h1>
        <p className="mt-1 text-slate-600">Track your programming concept mastery.</p>
      </div>
      <LearningForm onChange={e => setNewTopic(e.target.value)} value={newTopic} onClick={add} confidenceOnChange={confidenceOnChange} confidenceValue={confidence} />
      <FilterControls remove={remove} hourChange={hourChange} incrementConfidence={incrementConfidence} decrementConfidence={decrementConfidence} reset={reset} selected={selected} selectedOnChange={e => setSelected(e.target.value)} toggle={toggleMastered} filtered={filteredTopic} filteredOnChange={e => setFilter(e.target.value)} filteredValue={filter} checked={checked} checkOnChange={e => setChecked(e.target.checked)} load={loading} activeFilter={activeFilter} />
      {allTopic.length > 0 ? <Stats total={total} /> : null}
      <button className="mt-6 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 cursor-pointer" onClick={loggout}>Log out</button>
    </div>
  )

  return (
    <>
      <Routes>
        <Route path="/" element={user === null ? 
          <div className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10 md:px-6">
            <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h1 className="text-3xl font-bold text-slate-900">Welcome to My Learning Tracker</h1>
              <p className="mt-3 text-slate-600">A simple way to track your study progress and confidence over time.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/register"><button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 cursor-pointer">Create new account</button></Link>
                <Link to="/login"><button className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 cursor-pointer">Login</button></Link>
              </div>
            </div>
          </div> : homeContent
        } />
        <Route path="/register" element={
          !user ?
          <div className="mx-auto flex min-h-screen max-w-xl items-center px-4 py-10 md:px-6">
            <div className="w-full space-y-4">
            <RegisterForm registerFormHandler={registerFormHandler} setRegisterUsername={setRegisterUsername} registerUsername={registerUsername} registerName={registerName} setRegisterName={setRegisterName} registerPassword={registerPassword} setRegisterPassword={setRegisterPassword} /> 
            <Link to="/"><button className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 cursor-pointer">Back</button></Link>
            </div>
          </div> : 
          homeContent

        } />
        <Route path="/login" element={
          !user ?
          <div className="mx-auto flex min-h-screen max-w-xl items-center px-4 py-10 md:px-6">
            <div className="w-full space-y-4">
            <LoginForm loginHandler={loginHandler} username={username} setUsername={setUsername} password={password} setPassword={setPassword} />
            <Link to="/"><button className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 cursor-pointer">Back</button></Link>
            </div>
          </div> :
          homeContent
        } />
      </Routes>
    </>
  )
}

export default App