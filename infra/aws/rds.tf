# TODO: starter Terraform - adjust networking/credentials before use
resource "aws_db_instance" "agentforge" {
  identifier          = "agentforge-db"
  engine              = "postgres"
  engine_version      = "16"
  instance_class      = "db.t4g.micro"
  allocated_storage   = 20
  db_name             = "agentforge"
  username            = "agentforge"
  password            = var.db_password
  skip_final_snapshot = true
  storage_encrypted   = true
}
variable "db_password" { sensitive = true }
