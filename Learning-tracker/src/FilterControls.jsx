import TopicItem from "./TopicItem"

const FilterControls = ({load, toggle, decrementConfidence, incrementConfidence, hourChange, filteredOnChange, filteredValue, filtered, checked, checkOnChange, selected, selectedOnChange, reset, remove, activeFilter}) => {
    
    return(
        <div className="mt-6 grid gap-5">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-base font-semibold text-slate-900">Filter topics</h3>
                <div className="grid gap-4 md:grid-cols-3">
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                        <input className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" type="checkbox" checked={checked} onChange={checkOnChange} />
                        Show mastered only
                    </label>
                    <label className="grid gap-1 text-sm">
                        <span className="font-medium text-slate-700">Confidence</span>
                        <select className="rounded-md border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" value={selected} onChange={selectedOnChange} >
                            <option value="">All</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </label>
                    <label className="grid gap-1 text-sm">
                        <span className="font-medium text-slate-700">Search</span>
                        <input className="rounded-md border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" type="text" onChange={filteredOnChange} value={filteredValue} />
                    </label>
                </div>
                {activeFilter ? <button className="mt-4 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 cursor-pointer" onClick={reset}>Reset filter</button> : null}
            </div>

            {load ?
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">Loading...</div>
            : <div className="grid gap-4">{filtered.map(element => (
                <TopicItem key={element.id} element={element} toggleOnClick={() => toggle(element.id)} remove={remove} decrementConfidence={decrementConfidence} incrementConfidence={incrementConfidence} hourChange={hourChange}/>
            ))}</div>}
        </div>
    )
}

export default FilterControls