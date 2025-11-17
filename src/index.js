/**
 * Interactive Toon vs JSON Converter
 */

import readline from 'readline';
import chalk from 'chalk';
import { ToonConverter } from './toonConverter.js';
import { TokenCounter } from './tokenCounter.js';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const converter = new ToonConverter();
const tokenCounter = new TokenCounter('gpt-4');

function displayWelcome() {
    console.clear();
    console.log(chalk.blue.bold('╔══════════════════════════════════════════════╗'));
    console.log(chalk.blue.bold('║     JSON to Toon Format Converter Tool      ║'));
    console.log(chalk.blue.bold('╚══════════════════════════════════════════════╝'));
    console.log(chalk.gray('\nToon format reduces token usage by 30-60% for LLMs'));
    console.log(chalk.gray('by eliminating redundant syntax while maintaining data fidelity.\n'));
}

function displayMenu() {
    console.log(chalk.cyan('Choose an option:'));
    console.log(chalk.white('1. Convert JSON to Toon format'));
    console.log(chalk.white('2. Compare token usage'));
    console.log(chalk.white('3. View example conversions'));
    console.log(chalk.white('4. Exit'));
    console.log();
}

function promptUser(question) {
    return new Promise((resolve) => {
        rl.question(chalk.yellow(question), (answer) => {
            resolve(answer);
        });
    });
}

