const { getAgentType, getCountryType, getEnv } = require('../../config/test_config');
const { logger } = require('./logger');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const { JIRA_TOKEN_BEARER, CI_JOB_ID } = process.env;
const jiraUrl = 'https://jira.tuigroup.com';

async function updateTestResults() {
    const currentDate = new Date().toISOString().split('T')[0];
    const jsonObject = {
        fields: {
            project: { key: 'B2B' },
            summary: `Package B2B UI - ${getEnv().toUpperCase()} - ${getCountryType().toUpperCase()} - ${getAgentType().toUpperCase()} - ${currentDate}`,
            description: `https://source.tui/osp/tech-practices/qa/western-region/package-js-pw-automation/-/jobs/${CI_JOB_ID}/artifacts/playwright-report/index.html`,
            issuetype: { name: 'Test Execution' },
        },
    };
    const jsonString = JSON.stringify(jsonObject, null, 2);
    const data = new FormData();
    data.append('file', fs.createReadStream(`./junit-report/${getAgentType()}-${getCountryType()}-xray-report.xml`));
    data.append('info', jsonString);

    const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${jiraUrl}/rest/raven/1.0/import/execution/junit/multipart`,
        headers: {
            Authorization: `Bearer ${JIRA_TOKEN_BEARER}`,
            'Content-Type': 'multipart/form-data',
            ...data.getHeaders(),
        },
        data: data,
    };
    await axios
        .request(config)
        .catch(e => {
            logger.error(e.response.data.error || e.response.data.message || e.response.data || e.response);
        })
        .then(response => {
            if (response) {
                logger.info(`Test Execution can be found at https://jira.tuigroup.com/browse/${response?.data?.testExecIssue?.key}`);
            }
        });
}

updateTestResults().then();
