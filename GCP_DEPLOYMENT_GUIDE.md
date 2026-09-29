# Google Cloud Deployment Guide: Apex Veritas

This guide will walk you through deploying your fully decoupled Node.js and React monorepo directly to Google Cloud Platform (GCP).

We are utilizing a modern, serverless, and highly scalable architecture: **Cloud Run (Backend) + Cloud SQL (Postgres) + Cloud Storage (Frontend & Documents)**.

---

## 1. Prerequisites

1. Create a Google Cloud account at [cloud.google.com](https://cloud.google.com/).
2. Install the [Google Cloud CLI (`gcloud`)](https://cloud.google.com/sdk/docs/install) on your local machine.
3. Authenticate your CLI by running:
   ```bash
   gcloud auth login
   ```
4. Create a new GCP Project:
   ```bash
   gcloud projects create apex-veritas-prod --name="Apex Veritas"
   gcloud config set project apex-veritas-prod
   ```
5. Enable Billing for your project in the Google Cloud Console.

---

## 2. Enable Required APIs

Run the following command to enable the necessary services for your project:

```bash
gcloud services enable run.googleapis.com \
    sqladmin.googleapis.com \
    storage-component.googleapis.com \
    secretmanager.googleapis.com \
    cloudbuild.googleapis.com
```

---

## 3. Setup the Database (Cloud SQL)

First, we need a live PostgreSQL database for your API.

1. Navigate to **SQL** in the GCP Console and click **Create Instance**.
2. Choose **PostgreSQL** (version 15+).
3. Name it `apex-db`.
4. Set a secure password for the default `postgres` user.
5. Under Connections, ensure **Public IP** is enabled (so you can connect locally during development) and add your local IP address to the Authorized Networks.
6. Click **Create Instance**.
7. Once created, note the **Public IP address**.

**Your Production Database URL will look like this:**
`postgresql://postgres:<YOUR_PASSWORD>@<PUBLIC_IP>:5432/postgres`

*Note: For maximum security in production, you can configure Cloud Run to connect to Cloud SQL via a private VPC or the Cloud SQL Auth Proxy.*

---

## 4. Setup Secrets (Secret Manager)

Google Cloud Run allows you to inject secrets securely at runtime.

1. Go to **Security > Secret Manager** in the console.
2. Create the following secrets, pasting the corresponding values into each:
   - `DATABASE_URL` (The connection string from Step 3)
   - `JWT_ACCESS_SECRET` (A long random string)
   - `JWT_REFRESH_SECRET` (A long random string)
   - *Add any other production secrets here like Paystack or Twilio keys if needed.*

---

## 5. Setup Storage Buckets (Cloud Storage)

We need buckets for document uploads and frontend hosting.

1. Go to **Cloud Storage > Buckets**.
2. Create the following buckets (bucket names must be globally unique, so you may need to append a random string):
   - `apex-veritas-documents-prod` (For user uploads)
   - `apex-veritas-web-prod` (For the marketing site)
   - `apex-veritas-portal-prod` (For the client portal)

3. For the **Frontend buckets** (`web` and `portal`), make them public:
   - Go to the bucket's **Permissions** tab.
   - Click **Grant Access**.
   - Add Principal: `allUsers`, Role: `Storage Object Viewer`.

---

## 6. Deploy the Backend API (Cloud Run)

Your API is already containerized with a `Dockerfile`.

1. Open `infrastructure/scripts/deploy-gcp-backend.sh` and update the `PROJECT_ID` variable to match your new project ID (e.g., `apex-veritas-prod`).
2. Update the `--set-secrets` line in the script if you added more secrets in Step 4.
3. Run the deployment script from your terminal:
   ```bash
   chmod +x infrastructure/scripts/deploy-gcp-backend.sh
   ./infrastructure/scripts/deploy-gcp-backend.sh
   ```
4. Once complete, the CLI will output a **Service URL** (e.g., `https://apex-veritas-api-xxx.a.run.app`). This is your live API endpoint.

---

## 7. Deploy the Frontends

We will host your React SPAs in Cloud Storage.

1. On your local machine, open `packages/web/.env.production` and `packages/portal/.env.production`.
2. Update the `VITE_API_URL` to point to the **Service URL** you got from Cloud Run in Step 6.
3. Open `infrastructure/scripts/deploy-frontends.sh`.
4. Update `WEB_BUCKET` and `PORTAL_BUCKET` to match the bucket names you created in Step 5 (e.g., `gs://apex-veritas-web-prod`).
5. Run the frontend deployment script:
   ```bash
   chmod +x infrastructure/scripts/deploy-frontends.sh
   ./infrastructure/scripts/deploy-frontends.sh
   ```

You are now live on Google Cloud!

*(Optional Next Step: Set up a Google Cloud Load Balancer to attach custom domains to your Cloud Run service and Cloud Storage buckets).*
