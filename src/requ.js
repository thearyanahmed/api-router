import axios from 'axios'

class Request {

    constructor() {
        this.requestWithAuthorizationToken = true
    }

    success(callback) {
        this.onSuccess = callback
        return this
    }

    error(callback) {
        this.onError = callback
        return this
    }

    endsWith(callback) {
        this.onCompletion = callback
        return this
    }

    to(name,params) {
        this.endpoint = route(name,params)
        return this
    }

    with(requestData) {
        this.requestData = requestData
        return this
    }

    headers(data = {}) {
        this.requestHeaders = data
        return this
    }
    withoutToken() {
        this.requestWithAuthorizationToken = false
        return this
    }

    /**
     * Send the actual request.
     *
     * @returns {Promise<void>}
     */
    send() {

        let headers = {
            'Accept': 'application/json',
            ...this.requestHeaders
        }

        if(! this.requestWithAuthorizationToken) {
            delete headers['Authorization']
        } else {
            headers.Authorization = 'Bearer ' + this.getToken()
        }

        const data = this.requestData

        const config = {
            headers: headers,
            url: this.endpoint.abs,
            params: data,
            method: this.endpoint.method,
        }

        this.request = axios(config)
            .then(res => {
                this.response = res
                this.data = res.data
                this.onSuccess(res.data)
            })
            .catch(err => {
                    this.errorBag = {
                    message: err.response.data.message,
                    errors: ['one','two']
                }
                this.onError(err.response.data,this.errorBag)
            })
            .finally(() => {
                this.onCompletion()
            })

        return this.request
    }

    getToken() {

        let token = localStorage.getItem('token')

        if (token) {
            return JSON.parse(token).token
        }

        return null
    }
}

export default {
    methods: {
        /**
         * Create a base Axios request and configure the defaults.
         *
         * @returns {Request}
         */
        request() {
            return new Request
        }
    },
}
