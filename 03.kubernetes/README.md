# Kubernetes (K8s)

* [kubernetes](https://kubernetes.io/)
* [kubernetes Tools](https://kubernetes.io/docs/tasks/tools/)
  * kubectl - The Kubernetes command-line tool
  * minikube - Run Kubernetes locally

Kubernetes（K8S）是一個可以幫助我們管理微服務（microservices）的系統，他可以自動化地部署及管理多台機器上的多個容器（Container）。

* 同時部署多個容器到多台機器上（Deployment）
* 服務的乘載量有變化時，可以對容器做自動擴展（Scaling）
* 管理多個容器的狀態，自動偵測並重啟故障的容器（Management）

## Kubernetes 架構

<img src="https://miro.medium.com/max/1400/1*kSRH4T8S1YmAuHbpgQ3Ylw.png" align="center">

### Master Node

* 大總管，可做為主節點。
* 主要負責管理叢集，協調所有在叢集的活動，像是調度應用程式、保持應用程式的狀態，擴展應用程式，以及滾動更新。
* [Kubernetes Components](https://kubernetes.io/docs/concepts/overview/components/)
  * `kube-apiserver`
    * 管理整個 Kubernetes 所需 API 的接口（Endpoint)，例如從 Command Line 下 kubectl 指令就會把指令送到這裏。
  * `kube-controller-manager`
    * 負責管理並運行 Kubernetes controller 的組件，簡單來說 controller 就是 Kubernetes 裡一個個負責監視 Cluster 狀態的 Process，例如：Node Controller、Replication Controller。
  * `kube-scheduler`
    * Kubernetes 的 Pods 調度員，用來監控沒被指定跑在哪個 Node 的 Pod。
  * `etcd`
    * 用來存放 Kubernetes Cluster 的資料作為備份。

### Worker Node

* Kubernetes 運作的最小硬體單位，一個 Worker Node（簡稱 Node）對應到一台機器，可以是實體機如你的筆電、或是虛擬機如 AWS 上的一台 EC2 或 GCP 上的一台 Computer Engine。
* 每個 Node 包含
  * `kubelet`
    * 該 Node 的管理員，負責管理該 Node 上的所有 Pods 的狀態並負責與 Master 溝通
  * ` kube-proxy`
    * 該 Node 的傳訊員，負責更新 Node 的 iptables，讓 Kubernetes 中不在該 Node 的其他物件可以得知該 Node 上所有 Pods 的最新狀態
  * `Container Runtime`
    * Node 真正負責容器執行的程式，以 Docker 容器為例其對應的 Container Runtime 就是 Docker Engine

### Pod

* Kubernetes 運作的最小單位，一個 Pod 對應到一個應用服務（Application）。

### Cluster

* Kubernetes 中多個 Node 與 Master 的集合。
* 基本上可以想成在同一個環境裡所有 Node 集合在一起的單位。

# Local 測試

透過 minikube 在本機端建立 Kubernetes

## 安裝 minikube tool

```ruby
brew install minikube
```

使用 virtualbox driver (預設會使用 docker driver)，安裝 [virtualbox](https://minikube.sigs.k8s.io/docs/drivers/virtualbox/)

(docker driver 在 expose ip 會沒辦法 access [issue link](https://stackoverflow.com/questions/63600378/cant-access-minikube-service-using-nodeport-from-host-on-mac))

## 透過 minikube 建立 Kubernetes

> 第一次啟動會自動建立下載映像檔來建立 VM 所以會比較久

```ruby
# 啟用 minkkube 叢集
minikube start --driver=virtualbox

# 停用 minkkube 叢集
minikube stop

# 查看狀態
minikube status

# 啟用 GUI dashboard
minikube dashboard

# 查看 minikube 安裝位置 /usr/local/bin/minikube
where minikube

# minikube version: v0.32.0
minikube version

# ssh 進去
minikube ssh

# 查詢對外 ip
minikube ip
```

啟動 minikube 之後，HOME 目錄會多一個 .kube 的資料夾，而 kubectl 就是透過該資料夾底下的 configuration 與 minikube 溝通

```ruby
# 每個 contexts 都是不同的 kubernetes
kubectl config get-contexts
```

## 透過 yaml 來建立 Pod

列出所有 kind 類型

```ruby
kubectl api-resources
```

透過 kubectl 建立 Pod，使用 `01.docker` push 上去的 image 來測試

```ruby
# 透過 kind pod yaml 來建立
kubectl create -f kubernetes-demo-pod.yaml

kubectl get pods
# NAME                  READY   STATUS    RESTARTS   AGE
# kubernetes-demo-pod   1/1     Running   0          41s
```

查看 pod

```ruby
# 當 pod 啟動有失敗時，可以看到建置的步驟哪邊錯誤
kubectl describe pods kubernetes-demo-pod
```

接著讓 local 和 pod 的 port 對應

```ruby
kubectl port-forward kubernetes-demo-pod 3000:3000

# http://localhost:3000/
```

## 使用 Service、Ingress、Deployment

### [Service](https://kubernetes.io/docs/concepts/services-networking/service/)

在上面需要透過 `port-forward` 讓 local 可以連線到 pod，這時候就可以改用 service 來定義 pod 要如何 `被連線和存取`。

<img src="http://sonicguo.com/2020/k8s-port-targetport-nodeport/figure4.png" align="center">

```ruby
kubectl create -f service.yaml

kubectl get services demo-service
# NAME           TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
# demo-service   NodePort    10.104.70.204   <none>        3001:30390/TCP   5s

# ssh 進去
minikube ssh
# <CLUSTER-IP>:<port>
curl 10.104.70.204:3001

# 外部進去
minikube service demo-service --url
# http://192.168.59.100:30390
```

### [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)

可用於控制 pod，並且可以橫向擴展，複製多個相同的 Pod 在 Cluster 中同時提供服務，並監控如果有 Pod 當機，就將它重新啟動，還有一些版本控制。

```ruby
# 將原本的 pod 刪掉
kubectl delete -f kubernetes-demo-pod.yaml

# 改用 deployment 來控制 pod
kubectl create -f deployment.yaml

kubectl get deploy
# NAME              READY   UP-TO-DATE   AVAILABLE   AGE
# demo-deployment   3/3     3            3           14s

kubectl get pods
# NAME                               READY   STATUS    RESTARTS   AGE
# demo-deployment-78b7d7fc76-57jmn   1/1     Running   0          7s
# demo-deployment-78b7d7fc76-ksz4t   1/1     Running   0          5s
# demo-deployment-78b7d7fc76-q5ppg   1/1     Running   0          3s

# 更改 deployment 內容，有更改會自動重啟
kubectl edit deployment demo-deployment

# 重啟 pod
kubectl rollout restart deploy/demo-deployment

# 也可以透過 rollout 來控制版本
kubectl rollout history deployment demo-deployment
# 回到上一版
kubectl rollout undo deploy demo-deployment
# 指定版本
kubectl rollout undo deploy demo-deployment --to-revision=2
```

### [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/)

而 Ingress 可以透過 HTTP/HTTPS，可在多個 Service 前搭建一個 reverse-proxy。
統一一個對外的 port number，並且根據 hostname 或是 pathname 決定封包要轉發到哪個 Service 上

<img src="https://www.armosec.io/wp-content/uploads/2021/11/617fae2d495f2526b09ce6fd_k8s-ingress-01-100841247-large.jpg" align="center">

先啟動 minikube ingress

```ruby
minikube addons enable ingress
```

```ruby
# 刪除原本建立的
kubectl delete -f deployment.yaml
kubectl delete -f service.yaml

kubectl create -f ingress-demo/deployment.yaml
kubectl create -f ingress-demo/service.yaml
kubectl create -f ingress-demo/ingress.yaml

kubectl get deploy
# NAME     READY   UP-TO-DATE   AVAILABLE   AGE
# demo-1   2/2     2            2           92m
# demo-2   2/2     2            2           92m

kubectl get pods
# NAME                      READY   STATUS    RESTARTS   AGE
# demo-1-69478dd745-nsj4b   1/1     Running   0          92m
# demo-1-69478dd745-wl29p   1/1     Running   0          92m
# demo-2-6f4b7df4c6-gs47h   1/1     Running   0          92m
# demo-2-6f4b7df4c6-p55dj   1/1     Running   0          92m

kubectl get services
# NAME             TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
# demo-1-service   NodePort    10.108.213.198   <none>        80:30245/TCP   38m
# demo-2-service   NodePort    10.108.33.146    <none>        80:31404/TCP   38m

kubectl get ingress
# NAME           CLASS   HOSTS                   ADDRESS          PORTS   AGE
# demo-ingress   nginx   demo-1.com,demo-2.com   192.168.59.100   80      38m

minikube ip
# 192.168.59.100
```

將 domain mapping 到 minikube ip

```
echo 192.168.59.100 demo-1.com  >> /etc/hosts
echo 192.168.59.100 demo-2.com >> /etc/hosts
```

## Base command

```ruby
# 查看詳細資料, pod, service, ingress
kubectl describe pods demo-1-69478dd745-nsj4b

# 編輯內容, pod, service, ingress
kubectl edit pods demo-1-69478dd745-nsj4b

# 檢查副本
kubectl get replicasets

# 取得目前所有的 pod
kubectl get pods

# 顯示全部的 pod
kubectl get pods --show-all

# pod 詳細資料
kubectl describe pod <pod>

# 將 Pod 中指定的 port number expose 出來讓外部服務存取(建立一個新的 Service 物件)
kubectl expose pod <pod> --port=<port> --name=<service-name>

# 將 Pod 中指定的 port number mapping 到本機端的某一特定 port number
kubectl port-forward <pod> <external-port>:<pod-port>

# 進到 container 裡面
kubectl attach <pod> -i

# 對 pod 下指令
kubectl exec <pod> -- <command>

# 顯示所有 labels
kubectl get pods  --show-labels
```