async function convertJsonToToon() {
    console.log(chalk.blue.bold('\n📝 JSON to Toon Converter'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.gray('Enter your JSON (press Enter twice when done):'));
    
    let jsonInput = '';
    let emptyLineCount = 0;
    
    const getInput = () => {
        return new Promise((resolve) => {
            const inputHandler = (line) => {
                if (line === '') {
                    emptyLineCount++;
                    if (emptyLineCount >= 1) {
                        rl.removeListener('line', inputHandler);
                        resolve();
                    }
                } else {
                    emptyLineCount = 0;
                    jsonInput += line + '\n';
                }
            };
            rl.on('line', inputHandler);
        });
    };
    
    await getInput();
    
    try {
        const data = JSON.parse(jsonInput);
        const toonStr = converter.jsonToToon(data);
        
        console.log(chalk.green.bold('\n✅ Toon Format Output:'));
        console.log(chalk.gray('─'.repeat(50)));
        console.log(toonStr);
        
        // Show token comparison
        const jsonTokens = tokenCounter.countTokens(jsonInput);
        const toonTokens = tokenCounter.countTokens(toonStr);
        const savings = ((jsonTokens - toonTokens) / jsonTokens * 100).toFixed(2);
        
        console.log(chalk.blue.bold('\n📊 Token Analysis:'));
        console.log(chalk.gray('─'.repeat(50)));
        console.log(chalk.white(`JSON Tokens: ${chalk.yellow(jsonTokens)}`));
        console.log(chalk.white(`Toon Tokens: ${chalk.green.bold(toonTokens)}`));
        console.log(chalk.white(`Token Savings: ${chalk.green.bold(savings + '%')}`));
        
    } catch (error) {
        console.log(chalk.red('❌ Invalid JSON format. Please try again.'));
        console.log(chalk.red(error.message));
    }
    
    await promptUser('\nPress Enter to continue...');
}

async function compareTokenUsage() {
    console.log(chalk.blue.bold('\n📊 Token Usage Comparison'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.gray('Enter your JSON for comparison (press Enter twice when done):'));
    
    let jsonInput = '';
    let emptyLineCount = 0;
    
    const getInput = () => {
        return new Promise((resolve) => {
            const inputHandler = (line) => {
                if (line === '') {
                    emptyLineCount++;
                    if (emptyLineCount >= 1) {
                        rl.removeListener('line', inputHandler);
                        resolve();
                    }
                } else {
                    emptyLineCount = 0;
                    jsonInput += line + '\n';
                }
            };
            rl.on('line', inputHandler);
        });
    };
    
    await getInput();
    
    try {
        const data = JSON.parse(jsonInput);
        const jsonCompact = JSON.stringify(data);
        const jsonPretty = JSON.stringify(data, null, 2);
        const toonStr = converter.jsonToToon(data);
        
        console.log(chalk.blue.bold('\n📈 Detailed Token Analysis:'));
        console.log(chalk.gray('─'.repeat(50)));
        
        // Analyze each format
        const formats = [
            { name: 'JSON (Compact)', text: jsonCompact },
            { name: 'JSON (Pretty)', text: jsonPretty },
            { name: 'Toon Format', text: toonStr }
        ];
        
        formats.forEach(format => {
            const analysis = tokenCounter.analyzeTokens(format.text);
            console.log(chalk.cyan(`\n${format.name}:`));
            console.log(chalk.white(`  • Tokens: ${chalk.yellow(analysis.count)}`));
            console.log(chalk.white(`  • Characters: ${analysis.textLength}`));
            console.log(chalk.white(`  • Avg Token Length: ${analysis.averageTokenLength.toFixed(2)}`));
        });
        
        // Cost estimation
        const compactTokens = tokenCounter.countTokens(jsonCompact);
        const toonTokens = tokenCounter.countTokens(toonStr);
        const jsonCost = tokenCounter.estimateCost(compactTokens * 1000);
        const toonCost = tokenCounter.estimateCost(toonTokens * 1000);
        
        console.log(chalk.magenta.bold('\n💰 Cost Estimation (per 1000 requests):'));
        console.log(chalk.gray('─'.repeat(50)));
        console.log(chalk.white(`JSON Input Cost: ${chalk.yellow(jsonCost.inputCost)}`));
        console.log(chalk.white(`Toon Input Cost: ${chalk.green.bold(toonCost.inputCost)}`));
        
        const costSavings = ((compactTokens - toonTokens) / compactTokens * 100).toFixed(2);
        console.log(chalk.white(`Cost Savings: ${chalk.green.bold(costSavings + '%')}`));
        
    } catch (error) {
        console.log(chalk.red('❌ Invalid JSON format. Please try again.'));
        console.log(chalk.red(error.message));
    }
    
    await promptUser('\nPress Enter to continue...');
}

function showExamples() {
    console.log(chalk.blue.bold('\n📚 Example Conversions'));
    console.log(chalk.gray('═'.repeat(50)));
    
    const examples = [
        {
            name: 'Simple User List',
            json: {
                users: [
                    { id: 1, name: "Alice", role: "admin" },
                    { id: 2, name: "Bob", role: "user" }
                ]
            }
        },
        {
            name: 'Nested Configuration',
            json: {
                app: {
                    name: "MyApp",
                    version: "1.0.0",
                    settings: {
                        theme: "dark",
                        language: "en"
                    }
                }
            }
        },
        {
            name: 'Mixed Data Types',
            json: {
                string: "Hello World",
                number: 42,
                boolean: true,
                null: null,
                array: [1, 2, 3],
                object: { key: "value" }
            }
        }
    ];
    
    examples.forEach(example => {
        console.log(chalk.yellow(`\n📌 ${example.name}:`));
        console.log(chalk.gray('─'.repeat(40)));
        
        const jsonStr = JSON.stringify(example.json, null, 2);
        const toonStr = converter.jsonToToon(example.json);
        
        console.log(chalk.cyan('JSON:'));
        console.log(chalk.gray(jsonStr));
        
        console.log(chalk.green('\nToon:'));
        console.log(chalk.gray(toonStr));
        
        const jsonTokens = tokenCounter.countTokens(jsonStr);
        const toonTokens = tokenCounter.countTokens(toonStr);
        const savings = ((jsonTokens - toonTokens) / jsonTokens * 100).toFixed(2);
        
        console.log(chalk.white(`\nTokens: JSON=${chalk.yellow(jsonTokens)}, Toon=${chalk.green(toonTokens)}, Savings=${chalk.green.bold(savings + '%')}`));
    });
}

async function main() {
    displayWelcome();
    
    let running = true;
    while (running) {
        displayMenu();
        const choice = await promptUser('Enter your choice (1-4): ');
        
        switch (choice) {
            case '1':
                await convertJsonToToon();
                break;
            case '2':
                await compareTokenUsage();
                break;
            case '3':
                showExamples();
                await promptUser('\nPress Enter to continue...');
                break;
            case '4':
                running = false;
                break;
            default:
                console.log(chalk.red('Invalid choice. Please try again.'));
        }
        
        if (running) {
            console.clear();
            displayWelcome();
        }
    }
    
    console.log(chalk.green.bold('\n👋 Thank you for using Toon Converter!'));
    tokenCounter.free();
    rl.close();
}

main().catch(console.error);
