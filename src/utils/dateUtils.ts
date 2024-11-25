import 'moment/dist/locale/id';
import moment, {Moment} from 'moment-timezone';

moment.tz.setDefault('Asia/Jakarta');

moment.updateLocale('id', {
    longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY[,] HH:mm',
        LLLL: 'dddd, D MMMM YYYY[,] HH:mm',
    },
    calendar: {
        sameDay: '[Hari ini,] LT',
        nextDay: '[Besok,] LT',
        nextWeek: 'dddd[,] LT',
        lastDay: '[Kemarin,] LT',
        lastWeek: 'dddd [lalu,] LT',
        sameElse: 'L',
    },
});

moment.locale('id');

export const ShortToLongDayNameIndo: any = {
    Sen: 'Senin',
    Sel: 'Selasa',
    Rab: 'Rabu',
    Kam: 'Kamis',
    Jum: 'Jumat',
    Sab: 'Sabtu',
    Min: 'Minggu',
};

export const ShortDayNameEngToIndo: any = {
    mon: 'Senin',
    tue: 'Selasa',
    wed: 'Rabu',
    thu: 'Kamis',
    fri: 'Jumat',
    sat: 'Sabtu',
    sun: 'Minggu',
};

export const DayNameIndo: any = {
    monday: 'Senin',
    tuesday: 'Selasa',
    wednesday: 'Rabu',
    thursday: 'Kamis',
    friday: 'Jumat',
    saturday: 'Sabtu',
    sunday: 'Minggu',
};

export const formatGDate = (datetime: Date | string): Moment | undefined => {
    if (!datetime) return;
    if (typeof datetime === 'string' || datetime instanceof String) {
        if (datetime.length > 19) {
            const dateTime = datetime.substring(0, 19).replace('T', ' ');
            return moment(dateTime, 'YYYY-MM-DD HH:mm:ss');
        }
    }
    return moment(datetime);
};

const regexDateTime = /(\d{4}\-\d{2}\-\d{2}T\d{2}\:\d{2}\:\d{2})(\.\w{3,})/g;

export const getOnlyDateTimeFormat = (dateTime: string) => {
    return dateTime.replace(regexDateTime, "$1").replaceAll("Z", "");
};


export function formatDateTimeToMoment(datetime: string): moment.Moment {
    return moment(datetime, 'YYYY-MM-DD HH:mm:ss');
}

export function formatTimeToMoment(time: string): moment.Moment {
    return moment(time, 'HH:mm:ss');
}

export function formatFullDateMonthYear(datetime: Date | string): string {
    return datetime && moment(datetime).format('dddd, DD MMMM YYYY');
}


export function formatDateMonthYearTime(datetime: Date | string): string {
    return datetime && moment(datetime).format('ddd, DD MMM YYYY HH:mm');
}

export function formatDayMonthYear(datetime: Date | string): string | false {
    const gDate = formatGDate(datetime);
    return datetime && gDate !== undefined && gDate.format('dddd, DD MMM YYYY');
}

export function toDateWithFormat(datetime: Date | string, formatDate: string): string | false {
    const gDate = formatGDate(datetime);
    return datetime && gDate !== undefined && gDate.format(formatDate);
}

/**
 * Format the date string 'llll'
 * Thu, Aug 2 1985 08:30 PM
 */
export function formatDateIntl(datetime: Date | string): string {
    const gDate = formatGDate(datetime);
    return (datetime && gDate !== undefined && gDate.format('llll')) || '';
}

export function formatHourMinID(datetime: any) {
    return moment.utc(datetime).utcOffset(7).format('HH:mm');
}

export function formatHourMin(datetime: any) {
    return moment.utc(datetime).format('HH:mm');
}

/**
 * Format the Date object or legal date string into'DD-MM-YYYY'
 * @param {Date|string} datetime
 * @returns {string}
 */
export function formatDateReverse(datetime: Date | string): string {
    return moment(datetime).format('DD-MM-YYYY');
}

/**
 * Format the Date object or legal date string into'YYYY-MM-DD'
 * @param {Date|string} datetime
 * @returns {string}
 */
export function formatDate(datetime: Date | string): string {
    return moment(datetime).format('YYYY-MM-DD');
}

