# 2: Deploy containers in Kubernetes
In this section we will package the microservices we have from section 1 into docker containers.
Then we will show you how to deploy them into your local Kubernetes setup.
To make this more fun we will also deploy them into AWS EKS (Managed Kubernetes service in Amazon)

Completing this section will get you familiar with docker and Kubernetes and how you can get them into a cloud provider.


#### Slides ####
Look at the slides.pdf to get an overview or follow along the recording on YouTube

#### YouTube recording of this session
https://www.youtube.com/watch?v=j9Bjq-xv8KA

## Getting started with Github Actions

#empty commit again

### Useful commands

#### List all running containers with version in your cluster
   ```
   kubectl get pods --all-namespaces -o jsonpath="{.items[*].spec.containers[*].image}" |\
   tr -s '[[:space:]]' '\n' |\
   sort |\
   uniq -c
   ```
