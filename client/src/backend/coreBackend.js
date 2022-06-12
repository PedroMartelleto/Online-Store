import axios from "axios"

const ENDPOINT = "https://bookstore-intro-web-dev.herokuapp.com/api/"

export default class CoreBackend {
    static userToken = null

    static currentUser() {
        if (!this.userToken)
        {
         }
        
        return this.userToken.user
    }

    static login(email, password)
    {
        axios.post(ENDPOINT + "login", {
            email: "hello@hello.com",
            password: "password",
        }, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            }
        }).then(response => {
            console.log(response.data)
        })
        


        /*let now = new Date()
        let time = now.getTime()
        let expireTime = time + 1000*36000
        now.setTime(expireTime)
        document.cookie = 'cookie=ok;expires=' + now.toUTCString() + ';path=/'*/
    }

    static createUser()
    {

    }

    static logout()
    {
        
    }
}