terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "ap-southeast-1"
}

module "iam" {
  source = "./modules/iam"
}

module "vpc" {
  source = "./modules/vpc"
}

module "load_balancer" {
  source = "./modules/load_balancer"
  vpc_id = module.vpc.vpc_id
  subnets = module.vpc.subnet_ids
}

module "ecs" {
  source = "./modules/ecs"
  cluster_name = "nestjs-cluster"
  execution_role_arn = module.iam.execution_role_arn
  subnets = module.vpc.subnet_ids
  security_group_id = module.vpc.ecs_sg_id
  lb_target_group_arn = module.load_balancer.target_group_arn
  image = "275221252783.dkr.ecr.us-east-1.amazonaws.com/nestjs-api:latest"
}
