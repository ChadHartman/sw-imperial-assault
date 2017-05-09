namespace swia.cli.util {
    
    export function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    export function isInteger(x) {
        return x % 1 === 0;
    }
}