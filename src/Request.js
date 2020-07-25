import axios from "axios"

import Router from "./Router"

export default class Request {

    constructor(config) {
        this.requestWithAuthorizationToken = config.requestWithAuthorizationToken
        Router.boot(config)
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
        this.endpoint = Router.getRoute(name,params || [])
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

        _log(config)

        this.request = axios(config)
            .then(res => {
               if(! this.onSuccess) {
                  return 
                }
                this.response = res
                this.data = res.data
                this.onSuccess(res.data)
            })
            .catch(err => {
                if(! this.onError) {
                  return 
                }
                this.errorBag = {
                    message: err.response.data.message,
                    errors: []
                }

                for(const prop in (err.response.data.errors || [])) {
                    if(err.response.data.errors.hasOwnProperty(prop)) {
                        this.errorBag.errors.push(...err.response.data.errors[prop])
                    }
                }

                this.onError(err.response.data,this.errorBag)
            })
            .finally(() => {
                if(!this.onCompletion) {
                  return 
                }
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


