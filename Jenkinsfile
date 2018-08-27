#!groovy
def CMS_PACKAGE_TYPE='cms'
def API_PACKAGE_TYPE='api'
def UI_PACKAGE_TYPE='ui'

void failSafeBuild(configId, packageType){
    try {
        env.BUILD_STEP_SUCCESS = 'no'
        def targetLocation = ''
        
        // set target location based on package type
        if(packageType == 'cms'){
          targetLocation =  './cms/pm2.config.js'
        } else if (packageType == 'api'){
          targetLocation = './api/pm2.config.js'
        } else if (packageType == 'ui'){
          targetLocation = './ui/.env'
        }
        configFileProvider([configFile(fileId: configId, targetLocation: targetLocation)]){
        sh '''
        portal-ci/build_stage/build.sh portal-ci '''+packageType+'''
        '''
        env.BUILD_STEP_SUCCESS = 'yes'
        }
    } catch (err) {
       env.BUILD_STEP_SUCCESS = 'no'
       echo "Required configuration for $packageType not found. Skipping the build for $packageType."
    }
}

void getPipelineResult (){
    script {
        // fail the build if all deployment stages were skipped
        if(env.DEV_DEPLOYMENT_STATUS == null && env.QA_DEPLOYMENT_STATUS == null && env.PRD_DEPLOYMENT_STATUS == null) {
            echo 'Build failed because application was not deployed to any environment.'
            echo 'Please make sure Jenkins has all required configuration files and variables.'
            currentBuild.result = 'FAILURE'
        } else {
          echo 'Build is considered successful because application was successfully deployed in at least one target environment.'
        }
    }
}

