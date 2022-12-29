module.exports = {
    todate(){
        let formatDate = new Date().toISOString().slice(0,10)
        return formatDate
    }
}