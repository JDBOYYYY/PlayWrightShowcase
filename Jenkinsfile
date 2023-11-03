pipeline {
    agent any
    environment {
        // Define the volume name where you want to keep the test results
        // This volume will be used to persist data beyond the life of the Docker container
        TEST_RESULTS_VOLUME = 'playwright_test_results'
        WORKSPACE_DIR = '/workspace'
    }
    stages {
        stage('Prepare Environment') {
            steps {
                script {
                    // Create a Docker volume to persist test results if it doesn't exist
                    sh "docker volume create ${env.TEST_RESULTS_VOLUME} || true"
                }
            }
        }

        stage('Run Playwright tests in Docker') {
            steps {
                script {
                    sh """
                    docker run --rm --ipc=host \\
                    -v ${env.TEST_RESULTS_VOLUME}:${env.WORKSPACE_DIR} \\
                    -v ${WORKSPACE}:${env.WORKSPACE_DIR} \\
                    -w ${env.WORKSPACE_DIR} \\
                    mcr.microsoft.com/playwright:v1.39.0-jammy \\
                    bash -c \\
                    "set -e;
                    echo 'Updating packages list';
                    apt-get update;
                    echo 'Installing Allure';
                    apt-get install -y allure;
                    echo 'Starting npm install';
                    npm install;
                    echo 'Starting npm test';
                    npm test > test_output.log 2>&1 || true; # we allow tests to fail to proceed to report generation
                    echo 'Generating Allure report';
                    allure generate --clean -o ${env.WORKSPACE_DIR}/allure-report ${env.WORKSPACE_DIR}/allure-results;
                    "
                    """
                }
            }
        }
    }
    post {
        always {
            script {
                // Copy the Allure report from the Docker volume to the Jenkins workspace for publishing
                sh "docker run --rm -v ${env.TEST_RESULTS_VOLUME}:${env.WORKSPACE_DIR} -w ${env.WORKSPACE_DIR} busybox tar -czf - allure-report | tar -C ${env.WORKSPACE} -xzf -"

                // Check if the allure-report directory exists before attempting to publish it
                if (fileExists("${WORKSPACE}/allure-report")) {
                    // Publish the Allure report
                    allure([
                        includeProperties: false,
                        jdk: '',
                        properties: [],
                        reportBuildPolicy: 'ALWAYS',
                        results: [[path: 'allure-report']]
                    ])
                } else {
                    echo "No allure-report directory found, skipping report publishing."
                }

                // Clean up the Docker volume if you don't need to persist the results after the job
                sh "docker volume rm ${env.TEST_RESULTS_VOLUME} || true"
            }
        }
    }
}