properties([
    pipelineTriggers([
        pollSCM('H/5 * * * *')
    ])
])
node ('default-lower||default-builder') {
    configFileProvider([configFile(fileId: 'hcmi-env-config', variable: 'FILE')]) {
        echo "FILE=$FILE"
        load "$FILE"
    }
}
pipeline {
  agent { label 'default-lower||default-builder' }
  stages{
    stage('Get Code') {
      steps {
        echo "Workspace directory is ${env.WORKSPACE}"
          deleteDir()
          checkout ([
              $class: 'GitSCM',
              branches: scm.branches,
              doGenerateSubmoduleConfigurations: scm.doGenerateSubmoduleConfigurations,
              extensions: [[$class: 'CloneOption', noTags: false, shallow: false, depth: 0, reference: '']],
              userRemoteConfigs: scm.userRemoteConfigs,
           ])
           script {
               tag=sh(returnStdout: true, script: "git tag -l --points-at HEAD").trim()
               env.tag = tag
             }
      }
    }
    stage('GetOpsScripts') {
      steps {
        echo "GETTING SCRIPTS"
        sh '''
        git clone '''+PORTAL_CI_URL+'''
        '''
      }
    }
    stage('Build Dev') {
      steps {
        failSafeBuild('hcmi-cms-dev-config',CMS_PACKAGE_TYPE)
        failSafeBuild('hcmi-api-dev-config',API_PACKAGE_TYPE)
        failSafeBuild('hcmi-ui-dev-config',UI_PACKAGE_TYPE)
      }
    }
    stage('Deploy Dev') {
      when{
        environment name: 'BUILD_STEP_SUCCESS', value: 'yes'
      }
      steps {
        echo "DEPLOYING TO DEVELOPMENT: (${env.BUILD_URL})"
        sshagent (credentials: ["$DEV_CREDS"]) {
          sh (returnStdout: false, script: "ssh -o StrictHostKeyChecking=no $APP_USER@$CMS_DEV_SERVER \"set -x; if [ ! -d $REMOTE_DIR/hcmi/deploy/$BUILD_NUMBER/ ]; then mkdir -p $REMOTE_DIR/hcmi/deploy/$BUILD_NUMBER/ || exit \$?; fi\" && scp ${CMS_PACKAGE_TYPE}.tar portal-ci/deploy_stage/deploy.sh $APP_USER@$CMS_DEV_SERVER:$REMOTE_DIR/hcmi/deploy/$BUILD_NUMBER/ && ssh -o StrictHostKeyChecking=no $APP_USER@$CMS_DEV_SERVER \"set -x; cd $REMOTE_DIR/hcmi && bash deploy/$BUILD_NUMBER/deploy.sh dev $BUILD_NUMBER $CMS_PACKAGE_TYPE\""
          )
          sh (returnStdout: false, script: "ssh -o StrictHostKeyChecking=no $APP_USER@$API_DEV_SERVER \"set -x; if [ ! -d $REMOTE_DIR/hcmi/deploy/$BUILD_NUMBER/ ]; then mkdir -p $REMOTE_DIR/hcmi/deploy/$BUILD_NUMBER/ || exit \$?; fi\" && scp ${API_PACKAGE_TYPE}.tar portal-ci/deploy_stage/deploy.sh $APP_USER@$API_DEV_SERVER:$REMOTE_DIR/hcmi/deploy/$BUILD_NUMBER/ && ssh -o StrictHostKeyChecking=no $APP_USER@$API_DEV_SERVER \"set -x; cd $REMOTE_DIR/hcmi && bash deploy/$BUILD_NUMBER/deploy.sh dev $BUILD_NUMBER $API_PACKAGE_TYPE\""
          )
          sh (returnStdout: false, script: "ssh -o StrictHostKeyChecking=no $APP_USER@$UI_DEV_SERVER \"set -x; if [ ! -d $REMOTE_DIR/hcmi/deploy/$BUILD_NUMBER/ ]; then mkdir -p $REMOTE_DIR/hcmi/deploy/$BUILD_NUMBER/ || exit \$?; fi\" && scp ${UI_PACKAGE_TYPE}.tar portal-ci/deploy_stage/deploy.sh $APP_USER@$UI_DEV_SERVER:$REMOTE_DIR/hcmi/deploy/$BUILD_NUMBER/ && ssh -o StrictHostKeyChecking=no $APP_USER@$UI_DEV_SERVER \"set -x; cd $REMOTE_DIR/hcmi && bash deploy/$BUILD_NUMBER/deploy.sh dev $BUILD_NUMBER $UI_PACKAGE_TYPE\""
          )
        }
        echo "DEPLOYED TO DEVELOPMENT: (${env.BUILD_URL})"
        script {
            env.DEV_DEPLOYMENT_STATUS = 'SUCCESS'
        }
        
      }
      post {
        failure {
          echo "Deploy Failed: Branch '${env.BRANCH_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})"
        }
      }
    }
    stage('Build QA') {
      steps {
        failSafeBuild('hcmi-cms-qa-config',CMS_PACKAGE_TYPE)
        failSafeBuild('hcmi-api-qa-config',API_PACKAGE_TYPE)
        failSafeBuild('hcmi-ui-qa-config',UI_PACKAGE_TYPE)
      }
    }
    stage('Deploy QA') {
      when {
       environment name: 'BUILD_STEP_SUCCESS', value: 'yes'
       expression {
           return env.BRANCH_NAME == 'master';
       }
     }
      steps {
     echo "DEPLOYING TO QA: (${env.BUILD_URL})"
        sshagent (credentials: ["$QA_CREDS"]) {
          sh (returnStdout: false, script: "ssh -o StrictHostKeyChecking=no $APP_USER@$CMS_QA_SERVER \"set -x; if [ ! -d $REMOTE_DIR/hcmi/deploy/$BUILD_NUMBER/ ]; then mkdir -p $REMOTE_DIR/hcmi/deploy/$BUILD_NUMBER/ || exit \$?; fi\" && scp ${CMS_PACKAGE_TYPE}.tar portal-ci/deploy_stage/deploy.sh $APP_USER@$CMS_QA_SERVER:$REMOTE_DIR/hcmi/deploy/$BUILD_NUMBER/ && ssh -o StrictHostKeyChecking=no $APP_USER@$CMS_QA_SERVER \"set -x; cd $REMOTE_DIR/hcmi && bash deploy/$BUILD_NUMBER/deploy.sh qa $BUILD_NUMBER $CMS_PACKAGE_TYPE\""
          )
          sh (returnStdout: false, script: "ssh -o StrictHostKeyChecking=no $APP_USER@$API_QA_SERVER \"set -x; if [ ! -d $REMOTE_DIR/hcmi/deploy/$BUILD_NUMBER/ ]; then mkdir -p $REMOTE_DIR/hcmi/deploy/$BUILD_NUMBER/ || exit \$?; fi\" && scp ${API_PACKAGE_TYPE}.tar portal-ci/deploy_stage/deploy.sh $APP_USER@$API_QA_SERVER:$REMOTE_DIR/hcmi/deploy/$BUILD_NUMBER/ && ssh -o StrictHostKeyChecking=no $APP_USER@$API_QA_SERVER \"set -x; cd $REMOTE_DIR/hcmi && bash deploy/$BUILD_NUMBER/deploy.sh qa $BUILD_NUMBER $API_PACKAGE_TYPE\""
          )
          sh (returnStdout: false, script: "ssh -o StrictHostKeyChecking=no $APP_USER@$UI_QA_SERVER \"set -x; if [ ! -d $REMOTE_DIR/hcmi/deploy/$BUILD_NUMBER/ ]; then mkdir -p $REMOTE_DIR/hcmi/deploy/$BUILD_NUMBER/ || exit \$?; fi\" && scp ${UI_PACKAGE_TYPE}.tar portal-ci/deploy_stage/deploy.sh $APP_USER@$UI_QA_SERVER:$REMOTE_DIR/hcmi/deploy/$BUILD_NUMBER/ && ssh -o StrictHostKeyChecking=no $APP_USER@$UI_QA_SERVER \"set -x; cd $REMOTE_DIR/hcmi && bash deploy/$BUILD_NUMBER/deploy.sh qa $BUILD_NUMBER $UI_PACKAGE_TYPE\""
          )
        }
        
       echo "DEPLOYED TO QA: (${env.BUILD_URL})"
       script {
            env.QA_DEPLOYMENT_STATUS = 'SUCCESS'
        }
        
     }
     post {
       failure {
         echo "Deploy Failed: Branch '${env.BRANCH_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})"
       }
     }
    }
    stage('Build PRD') {
      steps {
        failSafeBuild('hcmi-cms-prd-config',CMS_PACKAGE_TYPE)
        failSafeBuild('hcmi-api-prd-config',API_PACKAGE_TYPE)
        failSafeBuild('hcmi-ui-prd-config',UI_PACKAGE_TYPE)
      }
    }
    stage('Deploy PRD') {
      when {
       environment name: 'BUILD_STEP_SUCCESS', value: 'yes'
       expression {
           return env.BRANCH_NAME == 'master';
       }
       expression {
           return tag != '';
       }
     }
      steps {
     echo "DEPLOYING TO PRD: (${env.BUILD_URL})"
        sshagent (credentials: ["$PRD_CREDS"]) {
          sh (returnStdout: false, script: "ssh -o StrictHostKeyChecking=no $APP_USER@$CMS_PRD_SERVER \"set -x; if [ ! -d $REMOTE_DIR/hcmi/deploy/$BUILD_NUMBER/ ]; then mkdir -p $REMOTE_DIR/hcmi/deploy/$BUILD_NUMBER/ || exit \$?; fi\" && scp ${CMS_PACKAGE_TYPE}.tar portal-ci/deploy_stage/deploy.sh $APP_USER@$CMS_PRD_SERVER:$REMOTE_DIR/hcmi/deploy/$BUILD_NUMBER/ && ssh -o StrictHostKeyChecking=no $APP_USER@$CMS_PRD_SERVER \"set -x; cd $REMOTE_DIR/hcmi && bash deploy/$BUILD_NUMBER/deploy.sh prd $BUILD_NUMBER $CMS_PACKAGE_TYPE\""
          )
          sh (returnStdout: false, script: "ssh -o StrictHostKeyChecking=no $APP_USER@$API_PRD_SERVER \"set -x; if [ ! -d $REMOTE_DIR/hcmi/deploy/$BUILD_NUMBER/ ]; then mkdir -p $REMOTE_DIR/hcmi/deploy/$BUILD_NUMBER/ || exit \$?; fi\" && scp ${API_PACKAGE_TYPE}.tar portal-ci/deploy_stage/deploy.sh $APP_USER@$API_PRD_SERVER:$REMOTE_DIR/hcmi/deploy/$BUILD_NUMBER/ && ssh -o StrictHostKeyChecking=no $APP_USER@$API_PRD_SERVER \"set -x; cd $REMOTE_DIR/hcmi && bash deploy/$BUILD_NUMBER/deploy.sh prd $BUILD_NUMBER $API_PACKAGE_TYPE\""
          )
          sh (returnStdout: false, script: "ssh -o StrictHostKeyChecking=no $APP_USER@$UI_PRD_SERVER \"set -x; if [ ! -d $REMOTE_DIR/hcmi/deploy/$BUILD_NUMBER/ ]; then mkdir -p $REMOTE_DIR/hcmi/deploy/$BUILD_NUMBER/ || exit \$?; fi\" && scp ${UI_PACKAGE_TYPE}.tar portal-ci/deploy_stage/deploy.sh $APP_USER@$UI_PRD_SERVER:$REMOTE_DIR/hcmi/deploy/$BUILD_NUMBER/ && ssh -o StrictHostKeyChecking=no $APP_USER@$UI_PRD_SERVER \"set -x; cd $REMOTE_DIR/hcmi && bash deploy/$BUILD_NUMBER/deploy.sh prd $BUILD_NUMBER $UI_PACKAGE_TYPE\""
          )
        }
        
       echo "DEPLOYED TO PRD: (${env.BUILD_URL})"
       script {
            env.PRD_DEPLOYMENT_STATUS = 'SUCCESS'
        }
        
     }
     post {
       failure {
         echo "Deploy Failed: Branch '${env.BRANCH_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})"
       }
     }
    }
  }
  post{
    always {
        getPipelineResult()
    }
  }
}