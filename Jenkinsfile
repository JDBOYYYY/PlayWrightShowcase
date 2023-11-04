pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Check out the source code from version control
                checkout scm
            }
        }

        stage('Run Playwright tests in Docker') {
            steps {
                script {
                    docker.image('mcr.microsoft.com/playwright:v1.20.0-focal').inside {
                        // Install dependencies
                        sh 'npm install'
                        // Run Playwright tests
                        sh 'npx playwright test --reporter=line,allure-playwright'
                    }
                }
            }
        }
    }

    post {
        always {
            // Generate and publish the Allure report
            docker.image('mcr.microsoft.com/playwright:v1.20.0-focal').inside {
                // Generate the Allure report
                sh 'allure generate allure-results --clean -o allure-report || true'

                // Publish the Allure report using the Jenkins Allure plugin
                allure([
                    includeProperties: false,
                    jdk: '',
                    properties: [],
                    reportBuildPolicy: 'ALWAYS',
                    results: [[path: 'allure-report']]
                ])

                // Archive the Allure results and report
                archiveArtifacts artifacts: 'allure-report/**', fingerprint: true
            }

            // Clean up the workspace to not affect future builds
            cleanWs()
        }
    }
    
}