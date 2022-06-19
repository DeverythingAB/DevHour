# 3: Configure CI/CD pipelines
In this section we will be setup CI/CD pipeline for our application using GitHub Actions. Then we will distribute the docker images into AWS ECR. Finally we will trigger a deployment in AWS EKS with the help of HELM.

Completing this section will give you an idea of how to setup a CI/CD pipeline with a few different steps.


#### Slides ####
Look at the slides.pdf to get an overview or follow along the recording on YouTube

#### YouTube recording of this session
https://www.youtube.com/watch?v=7Rw7YjtIydI

## Content

1. Fix real versions for our jar files and not only snapshots (locally we still build snapshots)
2. Update our docker images to allow for input parameters to select the correct jar files versions
3. Create helm_charts to be able to update Kubernetes with new container versions 
4. Add the following secrets to GitHub
   * AWS_ACCESS_KEY_ID
   * AWS_PROFILE
   * AWS_SECRET_ACCESS_KEY
   * ECR_REGISTRY
   * KUBE_CONFIG_DATA
5. Create the github-actions.yml file in the .github/workflows folder to define our pipeline
   * Define first job with Java 17 (build)
      - Use checkout and setup-java actions
      - Run mvn clean install and build our jar files
      - Store the artifacts to be available for second job
   * Define second job 
      - Use download-artifacts, multiple aws-action & helm-eks-actions
      - Upload our docker containers to AWS ECR
      - Deploy to AWS EKS
      - Get URL to public loadbalancer


## Github secrets values

#### AWS_ACCESS_KEY_ID
Your AWS ACCESS KEY. You can get this information from the IAM console in AWS

#### AWS_SECRET_ACCESS_KEY
Your AWS SECRET ACCESS KEY. You can get this information from the IAM console in AWS

#### AWS_PROFILE
Only needed if you run multiple profiles towards AWS

#### ECR_REGISTRY
The full path to your ECR registry. For our ECR that is 295899794390.dkr.ecr.eu-north-1.amazonaws.com

#### KUBE_CONFIG_DATA
Connection information you got in your kube config file usually located at $HOME/.kube/config (on mac).
It's the same connection information that kubectl would use to connect to your AWS EKS instance. To store this as a GitHub secret it should be base64 encoded

```
cat $HOME/.kube/config | base64
```



