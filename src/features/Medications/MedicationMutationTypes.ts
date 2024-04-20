export interface Condition {
    id?: string;
    name: string;
}

export interface Medication {
    id?: string;
    name: string;
}

export interface Refill {
    id?: string;
    refillDate: Date;
}

export interface ScheduleBlock {
    dosageUnit?: string;
    dosageValue?: string;
    id?: string;
    timeOfDayUtc?: string;
}

export interface Dose {
    value: any;
    time: any;
}

export interface Dosage {
    value: number;
    unit: string;
    schedule: string;
}

export interface MedicationCourse {
    date: Date;
    timesPerDay?: number | string;
    doses: Dose[];
    scheduleIntervalStartTime?: number;
    scheduleIntervalEndTime?: number;
    scheduleInterval?: number;
}

export interface DateTimeFormatOptions {
    year?: 'numeric' | '2-digit' | undefined;
    month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow' | undefined;
    day?: 'numeric' | '2-digit' | undefined;
    timeZone?: string | undefined;
}
