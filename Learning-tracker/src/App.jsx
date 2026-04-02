import { useEffect, useState } from "react"
import LearningForm from "./LearningForm"
import FilterControls from "./FilterControls"
import Stats from "./Stats"
import Topics from './Services/topics'
import Notification from "./Notification"
import LoginForm from "./LoginForm"
import loginServices from './Services/login'

function App() {
  const [allTopic, setAllTopic] = useState([])
  const [newTopic, setNewTopic] = useState('')
  const [confidence, setConfidence] = useState(0)
  const [filter, setFilter] = useState('')
  const [checked, setChecked] = useState(false)
  const [selected, setSelected] = useState('')
  const [loading, setLoading] = useState(true)
  const [notify, setNotify] = useState(null)
  const [timer, setTimer] = useState(null)
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

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
    const savedUser = localStorage.getItem('loggedInUser')
    if(savedUser){
      const userToSave = JSON.parse(savedUser)
      Topics.getToken(userToSave.token)
      setUser({username: userToSave.username})
    }
  }, [])
  
  const add = () => {
    if(newTopic.trim()){
      const selected = allTopic.find(element => element.topic.trim() === newTopic.trim())
        if(selected){
          if(window.confirm(`${newTopic} already exists!, Change the confidence instead?`)){
            const newConfidence = {...selected, confidence: confidence}
            Topics.updateItem(selected.id, newConfidence)
            .then(r => {
              setAllTopic(prev => prev.map(element => element.id === selected.id ? r : element))
              showNotification(`You have updated ${r.topic}`, 'success')
              setNewTopic('')
              setConfidence(0)
            })
            .catch(error => {
              showNotification(`Error: ${error}`, 'error')
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
            showNotification(`You have added ${r.topic}`, 'success')
            setConfidence(0)
            setNewTopic('')
          })
          .catch(error => {
            showNotification('Error: Failed to add new name', 'error')
            console.log(error)
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
    showNotification(`You have ${selectedMastered.mastered ? 'mastered' : 'not mastered'} ${selectedMastered.topic}`, 'success')
    Topics.updateItem(id, selectedMastered)
    .then(r => {
      setAllTopic(prev => prev.map(el => el.id === id ? r : el))
    })
    .catch(error => {
      showNotification(`Error: ${error}`, 'error')
      setAllTopic(oldState)
    })
  }

  const confidenceOnChange = (e) => {
    const value = Number(e.target.value)
    if(value >= 0 && value <= 5){
      setConfidence(value)
    } else {
      alert('Number should be less than 5 and grater than 0')
      setConfidence(0)
    }
  }

  const incrementConfidence = (id) => {
      const topic = allTopic.find(e => e.id === id)

        if(topic.confidence >= 5){
          alert('Confidence can not go above 5')
          return
        }
          const selectedConf = {...topic, confidence: topic.confidence + 1}
          const oldState = allTopic
          setAllTopic(prev => prev.map(el => el.id === id ? selectedConf : el) )
          Topics.updateItem(id, selectedConf)
          .then(r => setAllTopic(prev => prev.map(el => el.id === id ? r : el)))
          .catch(error => {
            showNotification(`Error: ${error}`, 'error')
            setAllTopic(oldState)
          })
  }

  const decrementConfidence = (id) => {
      const topic = allTopic.find(e => e.id === id)
        if(topic.confidence <= 0){
          alert('Confidence can not go below 0')
          return
        }
          const selectedConf = {...topic, confidence: topic.confidence - 1}
          const oldState = allTopic
          setAllTopic(prev => prev.map(el => el.id === id ? selectedConf : el) )
          Topics.updateItem(id, selectedConf)
          .then(r => setAllTopic(prev => prev.map(el => el.id === id ? r : el)))
          .catch(error => {
            showNotification(`Error: ${error}`, 'error')
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
      showNotification(`Error: ${error}`, 'error')
      setAllTopic(oldState)
    })
    
  }

  const remove = (id, name) => {
    if(window.confirm(`Delete ${name}`)){
      Topics.removeItem(id)
      .then(() => {
        setAllTopic(prev => prev.filter(e => e.id !== id))
        showNotification(`You removed ${name}`, 'success')
      })
      .catch(error => {
        showNotification(`Error: ${error}`, 'error')
        console.log(error)
      })
    }
  }

  const showNotification = (message, success) => {
    if(timer){
      clearTimeout(timer)
    }
    setNotify({mes: message, type: success})
    setTimer(setTimeout(() => {
      setNotify(null)
    }, 3000))
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
        showNotification('wrong credentials', 'error')
        setUsername('')
        setPassword('')
      }
    }else{
      showNotification('Ensert both username and password', 'error')
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
  

  return (
    <>
      {user === null ? 
        <div>
          {notify && <Notification notify={notify} />}
          <LoginForm loginHandler={loginHandler} username={username} setUsername={setUsername} password={password} setPassword={setPassword} />
        </div>
        :
        <div>
          <h1>My Learning Tracker</h1>
          <p>Track your programming concept mastery</p>
          {notify && <Notification notify={notify} />}
          <LearningForm onChange={e => setNewTopic(e.target.value)} value={newTopic} onClick={add} confidenceOnChange={confidenceOnChange} confidenceValue={confidence} />
          <FilterControls remove={remove} hourChange={hourChange} incrementConfidence={incrementConfidence} decrementConfidence={decrementConfidence} reset={reset} selected={selected} selectedOnChange={e => setSelected(e.target.value)} toggle={toggleMastered} filtered={filteredTopic} filteredOnChange={e => setFilter(e.target.value)} filteredValue={filter} checked={checked} checkOnChange={e => setChecked(e.target.checked)} load={loading} activeFilter={activeFilter} />
          {allTopic.length > 0 ? <Stats total={total} /> : null}
          <button onClick={loggout}>loggout</button>
        </div>
      }
    </>
  )
}

export default App