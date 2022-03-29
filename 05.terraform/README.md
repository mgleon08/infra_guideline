# Terraform

* [Terraform](https://www.terraform.io/)
* [Terraform Command Line](https://www.terraform.io/cli/commands)
* [Registry](https://registry.terraform.io/)
* [Tutorials](https://learn.hashicorp.com/terraform?utm_source=terraform_io)

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