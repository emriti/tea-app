Hi All,

I'm trying to learn about multipath in Kubernetes Ingress. First of all, I'm using minikube for this tutorial, I created a simple Web API using node js.

## NodeJS Code
In this nodeJS, I created a simple Web API, with routing and controller

### server.js
```javascript
const express = require ('express');
const routes = require('./routes/tea'); // import the routes

const app = express();

app.use(express.json());

app.use('/', routes); //to use the routes

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})
```
### routes/tea.js
```javascript
const express = require('express');
const router  = express.Router();
const teaController = require('../controllers/tea');

router.get('/tea', teaController.getAllTea);
router.post('/tea', teaController.newTea);
router.delete('/tea', teaController.deleteAllTea);

router.get('/tea/:name', teaController.getOneTea);
router.post('/tea/:name', teaController.newComment);
router.delete('/tea/:name', teaController.deleteOneTea);

module.exports = router;
```

### controllers/tea.js
```javascript
const os = require('os');

//GET '/tea'
const getAllTea = (req, res, next) => {
    res.json({message: "GET all tea, " + os.hostname() });
};

//POST '/tea'
const newTea = (req, res, next) => {
    res.json({message: "POST new tea, " + os.hostname()});
};

//DELETE '/tea'
const deleteAllTea = (req, res, next) => {
    res.json({message: "DELETE all tea, " + os.hostname()});
};

//GET '/tea/:name'
const getOneTea = (req, res, next) => {
    res.json({message: "GET 1 tea, os: " + os.hostname() + ", name: " + req.params.name});
};

//POST '/tea/:name'
const newComment = (req, res, next) => {
    res.json({message: "POST 1 tea comment, os: " + os.hostname() + ", name: " + req.params.name});
};

//DELETE '/tea/:name'
const deleteOneTea = (req, res, next) => {
    res.json({message: "DELETE 1 tea, os: " + os.hostname() + ", name: " + req.params.name});
};

//export controller functions
module.exports = {
    getAllTea, 
    newTea,
    deleteAllTea,
    getOneTea,
    newComment,
    deleteOneTea
};
```


### Dockerfile
After that I created a docker image using this Dockerfile
```docker
FROM node:18.9.1-slim
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "node", "server.js" ]
```

## Kubernetes Manifest
And then, I created replicaset and service for this docker image

### foo-replicaset.yaml
```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: foo
spec:
  selector:
    matchLabels:
      app: foo
  replicas: 3
  template:
    metadata:
      labels:
        app: foo
    spec:
      containers:
        - name: foo
          image: emriti/tea-app:1.0.0
          ports:
            - name: http
              containerPort: 3000
              protocol: TCP

```

### foo-svc-nodeport.yaml
```yaml
apiVersion: v1
kind: Service
metadata:
  name: foo-nodeport
spec:
  type: NodePort
  ports:
    - port: 3000
      targetPort: 3000
      nodePort: 31234
  selector:
    app: foo
```

### all-ingress.yaml
Ingress for both Foo and Bar backend
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: foobar
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /$1
spec:
  rules:
    - host: foobar.com
      http:
        paths:
          - path: /foo
            pathType: Prefix
            backend:
              service:
                name: foo-nodeport
                port:
                  number: 3000  
          - path: /bar
            pathType: Prefix
            backend:
              service:
                name: bar-nodeport
                port:
                  number: 3000  
```

## Additional setup
I also did these:
- add `127.0.0.1 foobar.com` to /etc/hosts
- running `minikube tunnel`

After that I run `curl foobar.com/tea` and I get this error: 
```console
curl : Cannot GET /
At line:1 char:1
+ curl foobar.com/foo
+ ~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : InvalidOperation: (System.Net.HttpWebRequest:HttpWebRequest) [Invoke-WebRequest], WebException
    + FullyQualifiedErrorId : WebCmdletWebResponseException,Microsoft.PowerShell.Commands.InvokeWebRequestCommand
```

I'm wondering if maybe someone has experienced a similar problem that I did and maybe already had the answer for that. Secondly how to debug the ingress if I meet similar issues?

The codes and manifest could be accessed on this [repo](https://github.com/emriti/tea-app)

Thank you!