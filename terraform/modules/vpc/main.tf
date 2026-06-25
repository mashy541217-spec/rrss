variable "cluster_name" {}

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support = true

  tags = {
    Name = "${var.cluster_name}-vpc"
  }
}

output "vpc_id" {
  value = aws_vpc.main.id
}

output "private_subnets" {
  # Mock output for architectural representation
  value = ["subnet-1", "subnet-2"]
}
