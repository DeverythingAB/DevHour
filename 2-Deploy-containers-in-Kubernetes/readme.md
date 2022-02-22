# 2: Deploy containers in Kubernetes
In this section we will package the microservices we have from section 1 into docker containers.
Then we will show you how to deploy them into your local Kubernetes setup.
To make this more fun we will also deploy them into AWS EKS (Managed Kubernetes service in Amazon)

Completing this section will get you familiar with docker and Kubernetes and how you can get them into a cloud provider.


#### Slides ####
Look at the slides.pdf to get an overview or follow along the recording on YouTube

#### YouTube recording of this session
https://www.youtube.com/watch?v=j9Bjq-xv8KA

## Getting started with local Kubernetes deployment

To work with a local kubernetes setup there are some pre-requisites that you need to do for our project

1. Maven should be installed https://maven.apache.org/install.html
2. Have docker installed https://docs.docker.com/get-docker/
3. Install minikube https://minikube.sigs.k8s.io/docs/start/
4. Install kubectl 
    * Linux: https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/
    * Mac: https://kubernetes.io/docs/tasks/tools/install-kubectl-macos/
    * Windows: https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/
5. AWS CLI (only for sections "Deploy into AWS cloud using EKS and ECR") https://aws.amazon.com/cli/
6. eksctl CLI (only for sections "Deploy into AWS cloud using EKS and ECR") https://docs.aws.amazon.com/eks/latest/userguide/eksctl.html


### Build our jar files using maven ###
First we need to build our runnable jar files for each service. These are later packaged into docker containers

Open a terminal and go to the root folder for this project. Use maven to build our snapshot jar files
   ```
    mvn clean install
   ```

### Build docker images ###
The docker files provided in each microservice (order, product, report) have a Dockerfile that defines how the
image we want to build is defined and once a container is launched it also tells docker what should be run

1. Look into the Dockerfile each microservice to understand what they are doing

2. Open a terminal and go to the root folder for this project. Run the following to build all three images
   ```
    ./build-docker-images.sh
   ```
3. Let start the order-service to verify that everything is working (notice we are using port 9000)
   ```
    docker run -it -p 9000:9000 order-service
   ```
4. From the previous step you should be seeing spring boot starting. Now you can open a browser and head over to
   http://localhost:9000/order/actuator/health 

### Configure minikube ###
Minikube is a tool that lets you run Kubernetes locally. Minikube runs a single-node Kubernetes cluster on your personal computer

1. Start minikube in a new terminal
   ```
    minikube start
   ```
2. Enable nginx ingress
   ```
    minikube addons enable ingress
   ```
3. Let minikube use local docker images (for this terminal only)
   ```
    eval $(minikube docker-env)
   ```
4. Now we need to rebuild our images in the same terminal
   ```
   ./build-docker-images.sh
   ```
    
