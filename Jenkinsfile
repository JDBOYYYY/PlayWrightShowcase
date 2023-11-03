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
                            bash -c 'set -e; npm install; npm test --verbose || { echo "Tests failed"; exit 1; }; ls -al test-results; npx junit-reporter --results "test-results/**/*.xml" --savePath "test-results/" || { echo "JUnit reporter failed"; exit 1; }; npm install -g junit-viewer && junit-viewer --results="test-results/" --save="test-results/index.html" || echo "Failed to generate HTML report"; ls -al test-results'
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
