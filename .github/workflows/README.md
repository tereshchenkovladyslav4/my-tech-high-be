# Infocenter V2 Backend CI/CD

These files define the Github Actions workflows for the automated steps around the CI/CD process.

### On Master Commit

On a push to master (direct, or via PR merge), Github Actions will automatically create a date based tag for the commit for later use and tracking.

## Staging Deployment
---

In order to deploy to the Staging environment in AWS, the relevant commit needs to be tagged with `staging` or `staging/*` (`staging/2.1`, etc).

Upon tagging, Github Actions will begin deploying the Backend Services. Each service is build and pushed to ECS separately, to allow for each service to roll over one at a time with the new update.

These services are setup with an Application Load Balancer, allowing the DNS to maintain static, while the service IPs rotate.

The staging environment can be accessed via `https://api.v2-staging.mytechhigh.com`.

## Demo Deployment
---

In order to deploy to the Demo environment in AWS, the relevant commit needs to be tagged with `demo` or `demo/*` (`demo/2.1`, etc).

Upon tagging, Github Actions will begin deploying the Backend Services. Each service is build and pushed to ECS separately, to allow for each service to roll over one at a time with the new update.

These services are setup with an Application Load Balancer, allowing the DNS to maintain static, while the service IPs rotate.

The demo environment can be accessed via `https://api.v2-demo.mytechhigh.com`.

## Production Deployment
---

In order to deploy to the Production environment in AWS, the relevant commit needs to be tagged with `prod` or `prod/*` (`prod/2.1`, etc).

Upon tagging, Github Actions will begin deploying the Backend Services. Each service is build and pushed to ECS separately, to allow for each service to roll over one at a time with the new update.

These services are setup with an Application Load Balancer, allowing the DNS to maintain static, while the service IPs rotate.

The demo environment can be accessed via `https://api.infocenter.tech`.

## Contributors / SMEs
---

If you have any questions, need functionality added, or are just curious about these steps, feel free to reach out to Collin Meadows at collin.meadows@tech304.com.