5. Start ssh tunnel towards minikube for accessing ingress (we recommend you use a new terminal for this since it's blocking)
   ```
    minkube tunnel
   ```
6. When you want to close down your kubernetes cluster you can run (do this after you are done with this exercise)
   ```
    minkube stop
   ```
   
**Congrats you now have a local kubernetes setup available!**

### Working with kubectl
Kubectl is the Kubernetes command-line tool, kubectl, 
allows you to run commands against Kubernetes clusters. You can use kubectl to deploy applications, inspect and 
manage cluster resources, and view logs and much more

1. Let start by making sure we have a connection to minikube
   ```
    kubectl get all
   ```
   > *If you don't have a connection you will get a connection refuse error. If that happens revisit minikube section*
2. Lets start deploying our pods
   ```
    kubectl apply -f kubernetes-local/devhour.pod.yml
    kubectl get pods
   ```
   This should show you the deployed pods as running 

3. Now lets deploy our services
   ```
    kubectl apply -f kubernetes-local/devhour.service.yml
    kubectl get services
   ```
   This should show you the deployed services as running 
4. Finally, we deploy our ingress
   ```
    kubectl apply -f kubernetes-local/devhour.ingress.yml
    kubectl get ingress
   ```
   This should show you the deployed ingress as running 

### Now you can access your services
To access your services curl or use a web browser

   ```
    curl http://localhost/order/actuator/health
    curl http://localhost/product/actuator/health
    curl http://localhost/report/actuator/health
   ```

## Deploy into AWS cloud using EKS and ECR ##

### Working with AWS Elastic Container Registry (ECR) ###

#### Prerequisite ####
You will need to create an ECR repository before starting this section (*To do this you have to have access rights in your AWS account*).
https://docs.aws.amazon.com/AmazonECR/latest/userguide/getting-started-console.html

Create three repositories with the names:
* order-service
* product-service
* report-service

Now you are ready to push your images following these steps

1. To login to your AWS ECR repository run the following command but provided with the region you have used and your 
AWS account id (*if your not sure about the account id, have a look in the AWS ECR console and press the button "push commands"*)

   ```
   aws ecr get-login-password --region <YOUR-REGION> | docker login --username AWS --password-stdin <AWS-ACCOUNT-ID>.dkr.ecr.<YOUR-REGION>.amazonaws.com
   ```
2. Tag the docker images for AWS ECR
   ```
   docker tag order-service:latest <AWS-ACCOUNT-ID>.dkr.ecr..amazonaws.com/order-service:1.0
   docker tag product-service:latest <AWS-ACCOUNT-ID>.dkr.ecr.<YOUR-REGION>.amazonaws.com/product-service:1.0
   docker tag report-service:latest <AWS-ACCOUNT-ID>.dkr.ecr.<YOUR-REGION>.amazonaws.com/report-service:1.0
   ```
3. Push the images to AWS ECR
   ```
   docker push order-service:latest <AWS-ACCOUNT-ID>.dkr.ecr..amazonaws.com/order-service:1.0
   docker push product-service:latest <AWS-ACCOUNT-ID>.dkr.ecr.<YOUR-REGION>.amazonaws.com/product-service:1.0
   docker push report-service:latest <AWS-ACCOUNT-ID>.dkr.ecr.<YOUR-REGION>.amazonaws.com/report-service:1.0
   ```

### Deploy into AWS Elastic Kubernetes Service (EKS) ###

#### Prerequisite ####
Before you can start this session you need to have an existing AWS EKS running on fargate. You also need to enable the AWS Application Load Balancer.
Make sure you have all the prerequisites required in each guide.

Our Kubernetes definitions are based on the default namespace  

Setup a EKS cluster: 
https://docs.aws.amazon.com/eks/latest/userguide/getting-started-eksctl.html

Setup AWS Application Load Balancer (ALB): https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html

Now you are ready to deploy our microservices into AWS EKS:

1. Update the namespace in devhour.aws.ingress.yml (if you used anything different from default)
```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  namespace: <YOUR-NAME-SPACE>
  name: devhour
```
2. Update the namespace in devhour.aws.service.yml for all three services (if you used anything different from default)
```
apiVersion: v1
kind: Service
metadata:
  namespace: <YOUR-NAME-SPACE>
```
3. Update the namespace in devhour.aws.service.yml for all three pods and change the image so that it contains
your AWS Account Id (if you used anything different from default)
```
apiVersion: apps/v1
kind: Deployment
metadata:
  namespace: <YOUR-NAME-SPACE>
  .
  .
  .
containers:
        - name: order-service
          image: <YOUR-IDENTIFICATION-ID>.dkr.ecr.<YOUR-REGION>.amazonaws.com/order-service:1.0
```
4. Now we are almost ready to deploy but first make sure your in the correct cluster context in kubectl
```
kubectl config get-contexts
```
5. Switch context in kubectl (only needed if step 4 produced a list where EKS context is not current )
```
kubectl config use-context <NAME-OF-YOUR-CLUSTER-DISPLAYED-IN-STEP-4>
```
6. Now we can finally deploy into AWS EKS
```
kubectl apply -f kubernetes-aws/
```
7. To make sure all pods, services and ingress is running
```
kubectl get all
```
8. To figure out your public IP run the following
```
kubectl get ingress
```
9. Open a browser and go to
```
http://<YOUR-ADRESS>/order/actuator/health
```
10. Cleanup. To remove deployed pods, services and ingress (if you keep them up you will be billed for it)
```
kubectl delete -f kubernetes-aws
```
