const Stats = ({total}) => {
    return(
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-base font-semibold text-slate-900">Overview</h3>
            <div className="grid gap-3 text-sm text-slate-700 md:grid-cols-2">
                <p>Total topics: <span className="font-semibold">{total.totalTopic}</span></p>
                <p>Total hours studied: <span className="font-semibold">{total.totalHoursStudied}</span></p>
                <p>Most practiced topic: <span className="font-semibold">{total.mostPracticed.topic}</span></p>
                <p>Average confidence: <span className="font-semibold">{total.averageConfidence} / 5</span></p>
                <p className="md:col-span-2">Mastered topics: <span className="font-semibold">{total.masteredCount} ({total.masteredPercentage}%)</span></p>
            </div>
        </div>
    )
}

export default Stats