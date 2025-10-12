provider "google" {
  project = "gen-lang-client-0854112426" // Replace with your GCP Project ID
  region  = "us-central1"
}

// 1. Kubernetes Engine for running our containerized agents
resource "google_container_cluster" "primary" {
  name     = "jetstreamin-cluster"
  location = "us-central1-a"
  initial_node_count = 1

  node_config {
    machine_type = "e2-medium" // Cost-effective default
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform",
    ]
  }
}

// 2. Artifact Registry to store our Docker images
resource "google_artifact_registry_repository" "docker_repo" {
  location      = "us-central1"
  repository_id = "jetstreamin-repo"
  format        = "DOCKER"
  description   = "Docker repository for Jetstreamin agents."
}



// 4. Firestore for scalable, serverless DAG state management
resource "google_project_service" "firestore" {
  service = "firestore.googleapis.com"
}

resource "google_firestore_database" "database" {
  project        = "gen-lang-client-0854112426"
  name           = "(default)"
  location_id    = "us-central1"
  type           = "FIRESTORE_NATIVE"
  depends_on     = [google_project_service.firestore]
}
