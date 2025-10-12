#!/bin/bash
#
# Jetstreamin GCP Master Deployment Script
# Agent: ATM
# Purpose: To execute the authorized deployment of Jetstreamin infrastructure
#          and services on Google Cloud Platform.
#

# --- Cyphermorph Presentation Layer ---
echo "
+----------------------------------------------------------+
|      JETSTREAMIN :: GCP MASTER DEPLOYMENT PROTOCOL       |
+----------------------------------------------------------+
| Agent: ATM                                               |
| Directive: Execute authorized GCP deployment.            |
| Operator: Michael J. Mahon                               |
| Project ID: ${GCP_PROJECT_ID}                            |
+----------------------------------------------------------+
"

# --- Phase 1: Configuration Ingestion & Validation ---
CONFIG_FILE="jetstreamin.env"
if [ ! -f "$CONFIG_FILE" ]; then
    echo "FATAL: Configuration file '$CONFIG_FILE' not found. Please run 'collect_auth.sh' first."
    exit 1
fi

source "$CONFIG_FILE"
if [ -z "$GCP_PROJECT_ID" ]; then
    echo "FATAL: GCP_PROJECT_ID is not set in '$CONFIG_FILE'. Halting."
    exit 1
fi

echo "Configuration loaded. Targeting GCP Project: $GCP_PROJECT_ID"
gcloud config set project $GCP_PROJECT_ID
echo

# --- Phase 2: Dynamic Configuration Injection ---
echo "Injecting Project ID into deployment configurations..."

# Inject into Terraform config
sed -i "s/your-gcp-project-id/$GCP_PROJECT_ID/g" terraform/main.tf

# Inject into Kubernetes config
sed -i "s/your-gcp-project-id/$GCP_PROJECT_ID/g" k8s/deployment.yaml

echo "Configuration injection complete."
echo

# --- Phase 3: Infrastructure Provisioning via Terraform ---
echo "Initiating infrastructure provisioning with Terraform..."
cd terraform

# Ensure required APIs are enabled
echo "Enabling required GCP services..."
gcloud services enable \
    container.googleapis.com \
    artifactregistry.googleapis.com \
    secretmanager.googleapis.com \
    firestore.googleapis.com \
    cloudbuild.googleapis.com

terraform init
terraform apply -auto-approve

if [ $? -ne 0 ]; then
    echo "FATAL: Terraform apply failed. Infrastructure provisioning halted."
    cd ..
    exit 1
fi

echo "Terraform provisioning successful. Core infrastructure is online."
cd ..
echo

# --- Phase 4: CI/CD Pipeline Bootstrap ---
echo "Bootstrapping the CI/CD pipeline with an initial Cloud Build..."
gcloud builds submit --config cloudbuild.yaml .

if [ $? -ne 0 ]; then
    echo "FATAL: Initial Cloud Build submission failed. The application may not be deployed."
    exit 1
fi

echo "Cloud Build triggered successfully. The application is deploying to GKE."
echo
echo "+==================================================================+"
echo "| DEPLOYMENT COMPLETE                                              |"
echo "+==================================================================+"
echo "| The Jetstreamin platform is now live and operating autonomously  |"
echo "| on GCP. Further updates will be handled automatically by the     |"
echo "| Cloud Build CI/CD pipeline triggered by 'git push'.              |"
echo "+==================================================================+"

exit 0
