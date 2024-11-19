output "public_ip_address" {
  value = azurerm_linux_virtual_machine.vm.public_ip_address
}

output "inventory_file" {
  value = local_file.inventory_file.filename
}
