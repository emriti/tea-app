# Tea-App
Sample Web API application that built using NodeJs. Containerized using Docker dan Kubernetes, also support reverse proxy. This app was running using minikube.

## How to run
- `minikube start` (Optional)
- Built your docker image 
  - `docker build -t <your docker hub account>/tea-app:1.2.0 .`
  - `docker push <your docker hub account>/tea-app:1.2.0`
- `cd .\tea-app\manifest`
- Update your images in both replicasets
  - For example: 
  ```kubernetes
        - name: bar
          image: <your docker hub account>/tea-app:1.2.0
  ```
- Create Replicasets
  - `kubectl create -f .\foo-replicaset.yaml`
  - `kubectl create -f .\bar-replicaset.yaml`
- Create Services
  - `kubectl create -f .\foo-svc-nodeport.yaml`
  - `kubectl create -f .\bar-svc-nodeport.yaml`
- Create Ingress
  - `kubectl create -f .\all-ingress.yaml`
- Add `127.0.0.1 foobar.com` to /etc/hosts
- Running `minikube tunnel` (Optional)
- Do `curl foobar.com/bar/tea/2`