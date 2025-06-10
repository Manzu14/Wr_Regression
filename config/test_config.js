const { AGENT_TYPE = 'inhouse', ENV = 'stng', COUNTRY = 'be', IS_PACKAGE = true } = process.env;

/**
 * @return {"dev"|"dev2"|"dev4"|"stng"|"sit"|"pprd"|"prod"}
 */
function getEnv() {
    return ENV.toLowerCase();
}

function getAgentType() {
    return AGENT_TYPE.toLowerCase();
}

function isInhouse(agent) {
    return (agent || getAgentType()) === 'inhouse';
}

function isThirdParty(agent) {
    return (agent || getAgentType()) === '3rdparty';
}

function getCountryType() {
    return COUNTRY.toLowerCase();
}

function getLanguage() {
    return isMA() ? 'fr' : 'nl';
}

function isPackage() {
    if (typeof IS_PACKAGE === 'string' && IS_PACKAGE.toLowerCase() === 'false') return false;
    else return !!IS_PACKAGE;
}

function isNL(country) {
    return (country || getCountryType()) === 'nl';
}

function isBE(country) {
    return (country || getCountryType()) === 'be';
}

function isVip(country) {
    return (country || getCountryType()) === 'vip';
}

function isMA(country) {
    return (country || getCountryType()) === 'ma';
}

function getBaseUrl(env = ENV.toLowerCase(), country = COUNTRY.toLowerCase(), agent = AGENT_TYPE.toLowerCase()) {
    return getLoginUrl(env, country, agent).replace(/(\/thirdpartyagent|\/inhouse)\/login/, '/nl');
}

/**
 * This function generates a URL based on the environment, country, and agent type.
 * The parameters are taken from the process environment variables by default, but can be overridden when calling the function.
 *
 * @param {string} env - The environment for the URL. Default value is the ENV environment variable converted to lowercase.
 * @param {string} country - The country for the URL. Default value is the COUNTRY environment variable converted to lowercase.
 * @param {string} agent - The agent type for the URL. Default value is the AGENT_TYPE environment variable converted to lowercase.
 *
 * @returns {string} The generated URL.
 */
function getLoginUrl(env = ENV.toLowerCase(), country = COUNTRY.toLowerCase(), agent = AGENT_TYPE.toLowerCase()) {
    if (isInhouse(agent)) {
        return getInHouseUrl(env, country);
    } else if (isThirdParty(agent)) {
        return get3rdPartyUrl(env, country);
    }
}

function get3rdPartyUrl(env, country) {
    if (isNL() || isBE()) {
        return `https://${env}-retailagents.tuiprjuat.${country}/retail/thirdpartyagent/login`;
    } else if (isVip()) {
        return `https://${env}-retailagents.tuiprjuat.be/retail/thirdpartyagent/login`;
    } else if (isMA()) {
        return `https://${env}-retailagents.tuiflyprjuat.ma/retail/thirdpartyagent/login`;
    } else {
        throw new Error(`Impossible to form 3rd PARTY AGENT URL for '${country.toUpperCase()}' on '${env.toUpperCase()}' environment`);
    }
}

function getInHouseUrl(env, country) {
    return `https://tuiretail-${country}-${env}.tuiad.net/retail/inhouse/login`;
}

module.exports = {
    getLoginUrl,
    getBaseUrl,
    getEnv,
    isInhouse,
    isThirdParty,
    getAgentType,
    getCountryType,
    getLanguage,
    isVip,
    isPackage,
    isNL,
    isBE,
    isMA,
};
