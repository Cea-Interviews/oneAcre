const toDate = (values) => {
    return values.map(value => {
        if(value.EndDate !== null){
            return ({...value, StartDate: new Date(value.StartDate).toLocaleDateString(), EndDate: new Date(value.EndDate).toLocaleDateString() })
        }
        return ({...value, StartDate: new Date(value.StartDate).toLocaleDateString(), EndDate: 0})
     })
}
const toNumber = (values) => {
return values.map(value => ({ ...value , TotalRepaid: Number(value.TotalRepaid), TotalCredit:Number(value.TotalCredit) }))
}

module.exports={toDate, toNumber}