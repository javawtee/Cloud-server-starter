## How to start server in your local

- Run `npm install`
- Then, `npm run startdev`
- Type http://localhost:<PORT>/app on browser to start graphiql

  
## My Runbook (05/30)
- Enable Cloud Run and Cloud Build API (with Billing)
1. Cloud Build
  - Add a trigger with these settings:
    - "Repository event that invokes trigger": Push to branch
    - "Source": Connect to Github (using Mirror / Legacy)
      - This should mirror Github repo to Cloud Repositories (be used later in Cloud Run steps)
    - "Type": Dockerfile
    - "Image name": Can be ASIS, or removing repository path
  - Test with a simple push to branch (ie. main)
  
2. Cloud Run
  - Add service 
    - Select "Continuously deploy new revisions from a source repository"
      - "Repository Provider": Cloud Source Repositories
      - "Repository":  <the one from "Source" step in Cloud Build>
      - "Build Type": Dockerfile
    - Keep the rest as default
