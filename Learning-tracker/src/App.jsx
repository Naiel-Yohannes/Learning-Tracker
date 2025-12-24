import { useState } from "react"
import LearningForm from "./LearningForm"
import FilterControls from "./FilterControls"
import Stats from "./Stats"

function App() {
  const [allTopic, setAllTopic] = useState([{
    id: 1,
    topic: "Array Methods",
    hoursStudied: 12,
    confidence: 0,
    mastered: false,
    lastPracticed: "2024-01-15"
  },
  {
    id: 2,
    topic: "React State",
    hoursStudied: 5,
    confidence: 0,
    mastered: false,
    lastPracticed: "2024-01-13"
  },
  {
    id: 3,
    topic: "useEffect Hook",
    hoursStudied: 2,
    confidence: 0,
    mastered: false,
    lastPracticed: "2024-01-08"
  }])
  const [newTopic, setNewTopic] = useState('')
  const [confidence, setConfidence] = useState(0)
  const [filter, setFilter] = useState('')
  const [checked, setChecked] = useState(false)
  const [selected, setSelected] = useState('')

  const add = () => {
    if(newTopic.trim()){
      const newValue = {
        id: Date.now(),
        topic: newTopic,
        hoursStudied: 0,
        confidence: confidence,
        mastered: false,
        lastPracticed: new Date().toISOString().split('T')[0]
      }
      

      setAllTopic(allTopic.concat(newValue))
      setConfidence(0)
      setNewTopic('')
    }
  }
  const filteredTopic = allTopic.filter(t => {
    const searchAll = t.topic.toLowerCase().includes(filter.toLowerCase())
    const filterToggled = !checked || t.mastered
    const filterConfidence = t.confidence.toString() === selected || !selected

    return searchAll && filterConfidence && filterToggled
  })

  const reset = () => {
    setChecked(false)
    setSelected('')
    setFilter('')
  }

  const toggleMastered = (id) => {
    setAllTopic(allTopic.map(e => e.id === id ? {...e, mastered: !e.mastered} : e))
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
    setAllTopic(allTopic.map(e => e.id === id && e.confidence < 5 ? {...e, confidence: e.confidence + 1} : e))
  }

  const decrementConfidence = (id) => {
    setAllTopic(allTopic.map(e => e.id === id && e.confidence > 0 ? {...e, confidence: e.confidence - 1} : e))
  }

  const hourChange = (id) => {
    setAllTopic(allTopic.map(e => e.id === id ? {...e, hoursStudied: e.hoursStudied + 1, lastPracticed: new Date().toISOString().split('T')[0]} : e))
  }

  const remove = (id, name) => {
    if(window.confirm(`Delete ${name}`)){
      setAllTopic(allTopic.filter(t => t.id !== id))
    }
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
      <h1>My Learning Tracker</h1>
      <p>Track your programming concept mastery</p>

      <LearningForm onChange={e => setNewTopic(e.target.value)} value={newTopic} onClick={add} confidenceOnChange={confidenceOnChange} confidenceValue={confidence} />
      <FilterControls remove={remove} hourChange={hourChange} incrementConfidence={incrementConfidence} decrementConfidence={decrementConfidence} reset={reset} selected={selected} selectedOnChange={e => setSelected(e.target.value)} toggle={toggleMastered} filtered={filteredTopic} filteredOnChange={e => setFilter(e.target.value)} filteredValue={filter} checked={checked} checkOnChange={e => setChecked(e.target.checked)} />
      <Stats total={total} />
    </>
  )
}

export default App