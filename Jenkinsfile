pipeline {
    agent {
        kubernetes {
            defaultContainer 'skaffold'
            yamlFile "k8s/jenkins-pod.yaml"
        }
    }

    options {
        buildDiscarder logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '5', numToKeepStr: '20')
        timeout(15)
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Print Build Info'){
            steps {
                echo "Params used:"
                echo "${params}"
                echo "---"

                echo "env | sort"
                sh "env | sort"
                echo "---"
            }
        }
        stage('Build Image and Update Deployment') {
            steps {
                ansiColor('xterm') {
                    // TODO Why is this needed?
                    sh "gcloud auth activate-service-account --key-file=/secret/kaniko-secret"
                    sh "skaffold run -p kaniko --cache-artifacts=false"
                }
            }

        }
    }
}
