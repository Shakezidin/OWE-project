export const firstCapitalize = (str:string)=>{
    const key = str[0].toUpperCase() + str.slice(1,str.length)
    return key
}