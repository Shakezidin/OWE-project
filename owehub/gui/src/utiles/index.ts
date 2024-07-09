import { postCaller } from "../infrastructure/web_api/services/apiUrl"

export const firstCapitalize = (str:string)=>{
    const key = str[0].toUpperCase() + str.slice(1,str.length)
    return key
}
export const sendMail = ({toMail,message,subject}:{toMail:string,message:string,subject:string}) =>{
    return postCaller("sendmail",{subject,message,to_mail:toMail})
}