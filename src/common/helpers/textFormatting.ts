import { Month } from 'src/graphQL/serverMocks/graphQLGeneratedCode';

export function capitalizeFirstLetter(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

export function capitalizeOnlyFirstLetter(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export function capitalizeFirstLetterOfEachWord(value: string) {
    const words = value.toLocaleLowerCase().split(' ');

    for (let i = 0; i < words.length; i++) {
        if (words[i].length > 1) {
            words[i] = words[i][0].toUpperCase() + words[i].slice(1).toLowerCase();
        } else if (words[i].length === 1) {
            words[i] = words[i].toUpperCase();
        }
    }

    const formattedString = words.join(' ');

    return formattedString;
}

export function formatZip(value: string) {
    if (value.length === 5) {
        return value;
    }

    if (value.indexOf('-') > 0) {
        return value;
    }

    return `${value.slice(0, 5)}-${value.slice(5)}`;
}

export function formatDate(year: number, month?: Month, day?: number) {
    let formattedDate = `${year}`;
    if (month) {
        const formattedMonth = capitalizeOnlyFirstLetter(month);
        const monthDayText = day ? `${formattedMonth} ${day},` : formattedMonth;
        formattedDate = `${monthDayText} ${formattedDate}`;
    }
    return formattedDate;
}

export const snakeCaseToCapitalized = (string) => {
    return string
        .split('_')
        .map((e) => capitalizeFirstLetter(e.toLowerCase()))
        .join(' ');
};
