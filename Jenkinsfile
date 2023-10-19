pipeline {
    agent any 

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Run Playwright tests in Docker') {
            steps {
                script {
                    try {
                        sh '''
                            docker run --rm \
                                       --ipc=host \
                                       -v $(pwd):/workspace \
                                       -w /workspace \
                                       mcr.microsoft.com/playwright:v1.39.0-jammy \
                                       bash -c "npm install && npm test"
                        '''
                    } catch (Exception e) {
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }

        stage('Archive and Display Reports') {
            steps {
                archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
                // If you have the HTML Publisher Plugin
                publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true, reportDir: 'playwright-report', reportFiles: 'index.html', reportName: 'Playwright Report', reportTitles: ''])
            }
        }
    }
}
