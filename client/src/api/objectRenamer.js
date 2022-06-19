function reverseObject(obj) {
    const newObj = {}

    for (const key of Object.keys(obj)) {
        newObj[obj[key]] = key

        const el = newObj[key]

        if (Array.isArray(el) || el instanceof String || typeof el === 'string') {
            newObj[key] = newObj[key].slice(0)
        }
    }

    return newObj
}

function renameObject(obj, renameMap) {
    if (obj == null) return null

    const newObj = Object.assign({}, obj)

    for (const fieldName of Object.keys(newObj)) {
        if (renameMap[fieldName] != null && renameMap[fieldName] !== fieldName) {
            let value = newObj[fieldName]

            if (Array.isArray(value) || value instanceof String || typeof value === 'string') {
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
        "Password": "password",
        "Card number": "cardNumber",
        "Expiration date": "expirationDate",
        "CVC": "CVC",
        "Card holder": "cardHolder"
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