/**
 * Test file for Toon converter
 */

import { ToonConverter } from './toonConverter.js';
import { TokenCounter } from './tokenCounter.js';
import chalk from 'chalk';

console.log(chalk.blue.bold('🧪 Testing Toon Converter'));
console.log(chalk.gray('═'.repeat(50)));

const converter = new ToonConverter();
const tokenCounter = new TokenCounter('gpt-4');

// Test 1: Simple object
console.log(chalk.yellow('\n📌 Test 1: Simple Object'));
const simpleObj = {
    name: "John Doe",
    age: 30,
    email: "john@example.com"
};

const simpleJson = JSON.stringify(simpleObj, null, 2);
const simpleToon = converter.jsonToToon(simpleObj);

console.log(chalk.white('JSON:'));
console.log(simpleJson);
console.log(chalk.white('\nToon:'));
console.log(simpleToon);
console.log(chalk.green(`JSON Tokens: ${tokenCounter.countTokens(simpleJson)}`));
console.log(chalk.green(`Toon Tokens: ${tokenCounter.countTokens(simpleToon)}`));

// Test 2: Array of objects
console.log(chalk.yellow('\n📌 Test 2: Array of Objects'));
const arrayObj = {
    products: [
        { id: 1, name: "Laptop", price: 999.99 },
        { id: 2, name: "Mouse", price: 29.99 },
        { id: 3, name: "Keyboard", price: 79.99 }
    ]
};

const arrayJson = JSON.stringify(arrayObj, null, 2);
const arrayToon = converter.jsonToToon(arrayObj);

console.log(chalk.white('JSON:'));
console.log(arrayJson);
console.log(chalk.white('\nToon:'));
console.log(arrayToon);
console.log(chalk.green(`JSON Tokens: ${tokenCounter.countTokens(arrayJson)}`));
console.log(chalk.green(`Toon Tokens: ${tokenCounter.countTokens(arrayToon)}`));

// Test 3: Nested structure
console.log(chalk.yellow('\n📌 Test 3: Nested Structure'));
const nestedObj = {
    user: {
        id: 1,
        profile: {
            firstName: "Jane",
            lastName: "Smith",
            settings: {
                theme: "dark",
                notifications: true
            }
        },
        posts: [
            { id: 101, title: "First Post", likes: 10 },
            { id: 102, title: "Second Post", likes: 25 }
        ]
    }
};

const nestedJson = JSON.stringify(nestedObj, null, 2);
const nestedToon = converter.jsonToToon(nestedObj);

console.log(chalk.white('JSON:'));
console.log(nestedJson);
console.log(chalk.white('\nToon:'));
console.log(nestedToon);
console.log(chalk.green(`JSON Tokens: ${tokenCounter.countTokens(nestedJson)}`));
console.log(chalk.green(`Toon Tokens: ${tokenCounter.countTokens(nestedToon)}`));

// Calculate total savings
const totalJsonTokens = tokenCounter.countTokens(simpleJson) + 
                       tokenCounter.countTokens(arrayJson) + 
                       tokenCounter.countTokens(nestedJson);
const totalToonTokens = tokenCounter.countTokens(simpleToon) + 
                       tokenCounter.countTokens(arrayToon) + 
                       tokenCounter.countTokens(nestedToon);
const savings = ((totalJsonTokens - totalToonTokens) / totalJsonTokens * 100).toFixed(2);

console.log(chalk.blue.bold('\n📊 Test Summary:'));
console.log(chalk.gray('─'.repeat(50)));
console.log(chalk.white(`Total JSON Tokens: ${chalk.yellow(totalJsonTokens)}`));
console.log(chalk.white(`Total Toon Tokens: ${chalk.green.bold(totalToonTokens)}`));
console.log(chalk.white(`Token Savings: ${chalk.green.bold(savings + '%')}`));

// Cleanup
tokenCounter.free();
