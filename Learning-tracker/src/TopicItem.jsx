const TopicItem = ({element, toggleOnClick, decrementConfidence, incrementConfidence, hourChange, remove}) => {
    return(
        <div>
            <h4 className="topic">{element.topic}</h4> 
            <p className="conf">{"███".repeat(element.confidence) + "░░░".repeat(5-element.confidence)}</p> 
            <button onClick={() => incrementConfidence(element.id)} className="btnInc">+</button> 
            <button onClick={() => decrementConfidence(element.id)} className="btnDec">-</button> 
            <h4 className="hours">{element.hoursStudied}</h4> 
            <h4 className="lastP">{element.lastPracticed} </h4>
            <div className="controls">
                <button onClick={() => hourChange(element.id)} className="hourChange" >+</button> 
                <button onClick={toggleOnClick} className="toggle">{element.mastered ? "Mark as Unmastered" : "Mark as Mastered"}</button> 
                <button onClick={() => remove(element.id, element.topic)} className="delete">Delete</button>    
            </div>
        </div>
    )
}

export default TopicItem