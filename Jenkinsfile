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
                docker pull mcr.microsoft.com/playwright:v1.39.0-jammy
                docker run --rm \
                    --ipc=host \
                    -v $(pwd):/workspace \
                    -w /workspace \
                    mcr.microsoft.com/playwright:v1.39.0-jammy \
                    sh 'chmod -R 777 allure-results'
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
