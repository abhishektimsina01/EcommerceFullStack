import { Time } from "../interface/interfaces";

export const extractTimeFromDate = (date : Date) : Time => {
    const time : Time  =  {
        date : date.getDate(),
        day : date.getDay(),
        month : date.getMonth(),
        hours : date.getHours() > 12 ? date.getHours() - 12 : date.getHours(),
        minutes : date.getMinutes(),
        seconds : date.getSeconds()
    }
    return time
}

export const extractTimeFromString = (date : string): Time => {    
    const [hours, minutes] = date.split(":")
    return { hours : parseInt(hours), minutes : parseInt(minutes)}
}