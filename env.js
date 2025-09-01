function loadEnv() {
    return readRows("env").reduce((prev, current)=>{
        prev[current['id']] = current['value']
    }, {})
}