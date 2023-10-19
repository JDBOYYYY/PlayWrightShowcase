pipeline {
    agent any 

    stages {
        // ... other stages

        stage('Run Playwright tests in Docker') {
            steps {
                sh '''
                    docker run --rm \
                               --ipc=host \
                               -v $(pwd):/workspace \
                               -w /workspace \
                               mcr.microsoft.com/playwright:v1.39.0-jammy \
                               bash -c "npm install && npm test"
                '''
            }
        }

        stage('Archive and Display Reports') {
            steps {
                archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
                publishHTML(target: [
                    allowMissing: true,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'playwright-report',
                    reportFiles: 'index.html',
                    reportName: 'Playwright Report'
                ])
            }
        }
    }
}
