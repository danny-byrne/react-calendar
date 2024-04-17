/** Regex source:
 * Regular Expressions Cookbook, 2nd Edition.
 * 4.2. Validate and Format North American Phone Numbers
 * Note: If passing an international phone number, it will only match the US country code 1.
 */
export const phoneRegex = /^(\+?1[-. ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

export const isValidPhone = (value: string): boolean => {
    return value && phoneRegex.test(value);
};

/** Regex source:
 * Regular Expressions Cookbook, 2nd Edition.
 * 4.1. Validate Email Addresses
 */
const emailRegex = /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i;

export const isValidEmail = (value: string): boolean => {
    return value && emailRegex.test(value);
};

/** Valid characters are taken from `emailRegex` */
export const emailRegexValidCharacters = /^[\w.@!#$%&'*+/=?`{|}~^-]+$/;

export const firstNameRegex = /^[a-zA-Z\-.', \b]+$/;

/** Regex source:
 * Regular Expressions Cookbook, 2nd Edition.
 * 4.4. Validate Traditional Date Formats
 * Solution 4: Match mm/dd/yyyy, requiring leading zeros.
 */
export const dateRegex = /^(1[0-2]|0[1-9])\/(3[01]|[12][0-9]|0[1-9])\/[0-9]{4}$/;

export const isValidFeet = (value: string): boolean => {
    const number = Number(value);
    return number >= 0 && number <= 8;
};

export const isValidInches = (value: number | string): boolean => {
    const number = Number(value);
    return number >= 0 && number <= 11.99;
};
