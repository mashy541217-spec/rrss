variable "cluster_name" {}
variable "vpc_id" {}
variable "subnet_ids" {
  type = list(string)
}

# Mock EKS Cluster Definition
resource "aws_eks_cluster" "platform" {
  name     = var.cluster_name
  role_arn = "arn:aws:iam::123456789012:role/eksClusterRole" # Placeholder

  vpc_config {
    subnet_ids = var.subnet_ids
  }
}

# Node Group for APIs and Workers
resource "aws_eks_node_group" "general" {
  cluster_name    = aws_eks_cluster.platform.name
  node_group_name = "general-compute"
  node_role_arn   = "arn:aws:iam::123456789012:role/eksNodeRole" # Placeholder
  subnet_ids      = var.subnet_ids

  scaling_config {
    desired_size = 3
    max_size     = 10
    min_size     = 1
  }

  instance_types = ["t3.large"]
}
