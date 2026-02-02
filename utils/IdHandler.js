module.exports = {
    getMaxID: function (data) {
        if (!data || data.length === 0) {
            return 0;
        }
        
        let ids = data.map(e => {
            return e.id
        })
        return Math.max(...ids)
    }
}