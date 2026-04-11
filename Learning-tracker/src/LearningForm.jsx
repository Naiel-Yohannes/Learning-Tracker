const LearningForm = ({onChange, value, onClick, confidenceOnChange, confidenceValue}) => {
    return(
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Add new topic</h2>
            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                <div className="grid gap-4">
                    <label className="grid gap-1 text-sm">
                        <span className="font-medium text-slate-700">Topic</span>
                        <input className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" type="text" value={value} onChange={onChange} />
                    </label>
                    <label className="grid gap-1 text-sm">
                        <span className="font-medium text-slate-700">Confidence (0-5)</span>
                        <input className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" type="number" min={0} max={5} required onChange={confidenceOnChange} value={confidenceValue} />
                    </label>
                </div>
                <button className="h-10 rounded-md bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700 cursor-pointer" onClick={onClick}>Add topic</button>
            </div>
        </div>
    )
}

export default LearningForm