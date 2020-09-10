# recipe-book

> A recipe book which can show each recipe's ingredient and managing/editing this list content

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## Add config
- install dependencies
```bash
    # update npm
    npm install -g npm
    # install firebase and add it into package.json
    npm install firebase --save
```

- create config and app instance
```javascript
// build init.js file (src/firebase/init.js)
// The content of init.js would like these below

      import firebase from "firebase";
      // 依據想要使用的firebase service來import
      import "firebase/firestore";

      var firebaseConfig = {
            ...(copy from firebase SDK configuration)
      };

      // app initialization
      const firebaseApp = firebase.initializeApp(firebaseConfig);
      // 建立想要的服務instance(firestore)，讓他可以被任意名稱引入到想要的component中
      export default firebase.firestore()
```
For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
