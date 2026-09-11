
export const checkKeyAndValue = <T extends Record<string, unknown>>(obj : T, key : keyof T) => {
    if(Object.hasOwn(obj, key)){
        return obj[key]
    }
}

export const extractKeysFromObj = <T extends object>(obj : T, keys : string | string[] ): Record<string, unknown> => {
    let newObj : Record<string, unknown> = {}
    if(Object.keys(obj).length != 0){
        if(Array.isArray(keys)){
            if(keys.length > 0){
                for(let key of keys){
                    if((obj as Record<string, unknown>)[key] != undefined){
                        newObj[key] = (obj as Record<string, unknown>)[key]
                    }
                }
                return newObj
            }
            return newObj
        }
        else{
            if((obj as Record<string, unknown>)[keys] != undefined){
                newObj[keys] = (obj as Record<string, unknown>)[keys]
            }
            return newObj
        }
    }
    else{
        return newObj
    }
}