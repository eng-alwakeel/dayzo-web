/**
 * Immutable Date Utils Logic
 */
export const DateUtils = {
    /**
     * Determines if an ISO date is in the past.
     * @param {string} dateIso 
     * @returns {boolean}
     */
    isPast(dateIso) {
        return new Date(dateIso).getTime() < Date.now();
    },

    /**
     * Finds next occurrence for annual fixed dates
     */
    getNextFixedOccurrence(month, day) {
        const now = new Date();
        const currentYear = now.getFullYear();
        let target = new Date(currentYear, month - 1, day);
        
        if (target.getTime() < now.getTime()) {
            target = new Date(currentYear + 1, month - 1, day);
        }
        return target.toISOString();
    },

    /**
     * Simple resolver placeholder for complex variable rules.
     * Use fallback dates in actual datasets for safety!
     */
    resolveVariableRule(rule, fallbackDates, year) {
        if (!fallbackDates) return null;
        
        let targetIso = fallbackDates[year];
        const now = Date.now();
        
        // If the date for requested year is past, find the next valid one in fallback data
        if (targetIso && new Date(targetIso).getTime() < now) {
            const nextYear = (parseInt(year) + 1).toString();
            if (fallbackDates[nextYear]) {
                targetIso = fallbackDates[nextYear];
            }
        }
        
        return targetIso || null;
    },

    /**
     * Finds next occurrence of a specific day of week (0-6)
     */
    getNextDayOfWeek(targetDayOfWeek) {
        const now = new Date();
        let currentDay = now.getDay();
        let daysUntil = (targetDayOfWeek - currentDay + 7) % 7;
        
        // If today, move to next week
        if (daysUntil === 0) {
            daysUntil = 7;
        }
        
        const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntil);
        return targetDate.toISOString();
    },

    /**
     * Resolves the start of a specific year
     */
    getYearStart(yearOffset) {
        return new Date(yearOffset, 0, 1).toISOString();
    }
};
