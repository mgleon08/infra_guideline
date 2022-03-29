# Helm

* [Helm](https://helm.sh/)
* [Helm Commands](https://helm.sh/docs/helm/)
* [Charts](https://artifacthub.io/) - 存放各種 charts，類似 chart 的 github

> Helm is the best way to find, share, and use software built for Kubernetes.

Helm 簡單來說是一個管理 Kubernetes 設定檔的套件，利用定義 chart 的集合，並透過參數傳遞，同時去設定及管理多個 yaml 檔案。
template 有自己的特殊語法，要去官網上看 [docs](https://helm.sh/docs/)

## 安裝

```ruby
brew install helm
```

## 建立新的 helm 專案

透過 `helm create example` 去建立，新的 helm 專案 (example 為範例單純用 helm create 會有哪些檔案)

```ruby
helm create example

├── Chart.yaml              # 定義 Chart 的 Metadata，包括 Chart 的版本、名稱、敘述等
├── charts                  # 在這個資料夾裡可以放其他的 Chart，這裡稱作 SubCharts
├── templates               # 定義 Chart 服務需要的 k8s 元件，並透過參數的方式帶入
│   ├── NOTES.txt           # 一份文檔，通常被用於顯示 install 後被帶入的參數值
│   ├── _helpers.tpl        # 可以將 chart.yml 或 value.yml 加工後變成新變數 (ex. demo.selectorLabels)
│   ├── deployment.yaml
│   ├── hpa.yaml            # HorizontalPodAutoscaler 水平自動擴展
│   ├── ingress.yaml
│   ├── service.yaml
│   ├── serviceaccount.yaml # ServiceAccount 配置 Pod 的服務帳號 (ex. aws account..)
│   └── tests
│       └── test-connection.yaml
└── values.yaml # 定義 Chart 的所有參數，這些參數都會被代入在 templates 中的元件
```

這邊我們自己一個一個建立，並將 `03.kubernetes/ingress/demo` 修改成 helm 的版本，放在 demo/ 裏面

* [deployment](/04.helm//demo/templates/deployment.yaml)
* [service](/04.helm//demo/templates/service.yaml)
* [ingress](/04.helm//demo/templates/ingress.yaml)

並透過 values.yaml 來給予參數建立

```ruby
cd demo

# 檢查 chart
helm lint .

# 安裝
helm install demo-chart .
# http://demo-1.com/

helm list
# NAME      	NAMESPACE	REVISION	UPDATED                             	STATUS  	CHART     	APP VERSION
# demo-chart	default  	1       	2022-03-28 16:30:24.767527 +0800 CST	deployed	demo-0.1.0	1.16.0

# 打包並壓縮
helm package .

# 透過同一份 chart，建立 demo-2
helm install demo-2-chart -f values-2.yaml .
# http://demo-2.com/

helm list
# NAME        	NAMESPACE	REVISION	UPDATED                             	STATUS  	CHART     	APP VERSION
# demo-2-chart	default  	1       	2022-03-29 15:16:22.988235 +0800 CST	deployed	demo-0.1.0	1.16.0
# demo-chart  	default  	1       	2022-03-29 15:15:17.621671 +0800 CST	deployed	demo-0.1.0	1.16.0

# uninstall
helm uninstall demo-chart
helm uninstall demo-2-chart
```
