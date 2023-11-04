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
                        // Install dependencies and run tests
                        sh 'npm install'
                        sh 'npx playwright test --reporter=line,allure-playwright'
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                // Using the same Docker image for consistency
                docker.image('mcr.microsoft.com/playwright:v1.20.0-focal').inside {
                    // Generate Allure report
                    sh 'allure generate allure-results --clean -o allure-report || true'
                }

                // Publish Allure report - assumes Allure plugin is installed
                allure([
                    includeProperties: false,
                    jdk: '',
                    properties: [],
                    reportBuildPolicy: 'ALWAYS',
                    results: [[path: 'allure-report']]
                ])

                // Archive the Allure report
                archiveArtifacts artifacts: 'allure-report/**', fingerprint: true
            }

            // Clean up the workspace
            cleanWs()
        }
    }
}
