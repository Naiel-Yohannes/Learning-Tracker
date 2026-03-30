const info = (...parms) => {
    console.log(...parms)
}

const errorInfo = (...parms) => {
    console.error(...parms)
}

module.exports = { errorInfo, info }