export function probability(probability: number): boolean {
    return Math.random() <= probability;
}

export function getRandomElement<T>(array: T[]): T | undefined {
    if (array.length === 0) {
        return undefined;
    }
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}
