const TopicItem = ({element, toggleOnClick, decrementConfidence, incrementConfidence, hourChange, remove}) => {
    return(
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
                <h4 className="text-lg font-semibold text-slate-900">{element.topic}</h4>
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${element.mastered ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                    {element.mastered ? "Mastered" : "In progress"}
                </span>
            </div>
            <p className="mt-2 font-mono text-sm text-slate-600">{"███".repeat(element.confidence) + "░░░".repeat(5-element.confidence)}</p>
            <div className="mt-3 flex flex-wrap gap-2">
                <button className="rounded-md border border-slate-300 px-3 py-1.5 text-sm transition hover:bg-slate-100 cursor-pointer" onClick={() => incrementConfidence(element.id)}>Confidence +</button>
                <button className="rounded-md border border-slate-300 px-3 py-1.5 text-sm transition hover:bg-slate-100 cursor-pointer" onClick={() => decrementConfidence(element.id)}>Confidence -</button>
            </div>
            <p className="mt-3 text-sm text-slate-700">Hours studied: <span className="font-semibold">{element.hoursStudied}</span></p>
            <p className="text-sm text-slate-600">Last practiced: {element.lastPracticed}</p>
            <div className="mt-4 flex flex-wrap gap-2">
                <button className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 cursor-pointer" onClick={() => hourChange(element.id)}>Hours +</button>
                <button className="rounded-md bg-slate-700 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800 cursor-pointer" onClick={toggleOnClick}>{element.mastered ? "Mark as unmastered" : "Mark as mastered"}</button>
                <button className="rounded-md bg-rose-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-rose-700 cursor-pointer" onClick={() => remove(element.id, element.topic)}>Delete</button>
            </div>
        </div>
    )
}

export default TopicItem