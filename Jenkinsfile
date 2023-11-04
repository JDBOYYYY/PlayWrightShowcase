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
                sh '''
                docker run --rm \
                    --ipc=host \
                    -v /home/szimonczyk/.npm:/root/.npm \
                    -v $(pwd):/workspace \
                    -w /workspace \
                    docker pull mcr.microsoft.com/playwright:v1.39.0-jammy
                    bash -c "npm install && npx playwright test && allure generate allure-results --clean -o allure-report || true"
                '''
            }
        }
    }

    post {
        always {
            script {
                // Generate and archive allure reports even if the tests fail
                if (fileExists('allure-results')) {
                    allure([
                        includeProperties: false,
                        jdk: '',
                        properties: [],
                        reportBuildPolicy: 'ALWAYS',
                        results: [[path: 'allure-results']]
                    ])
                }

                // Archive the Allure report
                if (fileExists('allure-report')) {
                    archiveArtifacts artifacts: 'allure-report/**', fingerprint: true
                }

                // Clean up the workspace
                cleanWs()
            }
        }
    }
}
