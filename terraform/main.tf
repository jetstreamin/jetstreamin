provider "google" {
  project = "gen-lang-client-0854112426" // Replace with your GCP Project ID
  region  = "us-central1"
}

// 1. Kubernetes Engine for running our containerized agents
resource "google_container_cluster" "primary" {
  name     = "jetstreamin-cluster"
  location = "us-central1-a"
  initial_node_count = 1
  deletion_protection = true

  node_config {
    machine_type = "e2-medium" // Cost-effective default
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform",
      "https://www.googleapis.com/auth/generative-language"
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

// 3. Enable the Vertex AI and Generative Language APIs
resource "google_project_service" "vertex_ai" {
  service = "aiplatform.googleapis.com"
}

resource "google_project_service" "generative_language" {
  service = "generativelanguage.googleapis.com"
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

// 5. Service Account for GKE Pods to access other GCP services
resource "google_service_account" "jetstreamin_sa" {
  account_id   = "jetstreamin-sa"
  display_name = "Jetstreamin GKE Service Account"
}

resource "google_service_account_iam_binding" "workload_identity_binding" {
  service_account_id = google_service_account.jetstreamin_sa.name
  role               = "roles/iam.workloadIdentityUser"
  members = [
    "serviceAccount:gen-lang-client-0854112426.svc.id.goog[default/jetstreamin-sa]",
  ]
}

// 6. Grant the Service Account permission to access Secret Manager
resource "google_project_iam_member" "secret_accessor_binding" {
  project = "gen-lang-client-0854112426"
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.jetstreamin_sa.email}"
}
