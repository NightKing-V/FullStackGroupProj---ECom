# Define the domains to add
$domains = @("fe.localhost", "be.localhost", "me.localhost")
$hostsFile = "C:\Windows\System32\drivers\etc\hosts"

# Function to add a domain to the hosts file
function Add-DomainToHosts {
    param(
        [string]$domain
    )
    
    # Check if the domain already exists in the hosts file
    $exists = Select-String -Path $hostsFile -Pattern $domain
    if (-not $exists) {
        # Add the domain to the hosts file
        Add-Content -Path $hostsFile -Value "127.0.0.1 $domain"
        Write-Host "Added $domain to $hostsFile"
    } else {
        Write-Host "$domain already exists in $hostsFile"
    }
}

# Check for administrator privileges
$adminCheck = [Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()
if (-not $adminCheck.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "This script requires administrator privileges. Please run with 'Run as Administrator'."
    exit 1
}

# Add each domain
foreach ($domain in $domains) {
    Add-DomainToHosts -domain $domain
}

Write-Host "All domains have been processed."
