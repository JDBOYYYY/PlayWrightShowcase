pipeline {
    agent any 

    stages {
        stage('Checkout') {
            steps {
                // This step is handled automatically when using "Pipeline script from SCM"
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Playwright tests') {
            steps {
                sh 'npm test'
            }
        }
    }
}