/**
 * Format the Date object or legal date string into'HH:mm:ss'
 * @param {Date|string} datetime
 * @returns {string}
 */
export function formatTime(datetime: Date | string): string {
    return moment(datetime).format('HH:mm:ss');
}

/**
 * Format the Date object or legal date string into'YYYY-MM-DD HH:mm:ss'
 * @param {Date|string} datetime
 * @returns {string}
 */
export function formatDataTime(datetime: Date | string): string {
    return moment(datetime).format('YYYY-MM-DD HH:mm:ss');
}

export function formatMomentToDateTime(datetime: moment.Moment | Date): string {
    return moment(datetime).format('YYYY-MM-DD HH:mm:ss');
}

/**
 * Format Date into UTC date string with T and Z keywords, such as:
 * "2020-08-24T14:05:00+08:00" Beijing time
 * Or
 * "2020-08-24T09:05:00Z" standard time
 * @param {Date|string} datetime
 */
export function formatUTC(datetime: Date | string): string {
    return moment(datetime).format('YYYY-MM-DDTHH:mm:ssZ');
}

/**
 * Format Date into UTC date string with T and Z keywords, such as:
 * "2020-08-24T14:05:00+08:00" Beijing time
 * Or
 * "2020-08-24T09:05:00Z" standard time
 * @param {Date|string} datetime
 */
export function formatNoTimeZoneUTC(datetime: Date | string): string {
    return moment(datetime).format('YYYY-MM-DDTHH:mm:ss') + 'Z';
}

/**
 * Returns the UTC date string of the specified year, month, and day.
 * The year and month that are not passed use the corresponding value of the current date of the system.
 * The day defaults to 1.
 */
export function formatDateOfDay(year: number = moment().year(), month: number = moment().month(), day = 1): string {
    return getMomentBySpecificValue(year, month, day).format('YYYY-MM-DD');
}

/**
 * Returns the Moment object of the specified year, month, and day.
 * The year and month that are not passed use the corresponding value of the current date of the system.
 * The day defaults to 1.
 */
export function getMomentBySpecificValue(
    year: number = moment().year(),
    month: number = moment().month(),
    day = 1,
): moment.Moment {
    return moment().year(year).month(month).date(day);
}

/**
 * Returns the date string at 12:00 AM on the specified year, month, and day.
 */
export function getStartOfDay(year: number = moment().year(), month: number = moment().month(), day = 1): string {
    return moment().year(year).month(month).date(day).startOf('date').format('YYYY-MM-DDTHH:mm:ss');
}

/**
 * The behavior is similar to getStartOfDay, but the time is reversed.
 */
export function getEndOfDay(year: number = moment().year(), month: number = moment().month(), day = 1): string {
    return moment().year(year).month(month).date(day).endOf('date').format('YYYY-MM-DDTHH:mm:ss');
}

export const getHourMinutes = (datetime: Date | string): string => {
    return moment(datetime).utc().locale('id').format('HH:mm');
};

export function formatPlainUTC(datetime: Date | string): string {
    return moment(datetime).format();
}

export const getMonthString = (datetime: Date | string): string => {
    return moment(datetime).format('MMMM');
};

export const dateHandler = (date: Date | string) => {
    let now = moment();
    let momentDate = moment(date);
    let time = momentDate.fromNow(true);
    let dateByHourAndMin = momentDate.format("HH:mm");
    const getDay = () => {
        let days = time.split(" ")[0];
        if (Number(days) < 8) {
            return DayNameIndo[now.subtract(Number(days), "day").format("dddd").toLowerCase()];
        } else {
            return momentDate.format("DD/MM/YYYY");
        }
    };
    // if (time === "a few seconds") {
    //     return "Sekarang";
    // }
    // if (time.search("minute") !== -1) {
    //     let mins = time.split(" ")[0];
    //     if (mins === "a") {
    //         return "1 min";
    //     } else {
    //         return `${mins} min`;
    //     }
    // }
    // if (time.search("hour") !== -1) {
    //     return dateByHourAndMin;
    // }
    if (time === "a day") {
        return "Kemarin";
    }
    if (time.search("days") !== -1) {
        return getDay();
    }
    return dateByHourAndMin;
};