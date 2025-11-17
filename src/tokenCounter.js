/**
 * Token Counter using tiktoken library
 * Counts tokens for different LLM models
 */

import { encoding_for_model } from 'tiktoken';

export class TokenCounter {
    constructor(model = 'gpt-4') {
        this.model = model;
        this.encoding = encoding_for_model(model);
    }

    /**
     * Count tokens in a string
     * @param {string} text - Text to count tokens for
     * @returns {number} Number of tokens
     */
    countTokens(text) {
        const tokens = this.encoding.encode(text);
        return tokens.length;
    }

    /**
     * Get detailed token analysis
     * @param {string} text - Text to analyze
     * @returns {object} Token analysis details
     */
    analyzeTokens(text) {
        const tokens = this.encoding.encode(text);
        const tokenStrings = tokens.map(token => 
            this.encoding.decode(new Uint32Array([token]))
        );

        return {
            count: tokens.length,
            tokens: tokenStrings,
            averageTokenLength: text.length / tokens.length,
            textLength: text.length
        };
    }

    /**
     * Compare token usage between two texts
     * @param {string} text1 - First text
     * @param {string} text2 - Second text
     * @returns {object} Comparison results
     */
    compareTokens(text1, text2, label1 = 'Text 1', label2 = 'Text 2') {
        const tokens1 = this.countTokens(text1);
        const tokens2 = this.countTokens(text2);
        const savings = tokens1 - tokens2;
        const savingsPercent = ((savings / tokens1) * 100).toFixed(2);

        return {
            [label1]: {
                tokens: tokens1,
                characters: text1.length
            },
            [label2]: {
                tokens: tokens2,
                characters: text2.length
            },
            savings: {
                tokens: savings,
                percentage: savingsPercent + '%',
                characterSavings: text1.length - text2.length
            }
        };
    }

    /**
     * Estimate cost based on token usage
     * @param {number} tokens - Number of tokens
     * @param {string} model - Model name
     * @returns {object} Cost estimation
     */
    estimateCost(tokens, model = this.model) {
        // Approximate costs per 1K tokens (as of 2024)
        const costs = {
            'gpt-4': { input: 0.03, output: 0.06 },
            'gpt-4-turbo': { input: 0.01, output: 0.03 },
            'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
            'claude-3-opus': { input: 0.015, output: 0.075 },
            'claude-3-sonnet': { input: 0.003, output: 0.015 }
        };

        const modelCost = costs[model] || costs['gpt-4'];
        const inputCost = (tokens / 1000) * modelCost.input;
        const outputCost = (tokens / 1000) * modelCost.output;

        return {
            model,
            tokens,
            inputCost: `$${inputCost.toFixed(6)}`,
            outputCost: `$${outputCost.toFixed(6)}`,
            totalCost: `$${(inputCost + outputCost).toFixed(6)}`
        };
    }

    /**
     * Free the encoding resources
     */
    free() {
        this.encoding.free();
    }
}

export default TokenCounter;
