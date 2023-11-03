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
                            bash -c "npm install && npm test && npx junit-reporter --results 'test-results/**/*.xml' --savePath 'test-results/' && junit-viewer --results='test-results/' --save='test-results/index.html'"
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
