#!/bin/bash

# Define the domains to add
DOMAINS=("fe.localhost" "be.localhost" "me.localhost")
HOSTS_FILE="/etc/hosts"

# Function to add a domain to the hosts file
add_domain_to_hosts() {
  local domain=$1
  if ! grep -q "$domain" "$HOSTS_FILE"; then
    echo "127.0.0.1 $domain" | sudo tee -a "$HOSTS_FILE" > /dev/null
    echo "Added $domain to $HOSTS_FILE"
  else
    echo "$domain already exists in $HOSTS_FILE"
  fi
}

# Check for sudo privileges
if [ "$EUID" -ne 0 ]; then
  echo "This script requires sudo privileges. Please run with 'sudo'."
  exit 1
fi

# Add each domain
for domain in "${DOMAINS[@]}"; do
  add_domain_to_hosts "$domain"
done

echo "All domains have been processed."
