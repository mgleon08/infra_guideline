# Helm

* [helm](https://helm.sh/)
* [charts](https://artifacthub.io/) - 存放各種 charts，類似 chart 的 github

> Helm is the best way to find, share, and use software built for Kubernetes.

Helm 簡單來說是一個管理 Kubernetes 設定檔的套件，利用定義 chart 的集合，並透過參數傳遞，同時去設定及管理多個 yaml 檔案。
template 有自己的特殊語法，要去官網上看 [docs](https://helm.sh/docs/)

## 安裝

```ruby
brew install helm
```

## 建立新的 helm 專案

透過 `helm create example` 去建立，新的 helm 專案

```ruby
helm create example

├── Chart.yaml  # 定義 Chart 的 Metadata，包括 Chart 的版本、名稱、敘述等
├── charts      # 在這個資料夾裡可以放其他的 Chart，這裡稱作 SubCharts
├── templates   # 定義 Chart 服務需要的 k8s 元件，並透過參數的方式帶入
│   ├── NOTES.txt
│   ├── _helpers.tpl        # 定義一些 template 可以用的 value (ex. demo.selectorLabels)
│   ├── deployment.yaml
│   ├── hpa.yaml            # HorizontalPodAutoscaler 水平自動擴展
│   ├── ingress.yaml
│   ├── service.yaml
│   ├── serviceaccount.yaml # ServiceAccount 配置 Pod 的服務帳號 (ex. aws account..)
│   └── tests
│       └── test-connection.yaml
└── values.yaml # 定義 Chart 的所有參數，這些參數都會被代入在 templates 中的元件
```

將 `03.kubernetes/ingress/demo` 修改成 helm 的版本

* [deployment](/04.helm//demo/templates/deployment.yaml)
* [service](/04.helm//demo/templates/service.yaml)
* [ingress](/04.helm//demo/templates/ingress.yaml)

```ruby
cd demo

# 檢查 chart
helm lint .

# 安裝
helm install demo-chart .

helm list
# NAME      	NAMESPACE	REVISION	UPDATED                             	STATUS  	CHART     	APP VERSION
# demo-chart	default  	1       	2022-03-28 16:30:24.767527 +0800 CST	deployed	demo-0.1.0	1.16.0

# uninstall
helm uninstall demo-chart

# 打包並壓縮
helm package .
```
