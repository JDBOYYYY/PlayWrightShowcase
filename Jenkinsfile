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
                sh '''
                    docker run --rm \
                               --ipc=host \
                               -v $(pwd):/workspace \
                               -w /workspace \
                               mcr.microsoft.com/playwright:v1.39.0-jammy \
                               bash -c "npm install && npm test"
                '''
            }
            post {
                always {
                    script {
                        if (currentBuild.result == 'FAILURE' || currentBuild.result == null) {
                            currentBuild.result = 'UNSTABLE'
                        }
                    }
                }
            }
        }

        stage('Archive and Display Reports') {
            steps {
                // Your archiving and report displaying steps here
                archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
                // Other steps to display or process the reports as needed
            }
        }
    }
}
