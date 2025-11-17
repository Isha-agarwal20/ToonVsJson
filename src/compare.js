/**
 * Main comparison script for JSON vs Toon format
 */

import chalk from 'chalk';
import Table from 'cli-table3';
import { ToonConverter } from './toonConverter.js';
import { TokenCounter } from './tokenCounter.js';
import samples from '../data/samples.js';

class FormatComparison {
    constructor(model = 'gpt-4') {
        this.converter = new ToonConverter();
        this.tokenCounter = new TokenCounter(model);
        this.results = [];
    }

    /**
     * Run comparison for a single data sample
     */
    compareFormat(data, name) {
        console.log(chalk.blue.bold(`\n📊 Analyzing: ${name}`));
        console.log(chalk.gray('─'.repeat(50)));

        // Convert to JSON string
        const jsonStr = JSON.stringify(data, null, 2);
        const jsonCompact = JSON.stringify(data);
        
        // Convert to Toon format
        const toonStr = this.converter.jsonToToon(data);
        
        // Count tokens
        const jsonTokens = this.tokenCounter.countTokens(jsonStr);
        const jsonCompactTokens = this.tokenCounter.countTokens(jsonCompact);
        const toonTokens = this.tokenCounter.countTokens(toonStr);
        
        // Calculate savings
        const savingsVsPretty = ((jsonTokens - toonTokens) / jsonTokens * 100).toFixed(2);
        const savingsVsCompact = ((jsonCompactTokens - toonTokens) / jsonCompactTokens * 100).toFixed(2);
        
        // Store results
        const result = {
            name,
            jsonPretty: {
                tokens: jsonTokens,
                chars: jsonStr.length
            },
            jsonCompact: {
                tokens: jsonCompactTokens,
                chars: jsonCompact.length
            },
            toon: {
                tokens: toonTokens,
                chars: toonStr.length
            },
            savings: {
                vsPretty: savingsVsPretty,
                vsCompact: savingsVsCompact
            }
        };
        
        this.results.push(result);
        
        // Display comparison
        this.displayComparison(result);
        
        // Show sample outputs
        this.showSamples(jsonStr, toonStr);
        
        return result;
    }

    /**
     * Display comparison results in a table
     */
    displayComparison(result) {
        const table = new Table({
            head: [
                chalk.cyan('Format'),
                chalk.cyan('Tokens'),
                chalk.cyan('Characters'),
                chalk.cyan('Token Savings')
            ],
            style: {
                head: [],
                border: []
            }
        });

        table.push(
            [
                'JSON (Pretty)',
                chalk.yellow(result.jsonPretty.tokens),
                result.jsonPretty.chars,
                '-'
            ],
            [
                'JSON (Compact)',
                chalk.yellow(result.jsonCompact.tokens),
                result.jsonCompact.chars,
                '-'
            ],
            [
                chalk.green('Toon'),
                chalk.green.bold(result.toon.tokens),
                result.toon.chars,
                chalk.green.bold(`${result.savings.vsPretty}% vs Pretty\n${result.savings.vsCompact}% vs Compact`)
            ]
        );

        console.log(table.toString());
    }

    /**
     * Show sample outputs
     */
    showSamples(jsonStr, toonStr, maxLines = 10) {
        console.log(chalk.blue('\n📝 Sample Output Comparison:'));
        console.log(chalk.gray('─'.repeat(50)));
        
        // Show JSON sample
        const jsonLines = jsonStr.split('\n').slice(0, maxLines);
        console.log(chalk.yellow('\nJSON Format:'));
        console.log(chalk.gray(jsonLines.join('\n')));
        if (jsonStr.split('\n').length > maxLines) {
            console.log(chalk.gray('... (truncated)'));
        }
        
        // Show Toon sample
        const toonLines = toonStr.split('\n').slice(0, maxLines);
        console.log(chalk.green('\nToon Format:'));
        console.log(chalk.gray(toonLines.join('\n')));
        if (toonStr.split('\n').length > maxLines) {
            console.log(chalk.gray('... (truncated)'));
        }
    }

    /**
     * Display cost analysis
     */
    displayCostAnalysis() {
        console.log(chalk.magenta.bold('\n💰 Cost Analysis (per 1000 API calls):'));
        console.log(chalk.gray('─'.repeat(50)));
        
        const table = new Table({
            head: [
                chalk.cyan('Dataset'),
                chalk.cyan('JSON Cost'),
                chalk.cyan('Toon Cost'),
                chalk.cyan('Savings')
            ],
            style: {
                head: [],
                border: []
            }
        });

        this.results.forEach(result => {
            const jsonCost = this.tokenCounter.estimateCost(result.jsonCompact.tokens * 1000);
            const toonCost = this.tokenCounter.estimateCost(result.toon.tokens * 1000);
            
            table.push([
                result.name,
                jsonCost.inputCost,
                toonCost.inputCost,
                chalk.green.bold(`${result.savings.vsCompact}%`)
            ]);
        });

        console.log(table.toString());
    }

    /**
     * Display summary statistics
     */
    displaySummary() {
        console.log(chalk.magenta.bold('\n📈 Summary Statistics:'));
        console.log(chalk.gray('─'.repeat(50)));
        
        const avgSavingsPretty = (
            this.results.reduce((sum, r) => sum + parseFloat(r.savings.vsPretty), 0) / 
            this.results.length
        ).toFixed(2);
        
        const avgSavingsCompact = (
            this.results.reduce((sum, r) => sum + parseFloat(r.savings.vsCompact), 0) / 
            this.results.length
        ).toFixed(2);
        
        const totalJsonTokens = this.results.reduce((sum, r) => sum + r.jsonCompact.tokens, 0);
        const totalToonTokens = this.results.reduce((sum, r) => sum + r.toon.tokens, 0);
        const totalSaved = totalJsonTokens - totalToonTokens;
        
        console.log(chalk.white(`• Average Token Savings (vs Pretty JSON): ${chalk.green.bold(avgSavingsPretty + '%')}`));
        console.log(chalk.white(`• Average Token Savings (vs Compact JSON): ${chalk.green.bold(avgSavingsCompact + '%')}`));
        console.log(chalk.white(`• Total Tokens Saved: ${chalk.green.bold(totalSaved)} tokens`));
        console.log(chalk.white(`• Total JSON Tokens: ${chalk.yellow(totalJsonTokens)}`));
        console.log(chalk.white(`• Total Toon Tokens: ${chalk.green.bold(totalToonTokens)}`));
    }

    /**
     * Run all comparisons
     */
    runAllComparisons() {
        console.log(chalk.blue.bold('🚀 JSON vs Toon Format Comparison Tool'));
        console.log(chalk.gray('═'.repeat(50)));
        console.log(chalk.white(`Model: ${chalk.cyan(this.tokenCounter.model)}`));
        
        // Run comparisons for each sample
        Object.entries(samples).forEach(([key, data]) => {
            const name = key.replace(/([A-Z])/g, ' $1').trim();
            this.compareFormat(data, name);
        });
        
        // Display summary and cost analysis
        this.displaySummary();
        this.displayCostAnalysis();
        
        // Cleanup
        this.tokenCounter.free();
    }
}

// Run the comparison
const comparison = new FormatComparison('gpt-4');
comparison.runAllComparisons();
