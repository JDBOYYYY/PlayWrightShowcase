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
                            bash -c "npm install && npm test"
                        '''
                }
                post {
                    always {
                        junit '**/test-results/**/*.xml'
                        archiveArtifacts artifacts: 'trace/**', fingerprint: true
                    }
                }
            }
        }
    }
}
