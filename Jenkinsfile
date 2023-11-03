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
                    sh '''
                        docker run --rm \
                            --ipc=host \
                            -v $(pwd):/workspace \
                            -w /workspace \
                            mcr.microsoft.com/playwright:v1.39.0-jammy \
                            bash -c 'set -e; echo "Starting npm install"; npm install > install.log; echo "Starting npm test"; npm test --verbose > test.log 2>&1 || { echo "Tests failed"; cat test.log; exit 1; }; echo "Listing test results"; ls -al test-results > ls.log; cat ls.log; npx junit-reporter --results "test-results/**/*.xml" --savePath "test-results/" > junit-reporter.log 2>&1 || { echo "JUnit reporter failed"; cat junit-reporter.log; exit 1; }; echo "Installing junit-viewer"; npm install -g junit-viewer > junit-install.log 2>&1 && echo "Generating HTML report with junit-viewer"; junit-viewer --results="test-results/" --save="test-results/index.html" > junit-viewer.log 2>&1 || { echo "Failed to generate HTML report"; cat junit-viewer.log; exit 1; }; echo "Final listing of test results"; ls -al test-results > final-ls.log; cat final-ls.log'
                    '''
                }
            }
        }
    }


    post {
        always {
            junit '**/test-results/**/*.xml'
            archiveArtifacts artifacts: '**/test-results/**', fingerprint: true
            publishHTML (target: [
                allowMissing: false,
                alwaysLinkToLastBuild: false,
                keepAll: true,
                reportDir: 'test-results/',
                reportFiles: 'index.html',
                reportName: 'HTML Report',
                reportTitles: ''
            ])
        }
    }
}
