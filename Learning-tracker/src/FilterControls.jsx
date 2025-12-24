import TopicItem from "./TopicItem"

const FilterControls = ({toggle, decrementConfidence, incrementConfidence, hourChange, filteredOnChange, filteredValue, filtered, checked, checkOnChange, selected, selectedOnChange, reset, remove}) => {
    
    return(
        <div>
            <input type="checkbox" checked={checked} onChange={checkOnChange} /> Show mastered topics?

            <br />
            confidence: 
            <select value={selected} onChange={selectedOnChange} >
                <option value="">All</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
            </select>
            <br />
            Search: <input type="text" onChange={filteredOnChange} value={filteredValue} />

            
            {filtered.map(element => (
                <TopicItem key={element.id} element={element} toggleOnClick={() => toggle(element.id)} remove={remove} decrementConfidence={decrementConfidence} incrementConfidence={incrementConfidence} hourChange={hourChange}/>
            ))}

            <br />
            <button onClick={reset}>Reset filter</button>
        </div>
    )
}

export default FilterControls