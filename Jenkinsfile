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
                    // Run tests in the Docker container. We ensure Allure is installed in the container.
                    sh '''
                        docker run --rm \
                            --ipc=host \
                            -v $(pwd):/workspace \
                            -w /workspace \
                            mcr.microsoft.com/playwright:v1.39.0-jammy \
                            bash -c 'set -e; echo "Installing Allure"; apt-get update && apt-get install allure -y; echo "Starting npm install"; npm install; echo "Starting npm test"; npm test --verbose > test.log 2>&1; echo "Tests completed";'
                    '''
                }
            }
        }
    }

    post {
        always {
            // Generate and archive Allure report even if tests fail
            script {
                // The Allure report is generated on Jenkins, thus Allure needs to be installed on Jenkins.
                // If your Jenkins server doesn't have Allure installed, this will fail.
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
