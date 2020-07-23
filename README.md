# requ-js

Requ-js is a simple library for handling client-side HTTP requests. It is a wrapper over Axios, but with a bit more human touch.
It works as a builder, building the endpoint along you go.
At the moment requ-js's API is very limited.

## we start building our API with

```node
this.request() // sort of like init
```

## adding our destination

```node
// .to(routeName, [routeParams])

this.request().to('articles',[authorID,articleID]) // imagine our route /articles/{authorid}/articles/{articlesID}
```

## adding extra data we might want to send

```node
let data = {
  secret_key: 'super-secret-mon-key'
}

//or

let data = new FormData
data.append('secret_key','you_know_it')

this.request()
  .to(...)
  .with(data)
```
## adding additional headers
Keep building and add on with ".headers()"

```node
...
.headers({ 'Accept': 'application/json'})
```

###
the, catch and finally or success, error, endsWith! All of them gives us a callback with the response data, and more!

```node
...
 .success((res) => {
      console.log('from-outer-layer',res)
   })
   .error((response,errorBag) => {
     console.log('from-outer-layer-error',response,errorBag)
   })
   .endsWith(() => {
     console.log('from-outer-layer-finally')
     this.loading = false
  })
```

## we have built our request step by step, now to simply send it through.

```node
this.request()
  .to('test',[1,'some-slug'])
  .with(data)
  .headers({ 'test': 'value' })
  .success((res) => {
      console.log('from-outer-layer',res)
   })
   .error((response,errorBag) => {
     console.log('from-outer-layer-error',response,errorBag)
   })
   .endsWith(() => {
     console.log('from-outer-layer-finally')
     this.loading = false
  })
  .send()
```
## don't want to send the authentication token?

just add anywhere before send()

```node
.withoutToken()
```


**incomplete & more features to come**
