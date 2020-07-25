export default class Router {

    static boot({ routes, baseUrl, domainPort, apiPrefix }) {
        this.routes = routes
        this.setUpRouter({ baseUrl,domainPort, apiPrefix })
    }

    static setUpRouter({baseUrl, domainPort, apiPrefix}) {
        this.apiURL = baseUrl
        if(domainPort) {
            this.apiURL = this.apiURL + ':' + domainPort
        }
        if(apiPrefix) {
            this.apiURL = this.apiURL + '/' + apiPrefix
        }
    }

    static getRoute(name, ...params ) {
        let route = Object.assign({}, this.findRoute(name));

        if(!route) {
            return null
        }
        let path = route.path

        path = this.parseRouteStrings(path,[].concat.apply([], params[0]))

        route.path = path
        route.abs = this.apiURL + path

        return route
    }

    static findRoute(name) {
        return this.routes.find( route => route.name === name) || null
    }

    static parseRouteStrings(routeString,params) {
        params.forEach(param => {
            routeString = routeString.replace(/{.*?}/,param)
        })
        return routeString
    }

    static buildQuery(url, { page, perPage, query } ) {

        if(url || perPage || query) {
            url += '?'
        }

        if(page) {
            url += '&page=' + page
        }

        if(perPage) {
            url += '&per_page=' + perPage
        }

        if(query) {
            for(const key in query) {
                if(query.hasOwnProperty(key)) {
                    url += `&${key}=${query[key]}`
                }
            }
        }
        return url
    }

}
