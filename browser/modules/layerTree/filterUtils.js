/**
 * Utilities for working woth layer filters
 */

const MATCHES = [`any`, `all`];


const ALLOWED_EXPRESSIONS_MAP = {



};


const EXPRESSIONS_FOR_STRINGS = [`=`, `<>`, `like`];
const EXPRESSIONS_FOR_NUMBERS = [`=`, `<>`, `<`, `>`, `<=`, `>=`];
const EXPRESSIONS_FOR_DATES = [`=`, `<>`, `<`, `>`, `<=`, `>=`];
const EXPRESSIONS_FOR_BOOLEANS = [`=`];
const EXPRESSIONS = []
    .concat(EXPRESSIONS_FOR_NUMBERS)
    .concat(EXPRESSIONS_FOR_STRINGS)
    .concat(EXPRESSIONS_FOR_DATES)
    .concat(EXPRESSIONS_FOR_BOOLEANS)
    .filter((v, i, a) => a.indexOf(v) === i);

/**
 * Checks validity of the filters object
 * 
 * @throws {Error}
 */
const validateFilters = (filters) => {
    let errors = [];
    if (`match` in filters === false) errors.push(`Missing match property in filters`);
    if (MATCHES.indexOf(filters.match) === -1) errors.push(`Invalid match in filters`);

    if (`columns` in filters === false) errors.push(`Missing columns property in filters`);
    if (Array.isArray(filters.columns) === false) errors.push(`Invalid filter columns`);
    filters.columns.map(column => {
        if (`fieldname` in column === false) errors.push(`Column fieldname does not exist`);
        if (`expression` in column === false || (EXPRESSIONS.indexOf(column.expression) === -1 && column.expression !== `null`)) errors.push(`Invalid column expression`);
        if (`value` in column === false) errors.push(`Column value does not exist`);
    });

    if (errors.length > 0) {
        console.error(`Invalid filters: ${errors.join(`,`)}`);
        throw new Error(`Invalid filters`);
    }
};

export { validateFilters, MATCHES, EXPRESSIONS_FOR_STRINGS, EXPRESSIONS_FOR_NUMBERS, EXPRESSIONS_FOR_DATES, EXPRESSIONS_FOR_BOOLEANS, EXPRESSIONS };