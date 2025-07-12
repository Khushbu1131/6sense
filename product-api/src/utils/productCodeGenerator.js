const crypto = require('crypto');

function generateHash(name) {
    return crypto.createHash('md5').update(name).digest('hex').substring(0, 8);
}

function longestIncreasingSubstrings(name) {
    const str = name.toLowerCase().replace(/[^a-z]/g, '');
    let substrings = [];
    let temp = str[0];
    let maxLen = 1;

    for (let i = 1; i < str.length; i++) {
        if (str[i] > str[i - 1]) {
            temp += str[i];
        } else {
            if (temp.length >= maxLen) {
                if (temp.length > maxLen) substrings = [];
                substrings.push(temp);
                maxLen = temp.length;
            }
            temp = str[i];
        }
    }
    if (temp.length >= maxLen) {
        if (temp.length > maxLen) substrings = [];
        substrings.push(temp);
    }

    return substrings;
}

function generateProductCode(name) {
    const hash = generateHash(name);
    const substrings = longestIncreasingSubstrings(name);

    let indices = [];
    for (let sub of substrings) {
        let start = name.toLowerCase().indexOf(sub);
        let end = start + sub.length - 1;
        indices.push(`${start}${sub}${end}`);
    }

    return `${hash}-${indices.join('')}`;
}

module.exports = generateProductCode;