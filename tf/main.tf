variable "cloudflare_account_id" {
  type = string
  sensitive = true
}

variable "cloudflare_api_token" {
  type = string
  sensitive = true
}

variable "name_suffix" {
  type = string
}

variable "d1_id" {
  type = string
  sensitive = true
}

terraform {
  required_providers {
    cloudflare = {
      source = "cloudflare/cloudflare"
      version = "3.31.0"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

resource "cloudflare_workers_kv_namespace" "terraform_state" {
  account_id = var.cloudflare_account_id
  title = "ccip-terraform-${lower(var.name_suffix)}-state"
}

resource "cloudflare_pages_project" "ccip_pages_project" {
  account_id = var.cloudflare_account_id
  name              = "ccip-${lower(var.name_suffix)}"
  production_branch = "main"

  deployment_configs {
    production {
      d1_databases = {
        DATABASE = sensitive(var.d1_id)
      }

      compatibility_date = "2023-01-09"
    }
  }
}
