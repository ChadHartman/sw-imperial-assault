namespace swia.util {
    export function popRandom(array: any[]): any {
        let index = Math.floor(Math.random() * array.length);
        return array.splice(index, 1)[0];
    }
}