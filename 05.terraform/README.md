# Terraform

* [Terraform](https://www.terraform.io/)
* [Terraform Command Line](https://www.terraform.io/cli/commands)
* [Registry](https://registry.terraform.io/)
  * [Providers](https://registry.terraform.io/browse/providers)
  * [Modules](https://registry.terraform.io/browse/modules)
* [Tutorials](https://learn.hashicorp.com/terraform?utm_source=terraform_io)

透過 Terraform，可以不需要去介面上開機器，手動設定 s3 等等，只要寫好 Terraform 腳本，就可以一鍵建立所有需要的資源，並且可以透過程式碼去管理資源達到 Infrastructure as code (Iac) 的目標。

> 資源包括像是 aws eks, ecs, s3, ecr 等等..

好處包括

* 版本化管理雲端服務
* 一鍵建立雲端架構
* 團隊協作，每個人都可以根據 Terraform 腳本瞭解目前所使用的雲端服務與其設定
* 確保不同環境有相同的雲端配置 (e.g. dev, staging, prod)

透過 `variables.tf` 可以將一些參數抽出來，並定義 type

## 建立資源

```ruby
cd learn-terraform-docker-container

# init
terraform init

# Reformat config
terraform fmt

# 驗證
terraform validate

# 檢查是否有符合期望，並且顯示跟現有的設定差別
terraform plan
# ...
# Plan: 2 to add, 0 to change, 0 to destroy.

# 建立 or 更新 infrastructure
terraform apply
# open localhost:8000

terraform show

terraform state list
# docker_container.nginx
# docker_image.nginx
```

## 更改資源

更改 `external = 8000` to `external = 8080`

```ruby
# plan 可以讓你知道會有什麼改動
terraform plan

# ...
# external = 8000 -> 8080 # forces replacement
# ...
# Plan: 1 to add, 0 to change, 1 to destroy.

# 不需要停機，會自動 destroy 現有的，並建立新的
terraform apply
```

## 刪除資源

```ruby
terraform destroy
```

## 基本語法

```ruby
# provider 是決定要對哪一個平台操作 profile, region 是 aws 需要的屬性。
provider "aws" {
  profile    = "default"
  region     = "us-east-1"
}

# resource 雲端資源名稱 自定義的名稱 {
#   屬性 = 值
# }
resource "aws_instance" "example" {
  ami           = "ami-2757f631"
  instance_type = "t2.micro"
}

# output values 輸出一些資源創建後你需要的值，最常見的像是 IP
output "instance_ip_addr" {
  value = aws_instance.example.private_ip
}

# data 取得平台上對應 data
data "aws_ecr_repository" "ecr" {
  name = var.project_name
  depends_on = [
    aws_ecr_repository.ecr
  ]
}

# 定義 local 可以用的 variables
locals {
  cd_role_name_prefix = "cd_${var.project_name}"
}

# 可以共享在 Terraform Registry 的 module，並帶入自己的 variable
module "s3_bucket" {
  source = "terraform-aws-modules/s3-bucket/aws"

  # variable
  bucket = "my-s3-bucket"
  acl    = "private"

  versioning = {
    enabled = true
  }
}
```
