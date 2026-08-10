# AWS Deployment Guide: Apex Veritas

This guide will walk you through deploying your fully decoupled Node.js and React monorepo directly to Amazon Web Services (AWS) using our custom infrastructure scripts.

We are utilizing a highly scalable, robust architecture: **EC2 (Backend) + RDS (Postgres) + S3 & CloudFront (Frontend)**.

---

## 1. Setup the Database (Amazon RDS)
First, we need a live PostgreSQL database for your API to connect to.
1. Log in to your [AWS Management Console](https://console.aws.amazon.com/).
2. Navigate to **RDS** and click **Create database**.
3. Select **PostgreSQL** (version 15+).
4. Choose the **Free tier** or **Production** template depending on your budget.
5. Set your Master Username (e.g., `postgres`) and Master Password. Keep these safe!
6. Ensure **Public access** is set to `No` (or `Yes` temporarily if you want to connect to it from your local machine, but you must whitelist your IP).
7. Click **Create database**.
8. Once the database is created, click into it to find the **Endpoint** (this is your database host URL).

**Your Production Database URL will look like this:**
`postgresql://postgres:<YOUR_PASSWORD>@<YOUR_ENDPOINT>:5432/apex_production`

---

## 2. Provision the Backend Server (Amazon EC2)
Now we will spin up a Linux server to host your Node.js backend.
1. Navigate to **EC2** and click **Launch instance**.
2. Name it `Apex-Veritas-API`.
3. For the AMI, select **Ubuntu Server 22.04 LTS**.
4. Create a new **Key Pair** (RSA, .pem) and download it. You will need this to SSH into the server!
5. In **Network Settings**, check the boxes for:
   - Allow SSH traffic from Anywhere
   - Allow HTTP traffic from the internet
   - Allow HTTPS traffic from the internet
6. Click **Launch instance**.

---

## 3. Deploy the Backend API
We have written an automated script to install Node, Nginx, and PM2 on your fresh server.
1. Once your EC2 instance is running, copy its **Public IPv4 address**.
2. Open your terminal and SSH into the server using your downloaded key:
   ```bash
   ssh -i "your-key.pem" ubuntu@<EC2-PUBLIC-IP>
   ```
3. Once logged in, clone the repository:
   ```bash
   git clone https://github.com/anjelofrancis/apex-veritas.git
   cd apex-veritas
   ```
4. **CRITICAL STEP:** You must create the `.env` file before starting the server.
   ```bash
   nano packages/api/.env
   ```
   Paste all your production API keys in this file:
   ```env
   NODE_ENV=production
   PORT=4000
   DATABASE_URL="postgresql://postgres:password@rds-endpoint:5432/apex"
   JWT_ACCESS_SECRET="generate-a-long-secure-random-string-here"
   JWT_REFRESH_SECRET="generate-another-long-secure-string"
   STRIPE_SECRET_KEY="sk_live_..."
   AWS_ACCESS_KEY_ID="AKIA..."
   AWS_SECRET_ACCESS_KEY="..."
   S3_BUCKET="your-document-bucket"
   TWILIO_ACCOUNT_SID="..."
   TWILIO_AUTH_TOKEN="..."
   CORS_ORIGINS="http://<EC2-PUBLIC-IP>,http://<S3-BUCKET-URL>"
   ```
   Save and exit (`Ctrl+O`, `Enter`, `Ctrl+X`).

5. Run the automated deployment script:
   ```bash
   chmod +x infrastructure/scripts/deploy-ec2.sh
   ./infrastructure/scripts/deploy-ec2.sh
   ```
   *The script will install all dependencies, build the reverse proxy, run database migrations, and boot up the API via PM2.*

**To test if your API is live:** Open `http://<EC2-PUBLIC-IP>/api/health` in your browser. You should see `{"status":"ok"}`.

---

## 4. Deploy the Frontends (Amazon S3)
We will host your React SPAs in S3 buckets for the fastest performance.
1. Navigate to **S3** and create two buckets:
   - `apex-veritas-web-prod`
   - `apex-veritas-portal-prod`
2. For both buckets, uncheck **Block all public access** and acknowledge the warning.
3. Once created, go to the **Properties** tab of each bucket, scroll to the bottom, and enable **Static website hosting**. Note the endpoint URLs.
4. On your local machine (where you write code), edit the deployment script:
   - Open `infrastructure/scripts/deploy-frontends.sh`
   - Replace `WEB_BUCKET` and `PORTAL_BUCKET` with your real bucket names (`s3://apex-veritas-web-prod`).
5. Open `packages/web/.env` and `packages/portal/.env` locally and ensure the `VITE_API_URL` points to your live EC2 Public IP (e.g. `http://<EC2-PUBLIC-IP>/api`).
6. Run the script from your local terminal:
   ```bash
   chmod +x infrastructure/scripts/deploy-frontends.sh
   ./infrastructure/scripts/deploy-frontends.sh
   ```
   *This will build both React apps and seamlessly sync the HTML/JS/CSS bundles to your AWS buckets.*

You are now live! You can access your platforms via the S3 Static Website Endpoint URLs!

*(Optional Next Step: Set up Amazon CloudFront to link your S3 buckets to a custom domain name and provide free SSL/HTTPS).*
