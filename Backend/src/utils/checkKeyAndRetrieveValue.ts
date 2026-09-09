export const checkKeyAndValue = (obj : Object, key : string) => {
    if(Object.hasOwn(obj, key)){
        return obj[key]
    }
}

export const compareAndRetrieveValue = (givenObj : object, dbObj : object) => {
    
}