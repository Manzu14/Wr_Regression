const {
    CI_PROJECT_PATH,
    CI_PIPELINE_ID,
    CI_PROJECT_NAMESPACE,
    CI_PROJECT_NAME,
    MENTION_IN_TEAMS,
    GITLAB_USER_NAME,
    GITLAB_USER_EMAIL,
    CI_PIPELINE_CREATED_AT,
    ENV,
} = process.env;

const fs = require('fs');
const path = require('path');
const reportDirectory = path.join(__dirname, '../../junit-report');
const { isPackage } = require('../../config/test_config');
const jsonpath = require('jsonpath');
const validator = require('validator');
const files = fs
    .readdirSync(reportDirectory)
    .filter(file => file.endsWith('xray-report.xml'))
    .map(file => path.join(reportDirectory, file));
const SHOW_TEST_RESULT_TABLE_ID = 'showTestResultTable';
const TABLE_CELL_TYPE = 'TableCell';
const TEXT_BLOCK_TYPE = 'TextBlock';
const ACTION_SET_TYPE = 'ActionSet';
const ACTION_OPEN_URL_TYPE = 'Action.OpenUrl';
const ACTION_TOGGLE_VISIBILITY_TYPE = 'Action.ToggleVisibility';
const CONTAINER_TYPE = 'Container';
const TABLE_TYPE = 'Table';
const TABLE_ROW_TYPE = 'TableRow';

const SKIP_KEY = 'skip';
const PASS_KEY = 'pass';
const FAIL_KEY = 'fail';
const PASS_ICON = '✅';
const FAIL_ICON = '❌';
const SKIP_ICON = '⚠️';

const NA = 'N/A';

function run() {
    return async ({ payload, result }) => {
        const { entities, mentioned } = MENTION_IN_TEAMS ? generateMentions() : {};
        payload.msteams = { entities };
        payload.body = getBody(result, payload, mentioned);
        payload.actions = getActions();
    };
}

function getBody(result, payload, mentioned) {
    const summaryResult = getSummaryResults(result, payload);
    const specHeader = getSpecHeader(result);
    const { expandTestResultTable, testResultTable } = getTestResultTable(result);
    return [summaryResult, specHeader, expandTestResultTable, testResultTable, ...(mentioned !== undefined ? [mentioned] : [])];
}

function getActions() {
    return [
        {
            type: ACTION_OPEN_URL_TYPE,
            title: 'Open GitLab pipeline in default browse >',
            url: `https://source.tui/${CI_PROJECT_PATH}/-/pipelines/${CI_PIPELINE_ID}`,
        },
    ];
}

function getSpecHeader(result) {
    return {
        type: TEXT_BLOCK_TYPE,
        text: `**Test type:** ${result?.suites[0]?.cases[0]?.metadata?.tag || NA}`,
        size: 'Medium',
        wrap: true,
        horizontalAlignment: 'Left',
        isSubtle: true,
        style: 'heading',
        separator: true,
    };
}

function getResults(testResults, agent, country) {
    return testResults.filter(item => item.params.agent === agent && item.params.country === country);
}

function getTestCaseStatus(result) {
    const allResults = jsonpath.query(result, '$[*].result');
    if (allResults.length === 0) {
        return { title: prettyKey(SKIP_KEY), tooltip: 'This pair was not executed due to busines requirements.' };
    }
    const resultCounts = allResults.reduce((acc, result) => {
        acc[result] = (acc[result] || 0) + 1;
        return acc;
    }, {});

    function prettyKey(key) {
        switch (key) {
            case PASS_KEY:
                return PASS_ICON;
            case FAIL_KEY:
                return FAIL_ICON;
            case SKIP_KEY:
            default:
                return SKIP_ICON;
        }
    }

    function getTitle() {
        if (resultCounts.fail > 0) {
            return `${prettyKey(FAIL_KEY)}`;
        } else if (resultCounts.pass > 0) {
            return `${prettyKey(PASS_KEY)}`;
        } else if (resultCounts.skip > 0) {
            return `${prettyKey(SKIP_KEY)}`;
        }
    }

    const order = [FAIL_KEY, PASS_KEY, SKIP_KEY];
    return {
        title: getTitle(),
        tooltip: Object.entries(resultCounts)
            .filter(([key, value]) => value > 0)
            .sort(([keyA], [keyB]) => order.indexOf(keyA) - order.indexOf(keyB))
            .map(([key, value]) => `${value}${prettyKey(key)} `)
            .filter(text => text !== 'undefined') // Filter out undefined values
            .join('\n'),
    };
}

function minifyArray(array) {
    return [...new Set(array)];
}

function getSummaryResults(result, payload) {
    const env = minifyArray(jsonpath.query(result, '$.suites[*].cases[*].metadata.env'));

    const originalResult = payload.body[0];
    const factSet = [{ title: 'TEAM', value: `B2B ${isPackage() ? 'Package' : 'Flight Only'}` }];
    factSet.push(...originalResult.columns[0].items[1].facts);
    const overallResultsSummary = originalResult.columns[1];
    factSet.push({
        title: 'Status:',
        value: result.status,
    });
    if (GITLAB_USER_NAME && GITLAB_USER_EMAIL) {
        factSet.push({
            title: 'Executed by:',
            value: `${GITLAB_USER_NAME} <${GITLAB_USER_EMAIL}>`,
        });
    }
    if (CI_PIPELINE_CREATED_AT) {
        factSet.push({
            title: 'Executed at:',
            value: `${CI_PIPELINE_CREATED_AT}`,
        });
    }
    factSet.push({
        title: 'Environments:',
        value: env.join(', '),
    });
    return {
        type: 'ColumnSet',
        columns: [
            {
                type: 'Column',
                items: [
                    {
                        type: 'FactSet',
                        facts: factSet,
                    },
                ],
            },
            overallResultsSummary,
        ],
    };
}

