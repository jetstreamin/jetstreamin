#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class JetstreamUIManager {
    constructor() {
        this.baseDir = path.dirname(__dirname);
        this.iterations = {
            'v2.0': 'index-v2.html',
            'v3.0': 'index-v3.html', 
            'v4.0': 'index-v4.html',
            'v5.0': 'index-v5.html'
        };
        console.log('🎨 Jetstreamin UI Manager - All Iterations');
        console.log('=' .repeat(60));
    }

    listAvailableIterations() {
        console.log('📋 Available UI Iterations:');
        console.log('-' .repeat(40));
        
        for (const [version, filename] of Object.entries(this.iterations)) {
            const filePath = path.join(this.baseDir, filename);
            const exists = fs.existsSync(filePath);
            const status = exists ? '✅ Available' : '❌ Missing';
            
            if (exists) {
                const stats = fs.statSync(filePath);
                const size = Math.round(stats.size / 1024 * 100) / 100;
                const features = this.getIterationFeatures(version);
                
                console.log(`   ${version}: ${status} (${size} KB)`);
                console.log(`      Features: ${features}`);
            } else {
                console.log(`   ${version}: ${status}`);
            }
        }
    }

    getIterationFeatures(version) {
        const features = {
            'v2.0': 'ATM & NETA agents, Real-time dashboard, Enhanced UI',
            'v3.0': 'Quantum enhancement, AR/VR, Blockchain, ATLAS & WANITA',
            'v4.0': 'Consciousness simulation, Planetary scale, Space infrastructure',
            'v5.0': 'Transcendent civilization, Universal consciousness, Timeline optimization'
        };
        return features[version] || 'Unknown features';
    }

    deployIteration(version) {
        if (!this.iterations[version]) {
            console.log(`❌ Invalid version: ${version}`);
            this.listAvailableIterations();
            return false;
        }

        const sourceFile = path.join(this.baseDir, this.iterations[version]);
        const targetFile = path.join(this.baseDir, 'index.html');

        if (!fs.existsSync(sourceFile)) {
            console.log(`❌ Source file not found: ${this.iterations[version]}`);
            return false;
        }

        try {
            // Backup current index.html
            if (fs.existsSync(targetFile)) {
                const backupFile = path.join(this.baseDir, `index.html.backup.${Date.now()}`);
                fs.copyFileSync(targetFile, backupFile);
                console.log(`📦 Backed up current index.html to ${path.basename(backupFile)}`);
            }

            // Deploy new iteration
            fs.copyFileSync(sourceFile, targetFile);
            console.log(`✅ Deployed Iteration ${version} as index.html`);

            // Validate deployment
            this.validateDeployment(version, targetFile);
            return true;

        } catch (error) {
            console.error(`❌ Deployment failed: ${error.message}`);
            return false;
        }
    }

    validateDeployment(version, targetFile) {
        try {
            const content = fs.readFileSync(targetFile, 'utf8');
            const validationResults = this.getValidationCriteria(version);
            
            console.log(`\n🔍 Validating ${version} Deployment:`);
            console.log('-' .repeat(40));

            let passed = 0;
            let total = 0;

            for (const [feature, searchPattern] of Object.entries(validationResults)) {
                total++;
                const found = content.includes(searchPattern);
                if (found) {
                    passed++;
                    console.log(`   ✅ ${feature}`);
                } else {
                    console.log(`   ❌ ${feature}`);
                }
            }

            const percentage = Math.round(passed / total * 100);
            console.log('-' .repeat(40));
            console.log(`📊 Validation: ${passed}/${total} features (${percentage}%)`);

            if (percentage >= 90) {
                console.log('🎉 EXCELLENT! Deployment fully validated');
            } else if (percentage >= 75) {
                console.log('✅ GOOD! Most features validated');
            } else {
                console.log('⚠️  Some features missing from deployment');
            }

        } catch (error) {
            console.error(`❌ Validation failed: ${error.message}`);
        }
    }

    getValidationCriteria(version) {
        const criteria = {
            'v2.0': {
                'ATM Agent Card': 'id="atm-card"',
                'NETA Agent Card': 'id="neta-card"',
                'Status Cards': 'class="status-card"',
                'Agent Cards': 'class="agent-card"',
                'Health Check Function': 'function runHealthCheck',
                'Metrics Dashboard': 'id="metrics-dashboard"'
            },
            'v3.0': {
                'Quantum Particles': 'quantum-particles',
                'ATM v3.0': 'ATM v3.0',
                'NETA v3.0': 'NETA v3.0', 
                'ATLAS System': 'ATLAS',
                'WANITA v2.0': 'WANITA v2.0',
                'AR Integration': 'ar-integration',
                'Blockchain Status': 'blockchain-status',
                'Quantum Control': 'quantum-control'
            },
            'v4.0': {
                'Consciousness Waves': 'consciousness-waves',
                'QCE System': 'Quantum Consciousness Engine',
                'Planetary Coordination': 'Planetary Coordination',
                'Space Infrastructure': 'Space Infrastructure',
                'Biointegration': 'Biointegration Systems',
                'Hive Mind': 'Hive Mind Integration',
                'Post-Scarcity Economics': 'Post-Scarcity Economics'
            },
            'v5.0': {
                'Reality Layers': 'reality-layers',
                'Universal Consciousness': 'Universal Consciousness',
                'Interstellar Network': 'Interstellar Network',
                'Timeline Optimization': 'Timeline Optimization',
                'Eternal Stewardship': 'Eternal Stewardship',
                'Multidimensional Reality': 'Multidimensional Reality',
                'Universal Resources': 'Universal Resources',
                'Galactic Network': 'galactic-network'
            }
        };
        return criteria[version] || {};
    }

    generateComparisonReport() {
        console.log('\n📊 UI Iteration Comparison Report:');
        console.log('=' .repeat(60));

        const comparisonData = {
            'v2.0': {
                theme: 'AI Agent Platform',
                primaryColor: 'Quantum Green (#00ff88)',
                agents: ['ATM', 'NETA'],
                keyFeatures: ['Real-time metrics', 'Interactive dashboard', 'Agent status cards'],
                complexity: 'Medium',
                fileSize: '~15KB'
            },
            'v3.0': {
                theme: 'Quantum Enhanced Ecosystem',
                primaryColor: 'Quantum Cyan (#00ffcc)',
                agents: ['ATM v3.0', 'NETA v3.0', 'ATLAS', 'WANITA v2.0'],
                keyFeatures: ['Quantum particles', 'AR/VR integration', 'Blockchain status', 'Neural networks'],
                complexity: 'High',
                fileSize: '~25KB'
            },
            'v4.0': {
                theme: 'Consciousness Simulation',
                primaryColor: 'Consciousness Cyan (#00ffcc)',
                agents: ['QCE', 'Planetary System', 'Space Infrastructure', 'Biointegration'],
                keyFeatures: ['Consciousness waves', 'Planetary operations', 'Space control', 'Hive mind'],
                complexity: 'Very High',
                fileSize: '~35KB'
            },
            'v5.0': {
                theme: 'Transcendent Civilization',
                primaryColor: 'Transcendent Cyan (#00fff0)',
                agents: ['Universal Consciousness', 'Interstellar Network', 'Timeline Control', 'Eternal Stewardship'],
                keyFeatures: ['Multidimensional reality', 'Galactic operations', 'Timeline optimization', 'Universal resources'],
                complexity: 'Transcendent',
                fileSize: '~45KB'
            }
        };

        for (const [version, data] of Object.entries(comparisonData)) {
            console.log(`\n${version.toUpperCase()} - ${data.theme}:`);
            console.log(`   Theme Color: ${data.primaryColor}`);
            console.log(`   Agents: ${data.agents.join(', ')}`);
            console.log(`   Key Features: ${data.keyFeatures.join(', ')}`);
            console.log(`   Complexity: ${data.complexity}`);
            console.log(`   Estimated Size: ${data.fileSize}`);
        }
    }

    interactiveMenu() {
        console.log('\n🎮 Interactive UI Manager:');
        console.log('=' .repeat(40));
        console.log('Commands:');
        console.log('  deploy <version>  - Deploy specific iteration (v2.0, v3.0, v4.0, v5.0)');
        console.log('  list             - List all available iterations');
        console.log('  compare          - Show comparison report');
        console.log('  validate         - Validate current deployment');
        console.log('  help             - Show this menu');
        console.log('');
        console.log('Examples:');
        console.log('  node ui-manager.js deploy v3.0');
        console.log('  node ui-manager.js list');
        console.log('  node ui-manager.js compare');
    }

    validateCurrentDeployment() {
        const targetFile = path.join(this.baseDir, 'index.html');
        
        if (!fs.existsSync(targetFile)) {
            console.log('❌ No index.html found to validate');
            return;
        }

        const content = fs.readFileSync(targetFile, 'utf8');
        
        // Detect which iteration is currently deployed
        let currentVersion = 'Unknown';
        if (content.includes('Iteration 5.0')) currentVersion = 'v5.0';
        else if (content.includes('Iteration 4.0')) currentVersion = 'v4.0';
        else if (content.includes('Iteration 3.0')) currentVersion = 'v3.0';
        else if (content.includes('Iteration 2.0')) currentVersion = 'v2.0';

        console.log(`🔍 Current Deployment: ${currentVersion}`);
        
        if (currentVersion !== 'Unknown') {
            this.validateDeployment(currentVersion, targetFile);
        } else {
            console.log('⚠️  Could not detect iteration version');
        }
    }

    run(command, ...args) {
        switch (command) {
            case 'deploy':
                if (args.length === 0) {
                    console.log('❌ Please specify version: v2.0, v3.0, v4.0, or v5.0');
                    return;
                }
                this.deployIteration(args[0]);
                break;
                
            case 'list':
                this.listAvailableIterations();
                break;
                
            case 'compare':
                this.generateComparisonReport();
                break;
                
            case 'validate':
                this.validateCurrentDeployment();
                break;
                
            case 'help':
            default:
                this.interactiveMenu();
                break;
        }
    }
}

if (require.main === module) {
    const manager = new JetstreamUIManager();
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        manager.interactiveMenu();
        manager.listAvailableIterations();
    } else {
        manager.run(...args);
    }
}

module.exports = JetstreamUIManager;
