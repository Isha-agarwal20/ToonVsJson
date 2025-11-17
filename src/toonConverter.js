/**
 * Toon Format Converter
 * Converts JSON to Toon format for reduced token usage
 * 
 * Toon Format Rules:
 * 1. Arrays are denoted as: arrayName[count]{keys}: values
 * 2. No quotes around keys or string values (unless needed)
 * 3. No brackets, braces for individual items
 * 4. Comma-separated values
 * 5. Nested objects use indentation
 */

export class ToonConverter {
    constructor() {
        this.indentSize = 2;
    }

    /**
     * Convert JSON to Toon format
     * @param {any} data - JSON data to convert
     * @param {string} rootKey - Root key name (optional)
     * @returns {string} Toon formatted string
     */
    jsonToToon(data, rootKey = '') {
        if (Array.isArray(data)) {
            return this.arrayToToon(data, rootKey);
        } else if (typeof data === 'object' && data !== null) {
            return this.objectToToon(data, rootKey);
        } else {
            return this.valueToToon(data);
        }
    }

    /**
     * Convert array to Toon format
     */
    arrayToToon(arr, arrayName = 'array', indent = 0) {
        if (arr.length === 0) {
            return `${arrayName}[0]`;
        }

        // Check if all items are objects with same structure
        if (arr.every(item => typeof item === 'object' && item !== null && !Array.isArray(item))) {
            const keys = this.getCommonKeys(arr);
            if (keys.length > 0) {
                // Format: arrayName[count]{keys}:
                const header = `${arrayName}[${arr.length}]{${keys.join(',')}}:`;
                const rows = arr.map(item => {
                    const values = keys.map(key => this.valueToToon(item[key]));
                    return ' '.repeat(indent + this.indentSize) + values.join(',');
                });
                return header + '\n' + rows.join('\n');
            }
        }

        // For non-uniform arrays or primitive arrays
        const header = `${arrayName}[${arr.length}]:`;
        const items = arr.map(item => {
            const itemStr = this.jsonToToon(item, '');
            return ' '.repeat(indent + this.indentSize) + itemStr;
        });
        return header + '\n' + items.join('\n');
    }

    /**
     * Convert object to Toon format
     */
    objectToToon(obj, objName = '', indent = 0) {
        const lines = [];
        
        if (objName) {
            lines.push(objName + ':');
            indent += this.indentSize;
        }

        for (const [key, value] of Object.entries(obj)) {
            const indentStr = ' '.repeat(indent);
            
            if (Array.isArray(value)) {
                lines.push(indentStr + this.arrayToToon(value, key, indent));
            } else if (typeof value === 'object' && value !== null) {
                lines.push(indentStr + this.objectToToon(value, key, indent));
            } else {
                lines.push(indentStr + `${key}:${this.valueToToon(value)}`);
            }
        }

        return lines.join('\n');
    }

    /**
     * Convert primitive value to Toon format
     */
    valueToToon(value) {
        if (value === null) return 'null';
        if (value === undefined) return 'undefined';
        if (typeof value === 'string') {
            // Only add quotes if string contains special characters
            if (value.includes(',') || value.includes(':') || value.includes('\n') || value.includes('{') || value.includes('}')) {
                return `"${value}"`;
            }
            return value;
        }
        return String(value);
    }

    /**
     * Get common keys from array of objects
     */
    getCommonKeys(arr) {
        if (arr.length === 0) return [];
        
        const firstKeys = Object.keys(arr[0]);
        return firstKeys.filter(key => 
            arr.every(item => key in item)
        );
    }

    /**
     * Parse Toon format back to JSON (basic implementation)
     */
    toonToJson(toonStr) {
        const lines = toonStr.split('\n').filter(line => line.trim());
        return this.parseLines(lines, 0)[0];
    }

    parseLines(lines, startIdx) {
        const line = lines[startIdx].trim();
        
        // Array format: name[count]{keys}:
        const arrayMatch = line.match(/^(\w+)\[(\d+)\](?:\{([^}]+)\})?:/);
        if (arrayMatch) {
            const [, name, count, keysStr] = arrayMatch;
            const keys = keysStr ? keysStr.split(',') : [];
            const items = [];
            
            for (let i = startIdx + 1; i <= startIdx + parseInt(count); i++) {
                if (keys.length > 0) {
                    const values = lines[i].trim().split(',');
                    const item = {};
                    keys.forEach((key, idx) => {
                        item[key.trim()] = this.parseValue(values[idx]);
                    });
                    items.push(item);
                } else {
                    items.push(this.parseValue(lines[i].trim()));
                }
            }
            
            return [items, startIdx + parseInt(count) + 1];
        }
        
        // Simple key:value
        const kvMatch = line.match(/^(\w+):(.*)$/);
        if (kvMatch) {
            const [, key, value] = kvMatch;
            return [this.parseValue(value), startIdx + 1];
        }
        
        return [this.parseValue(line), startIdx + 1];
    }

    parseValue(str) {
        str = str.trim();
        if (str === 'null') return null;
        if (str === 'undefined') return undefined;
        if (str === 'true') return true;
        if (str === 'false') return false;
        if (str.startsWith('"') && str.endsWith('"')) {
            return str.slice(1, -1);
        }
        if (!isNaN(str) && str !== '') {
            return Number(str);
        }
        return str;
    }
}

export default ToonConverter;
