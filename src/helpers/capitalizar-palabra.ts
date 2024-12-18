export function capitalizeWords(input: string): string {
    const exceptions = new Set(["de", "en", "la", "a", "el", "los", "las", "del", "con", "al", "y"]);
    return input
      .toLowerCase()
      .split(/([/\s])/)
      .map((word, index) => {
        if (exceptions.has(word) && index !== 0) {
          return word;
        }
        if(word.charAt(0) === word.charAt(0).toUpperCase() && index !== 0) {
          return word;
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join("");
}