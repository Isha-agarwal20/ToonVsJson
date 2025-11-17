#!/usr/bin/env node

/**
 * Quick Demo of JSON vs Toon Format Comparison
 */

import chalk from 'chalk';
import { ToonConverter } from './src/toonConverter.js';
import { TokenCounter } from './src/tokenCounter.js';

console.log(chalk.blue.bold('\n🚀 JSON vs Toon Format - Quick Demo'));
console.log(chalk.gray('═'.repeat(50)));

const converter = new ToonConverter();
const tokenCounter = new TokenCounter('gpt-4');

// Sample data: A typical API response
const sampleData = {
    status: "success",
    timestamp: "2024-01-15T10:30:00Z",
    data: {
        users: [
            { id: 1, name: "Alice Johnson", email: "alice@tech.com", role: "admin", active: true, lastLogin: "2024-01-15" },
            { id: 2, name: "Bob Smith", email: "bob@tech.com", role: "developer", active: true, lastLogin: "2024-01-14" },
            { id: 3, name: "Charlie Davis", email: "charlie@tech.com", role: "developer", active: false, lastLogin: "2024-01-10" },
            { id: 4, name: "Diana Wilson", email: "diana@tech.com", role: "manager", active: true, lastLogin: "2024-01-15" },
            { id: 5, name: "Eve Brown", email: "eve@tech.com", role: "developer", active: true, lastLogin: "2024-01-13" }
        ],
        summary: {
            totalUsers: 5,
            activeUsers: 4,
            roles: {
                admin: 1,
                developer: 3,
                manager: 1
            }
        }
    }
};

// Convert to different formats
const jsonPretty = JSON.stringify(sampleData, null, 2);
const jsonCompact = JSON.stringify(sampleData);
const toonFormat = converter.jsonToToon(sampleData);

// Display the formats
console.log(chalk.yellow.bold('\n📄 Original JSON (Pretty):'));
console.log(chalk.gray('─'.repeat(50)));
console.log(jsonPretty);

console.log(chalk.green.bold('\n📄 Toon Format:'));
console.log(chalk.gray('─'.repeat(50)));
console.log(toonFormat);

// Count tokens
const jsonPrettyTokens = tokenCounter.countTokens(jsonPretty);
const jsonCompactTokens = tokenCounter.countTokens(jsonCompact);
const toonTokens = tokenCounter.countTokens(toonFormat);

// Calculate savings
const savingsPretty = ((jsonPrettyTokens - toonTokens) / jsonPrettyTokens * 100).toFixed(1);
const savingsCompact = ((jsonCompactTokens - toonTokens) / jsonCompactTokens * 100).toFixed(1);

// Display results
console.log(chalk.blue.bold('\n📊 Token Usage Comparison:'));
console.log(chalk.gray('─'.repeat(50)));

console.log(chalk.white(`
${chalk.cyan('Format')}              ${chalk.cyan('Tokens')}    ${chalk.cyan('Characters')}
─────────────────────────────────────────
JSON (Pretty)        ${chalk.yellow(String(jsonPrettyTokens).padEnd(8))} ${jsonPretty.length}
JSON (Compact)       ${chalk.yellow(String(jsonCompactTokens).padEnd(8))} ${jsonCompact.length}
${chalk.green('Toon Format')}         ${chalk.green.bold(String(toonTokens).padEnd(8))} ${toonFormat.length}
`));

console.log(chalk.magenta.bold('💡 Token Savings:'));
console.log(chalk.gray('─'.repeat(50)));
console.log(chalk.white(`• vs Pretty JSON:  ${chalk.green.bold(savingsPretty + '%')} reduction`));
console.log(chalk.white(`• vs Compact JSON: ${chalk.green.bold(savingsCompact + '%')} reduction`));

// Cost calculation for 1 million API calls
const costPerThousandTokens = 0.03; // GPT-4 approximate cost
const jsonCostPerMillion = (jsonCompactTokens * 1000000 * costPerThousandTokens / 1000);
const toonCostPerMillion = (toonTokens * 1000000 * costPerThousandTokens / 1000);
const costSavings = jsonCostPerMillion - toonCostPerMillion;

console.log(chalk.magenta.bold('\n💰 Cost Impact (1M API calls):'));
console.log(chalk.gray('─'.repeat(50)));
console.log(chalk.white(`• JSON Cost:  $${jsonCostPerMillion.toFixed(2)}`));
console.log(chalk.white(`• Toon Cost:  ${chalk.green.bold('$' + toonCostPerMillion.toFixed(2))}`));
console.log(chalk.white(`• You Save:   ${chalk.green.bold('$' + costSavings.toFixed(2))}`));

console.log(chalk.blue.bold('\n✨ Summary:'));
console.log(chalk.gray('─'.repeat(50)));
console.log(chalk.white(`Toon format reduces token usage by ${chalk.green.bold(savingsCompact + '%')}, 
which means faster processing, lower costs, and more 
data fitting within LLM context windows!`));

console.log(chalk.gray('\n─'.repeat(50)));
console.log(chalk.cyan('Run "npm start" for interactive mode'));
console.log(chalk.cyan('Run "npm run compare" for full analysis\n'));

// Cleanup
tokenCounter.free();
