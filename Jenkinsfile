pipeline {
    agent any 

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Setup Allure') {
            steps {
                script {
                    sh 'sudo apt-get update'
                    sh 'sudo apt-get install allure -y' // Make sure to use the correct command to install Allure
                }
            }
        }

        stage('Run Playwright tests in Docker') {
            steps {
                script {
                    // Note that we're removing the exit 1 on test failure.
                    sh '''
                        docker run --rm \
                            --ipc=host \
                            -v $(pwd):/workspace \
                            -w /workspace \
                            mcr.microsoft.com/playwright:v1.39.0-jammy \
                            bash -c 'set -e; echo "Starting npm install"; npm install > install.log; echo "Starting npm test"; npm test --verbose > test.log 2>&1; echo "Tests completed";'
                    '''
                }
            }
        }
    }

    post {
        always {
            // Generate and archive Allure report even if tests fail
            script {
                sh 'allure generate --clean -o allure-report allure-results || true'
            }
            archiveArtifacts artifacts: 'allure-results/**/*', allowEmptyArchive: true
            archiveArtifacts artifacts: 'allure-report/**/*', allowEmptyArchive: true

            publishHTML(target: [
                reportDir: 'allure-report',
                reportFiles: 'index.html',
                reportName: 'Allure Report'
            ])
            junit '**/test-results/**/*.xml'
            archiveArtifacts artifacts: '**/test-results/**', fingerprint: true
        }
    }
}
