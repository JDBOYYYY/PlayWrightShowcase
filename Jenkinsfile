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

        stage('Install Playwright browsers') {
            steps {
                sh 'npx playwright install'
            }
        }

        stage('Install Playwright system dependencies') {
            steps {
                // Ensure the required system dependencies are installed
                sh 'sudo npx playwright install-deps'
            }
        }

        stage('Run Playwright tests') {
            steps {
                sh 'npm test'
            }
        }
    }
}
