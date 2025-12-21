const TopicItem = ({element, toggleOnClick, operation, hours, remove}) => {
    return(
        <div><p>{element.topic} {element.confidence} <button onClick={() => operation(element.id, '+')}>+</button> <button onClick={() => hours(element.id, '-')}>-</button> {element.id} {element.hoursStudied} <button onClick={() => hours(element.id, '+')}>+</button> <button onClick={() => hours(element.id, '-')}>-</button> {element.lastPracticed} <button onClick={toggleOnClick}>{element.mastered ? "Mark as Unmastered" : "Mark as Mastered"}</button> <button onClick={() => remove(element.id)}>Delete</button></p></div>
    )
}

export default TopicItem