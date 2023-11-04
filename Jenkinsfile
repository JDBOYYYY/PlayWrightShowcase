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
                    -v ${env.TEST_RESULTS_VOLUME}:/test_results \\
                    -v ${WORKSPACE}:/jenkins_workspace \\
                    -w /jenkins_workspace \\
                    mcr.microsoft.com/playwright:v1.39.0-jammy \\
                    bash -c \\
                    "set -e;
                    echo 'Updating packages list';
                    apt-get update;
                    echo 'Installing Java';
                    apt-get install -y openjdk-11-jdk; # You can choose the version of Java that is compatible with Allure
                    export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64; # Set JAVA_HOME appropriately for the installed Java version
                    export PATH=\$PATH:\$JAVA_HOME/bin;
                    echo 'Installing Allure';
                    wget https://repo.maven.apache.org/maven2/io/qameta/allure/allure-commandline/2.17.2/allure-commandline-2.17.2.tgz -O allure.tgz;
                    tar -zxvf allure.tgz -C /opt/;
                    ln -s /opt/allure-2.17.2/bin/allure /usr/bin/allure;
                    echo 'Checking Allure installation';
                    /usr/bin/allure --version || echo 'Allure command not found';
                    echo 'Starting npm install';
                    npm install;
                    echo 'Starting npm test';
                    npm test > /test_results/test_output.log 2>&1 || true; # we allow tests to fail to proceed to report generation
                    # Make sure the directory for allure-results exists
                    mkdir -p /test_results/allure-results
                    echo 'Generating Allure report';
                    /usr/bin/allure generate --clean -o /test_results/allure-report /test_results/allure-results;
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
