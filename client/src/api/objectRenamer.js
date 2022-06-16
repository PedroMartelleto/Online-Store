function reverseObject(obj) {
    const newObj = {}

    for (const key of Object.keys(obj)) {
        newObj[obj[key]] = key

        if (newObj[key] instanceof Array || newObj[key] instanceof String) {
            newObj[key] = newObj[key].slice(0)
        }
    }

    return newObj
}

function renameObject(obj, renameMap) {
    if (obj == null) return null

    const newObj = Object.assign({}, obj)

    for (const fieldName of Object.keys(newObj)) {
        if (renameMap[fieldName]) {
            let value = newObj[fieldName]

            if (value instanceof Array || value instanceof String) {
                value = value.slice(0)
            }

            newObj[renameMap[fieldName]] = value
            delete newObj[fieldName]
        }
    }

    return newObj
}

export default class ObjectRenamer {
    /**
     * Maps field names used in the client to those used in the backend.
     */
    static renameMap = {
        "First name": "firstName",
        "Last name": "lastName",
        "Email address": "email",
        "Phone number": "phoneNumber",
        "Address": "address",
        "City": "city",
        "State": "state",
        "ZIP/Postal code": "zip",
        "Password": "password"
    }

    static reversedRenameMap = reverseObject(this.renameMap)
    
    /**
     * Converts field names used in the client to those used in the backend.
     * @param {Any} obj 
     */
    static toBackend(obj) {
        return renameObject(obj, this.renameMap)
    }

    /**
     * Converts field names used in the backend to those used in the client.
     * @param {Any} obj 
     */
     static fromBackend(obj) {
        return renameObject(obj, this.reversedRenameMap)
    }
}