function getUrl(result) {
    const jobId = jsonpath.query(result, '$[*].params.jobId')[0];
    if (!jobId || !CI_PROJECT_NAMESPACE) return 'URL pleceholder';
    const separator = '/';
    const parts = CI_PROJECT_NAMESPACE.split(separator);
    const prefix = parts[0];
    const projectNamespace = parts.slice(1).join(separator);
    return `https://${prefix}.pages.devops.tui/-/${projectNamespace}/${CI_PROJECT_NAME}/-/jobs/${jobId}/artifacts/playwright-report/index.html`;
}

function getTestResults(result) {
    const testResults = [];
    result.suites.forEach(suite => {
        suite.cases.forEach(testCase => {
            if (testCase?.metadata?.fixme === undefined && testCase.metadata.skip === undefined) {
                testResults.push({
                    result: testCase.status.toLowerCase(),
                    params: testCase.metadata,
                });
            }
        });
    });
    return testResults;
}

function getTestResultTable(result) {
    const testResults = getTestResults(result);
    const agents = minifyArray(testResults.map(item => item.params.agent));
    const countries = minifyArray(testResults.map(item => item.params.country));

    const headers = ['', ...countries];

    return {
        expandTestResultTable: createExpandAction('Show Test Result table'),
        testResultTable: createTestResultTable(headers, agents, countries, testResults),
    };
}

function createExpandAction(title) {
    return {
        type: ACTION_SET_TYPE,
        actions: [
            {
                type: ACTION_TOGGLE_VISIBILITY_TYPE,
                targetElements: [SHOW_TEST_RESULT_TABLE_ID],
                title,
            },
        ],
    };
}

function createTestResultTable(headers, agents, countries, testResults) {
    const facts = [];

    testResults.forEach(testResult => {
        const { env, agent, country, bookingRefernceNumber } = testResult.params;
        if (bookingRefernceNumber) {
            facts.push({ title: `${env}-${agent}-${country}:`, value: bookingRefernceNumber });
        }
    });
    const factSet = { type: 'FactSet', facts };
    return {
        type: CONTAINER_TYPE,
        id: SHOW_TEST_RESULT_TABLE_ID,
        isVisible: false,
        items: [
            {
                type: TABLE_TYPE,
                id: 'testResultTable',
                columns: headers.map(() => ({ width: 100 })),
                rows: createTableRows(headers, agents, countries, testResults),
            },
            factSet,
        ],
    };
}

function createTableRows(headers, agents, countries, testResults) {
    return [createHeaderRow(headers), ...agents.map(agent => createAgentRow(agent, countries, testResults))];
}

function createHeaderRow(headers) {
    return {
        type: TABLE_ROW_TYPE,
        cells: headers.map(header => createHeaderCell(header)),
    };
}

function createHeaderCell(header) {
    return {
        type: TABLE_CELL_TYPE,
        items: [
            {
                type: TEXT_BLOCK_TYPE,
                weight: header ? 'Bolder' : 'Default',
                text: header.toUpperCase(),
                wrap: true,
            },
        ],
    };
}

function createAgentRow(agent, countries, testResults) {
    return {
        type: TABLE_ROW_TYPE,
        cells: createAgentCells(agent, countries, testResults),
    };
}

function createAgentCells(agent, countries, testResults) {
    return [createAgentHeaderCell(agent), ...countries.map(country => createCountryCell(agent, country, testResults))];
}

function createAgentHeaderCell(agent) {
    return {
        type: TABLE_CELL_TYPE,
        items: [
            {
                type: TEXT_BLOCK_TYPE,
                weight: 'Bolder',
                text: agent.toUpperCase(),
                wrap: true,
            },
        ],
    };
}

function createCountryCell(agent, country, testResults) {
    const result = getResults(testResults, agent, country);
    const { title, tooltip } = getTestCaseStatus(result);
    return {
        type: TABLE_CELL_TYPE,
        items: [
            {
                type: ACTION_SET_TYPE,
                actions: [
                    {
                        type: ACTION_OPEN_URL_TYPE,
                        url: getUrl(result),
                        title,
                        tooltip,
                    },
                ],
            },
        ],
    };
}

function generateMentions() {
    const emailList = MENTION_IN_TEAMS.replaceAll('"', '').replaceAll(' ', '').split(',');
    const validEmails = emailList.filter(email => validator.default.isEmail(email));
    const invalidEmails = emailList.filter(email => !validator.default.isEmail(email));
    const entities = validEmails.map(email => ({
        type: 'mention',
        text: `<at>${email}</at>`,
        mentioned: {
            id: email,
        },
    }));

    const mentioned = {
        type: CONTAINER_TYPE,
        items: [
            {
                type: TEXT_BLOCK_TYPE,
                text: jsonpath.query(entities, '$[*].text').join(', '),
                separator: true,
                wrap: true,
            },
            {
                type: TEXT_BLOCK_TYPE,
                text: invalidEmails.length > 0 ? `Incorrect emails provided in pipeline configuraion:\n${invalidEmails}` : '',
                separator: true,
                wrap: true,
            },
        ],
    };
    return { entities, mentioned };
}

module.exports = {
    targets: [
        {
            name: 'teams',
            inputs: {
                url: process.env[`POWERAUTOMATE_URL_${(ENV || '').toUpperCase()}`],
            },
            extensions: [
                {
                    name: 'quick-chart-test-summary',
                },
                {
                    name: 'custom',
                    inputs: {
                        load: run(),
                    },
                },
            ],
        },
    ],
    results: [
        {
            type: 'junit',
            files,
        },
    ],
};
