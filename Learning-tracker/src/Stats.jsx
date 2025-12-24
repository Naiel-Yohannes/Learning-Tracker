import RelativeTime from "./RelativeTime"

const Stats = ({total}) => {
    return(
        <div>
            <p>Total number of topics: {total.totalTopic}</p>
            <p>Total hours studied: {total.totalHoursStudied}</p>
            <p>Most practiced topic: {total.mostPracticed.topic}</p>
            <p>Average amount of confidence: {total.averageConfidence} / 5</p>
            <p>Number of mastered topics: {total.masteredCount} ({total.masteredPercentage} %)</p>
        </div>
    )
}

export default Stats