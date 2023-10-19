pipeline {
    agent any 

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Playwright tests in Docker') {
            steps {
                sh '''
                    docker run --rm \
                               --ipc=host \
                               -v $(pwd):/workspace \
                               -w /workspace \
                               mcr.microsoft.com/playwright:v1.39.0-jammy \
                               bash -c "npm test"
                '''
            }
        }
    }
}
