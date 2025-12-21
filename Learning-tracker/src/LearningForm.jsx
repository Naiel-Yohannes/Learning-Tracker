const LearningForm = ({onChange, value, onClick, confidenceOnChange, confidneceValue}) => {
    return(
        <div>
            Add new topic <input type="text" value={value} onChange={onChange} />
            <br />
            Confidence: <input type="number" min={0} max={5} required onChange={confidenceOnChange} value={confidneceValue} />
            <br />
            <button onClick={onClick}>add</button>
        </div>
    )
}

export default LearningForm