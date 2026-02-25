const fs = require('fs');
const path = require('path');

const routes = [
    { id: '01-problem', step: 1, title: 'Problem Discovery' },
    { id: '02-market', step: 2, title: 'Market Validation' },
    { id: '03-architecture', step: 3, title: 'Architecture' },
    { id: '04-hld', step: 4, title: 'High Level Design' },
    { id: '05-lld', step: 5, title: 'Low Level Design' },
    { id: '06-build', step: 6, title: 'Build Core Engine' },
    { id: '07-test', step: 7, title: 'Testing' },
    { id: '08-ship', step: 8, title: 'Ship & Deploy' }
];

const bDir = path.join(__dirname);

function ensureDir(d) {
    if (!fs.existsSync(d)) {
        fs.mkdirSync(d, { recursive: true });
    }
}

function getBaseTemplate(title, bodyContent, stepNum = 0, isProof = false) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Resume Builder - ${title}</title>
    <link rel="stylesheet" href="../../index.css">
    <style>
        .disabled-btn {
            opacity: 0.5;
            cursor: not-allowed !important;
        }
        .proof-data-item {
            margin-bottom: 8px;
            font-size: 14px;
        }
        .proof-status-dot {
            display: inline-block;
            width: 10px; height: 10px;
            border-radius: 50%;
            margin-right: 8px;
        }
        .status-done { background-color: var(--success-color); }
        .status-pending { background-color: var(--warning-color); }
    </style>
    <script>
        const CURRENT_STEP = ${stepNum};
        const IS_PROOF = ${isProof};
    </script>
</head>
<body>
    <div class="app-container">
        <!-- Top Bar -->
        <header class="top-bar">
            <div class="project-name">AI Resume Builder</div>
            <div class="progress-indicator">${isProof ? 'Final Proof' : 'Project 3 — Step ' + stepNum + ' of 8'}</div>
            <div class="status-badge status-in-progress">${isProof ? 'Ready to Ship' : 'In Progress'}</div>
        </header>

        ${bodyContent}

    </div>
    <script src="../app.js"></script>
</body>
</html>`;
}

// Generate the 8 steps
routes.forEach((r, idx) => {
    let nextRoute = (idx < routes.length - 1) ? `../${routes[idx + 1].id}/` : '../proof/';
    let prevRoute = (idx > 0) ? `../${routes[idx - 1].id}/` : '#';

    let content = `
        <!-- Context Header -->
        <section class="context-header">
            <h1>${r.title}</h1>
            <p class="subtext">Define and construct the ${r.title} phase of the AI Resume Builder.</p>
        </section>

        <!-- Main Content Area -->
        <main class="main-content">
            <!-- Primary Workspace -->
            <div class="primary-workspace">
                <div class="card">
                    <h2>Artifact Submission</h2>
                    <p class="text-block">Upload or link your verified artifact for the ${r.title} phase before proceeding.</p>
                    
                    <div class="form-group">
                        <label for="artifact-input">Artifact URL / Proof</label>
                        <input type="text" id="artifact-input" placeholder="Paste artifact link here..." class="input-field">
                    </div>
                     <div class="form-group">
                        <button class="button button-primary" id="save-artifact-btn">Save Artifact</button>
                    </div>
                </div>

                <div class="card" style="margin-top: 24px; display: flex; justify-content: space-between;">
                    <button class="button button-secondary" onclick="window.location.href='${prevRoute}'" ${idx === 0 ? 'disabled' : ''}>Back</button>
                    <button class="button button-primary disabled-btn" id="next-step-btn" data-next="${nextRoute}" disabled>Next Step</button>
                </div>
            </div>

            <!-- Secondary Panel -->
            <aside class="secondary-panel">
                <div class="panel-card">
                    <h3>AI Prompt Details</h3>
                    <p>Use the following prompt to guide your logic generation.</p>
                    
                    <div class="prompt-box">
                        <textarea class="input-field" rows="4" readonly>Build the ${r.title} rules for the AI Resume builder. Act as a senior engineer.</textarea>
                        <button class="button button-secondary button-small" onclick="navigator.clipboard.writeText('Build the ${r.title} rules for the AI Resume builder. Act as a senior engineer.')">Copy</button>
                    </div>

                    <div class="action-stack">
                        <button class="button button-secondary">Build in Lovable</button>
                        <button class="button button-primary">It Worked</button>
                        <button class="button button-secondary" style="border-color: var(--accent-color); color: var(--accent-color);">Error</button>
                        <button class="button button-secondary">Add Screenshot</button>
                    </div>
                </div>
            </aside>
        </main>
        
        <!-- Standard Proof Footer -->
        <footer class="proof-footer">
            <div class="proof-checklist">
                <div class="proof-item">
                    <label class="checkbox-container">
                        <input type="checkbox"> UI Built
                    </label>
                    <input type="text" class="proof-input" placeholder="Paste proof URL or screenshot link...">
                </div>
                <div class="proof-item">
                    <label class="checkbox-container">
                        <input type="checkbox"> Logic Working
                    </label>
                    <input type="text" class="proof-input" placeholder="Paste proof URL or screenshot link...">
                </div>
                <div class="proof-item">
                    <label class="checkbox-container">
                        <input type="checkbox"> Test Passed
                    </label>
                    <input type="text" class="proof-input" placeholder="Paste CI/CD pipeline link...">
                </div>
                <div class="proof-item">
                    <label class="checkbox-container">
                        <input type="checkbox"> Deployed
                    </label>
                    <input type="text" class="proof-input" placeholder="Paste live deployment URL...">
                </div>
            </div>
        </footer>
    `;

    let dir = path.join(bDir, r.id);
    ensureDir(dir);
    fs.writeFileSync(path.join(dir, 'index.html'), getBaseTemplate(r.title, content, r.step, false));
});

// Generate proof page
let proofContent = `
        <section class="context-header">
            <h1>Final Project Proof</h1>
            <p class="subtext">Verify all 8 steps are complete and submit final artifacts.</p>
        </section>

        <main class="main-content">
            <div class="primary-workspace">
                <div class="card">
                    <h2>Step Completion Status</h2>
                    <div id="proof-status-list">
                        <!-- Populated by JS -->
                    </div>
                </div>
                
                <div class="card" style="margin-top: 24px;">
                    <h2>Final Deployment Details</h2>
                    <div class="form-group">
                        <label>Lovable Project Link</label>
                        <input type="text" id="final-lovable-link" class="input-field" placeholder="https://lovable.dev/...">
                    </div>
                    <div class="form-group">
                        <label>GitHub Repository</label>
                        <input type="text" id="final-github-link" class="input-field" placeholder="https://github.com/...">
                    </div>
                    <div class="form-group">
                        <label>Live Deployment URL</label>
                        <input type="text" id="final-deploy-link" class="input-field" placeholder="https://...">
                    </div>
                    <button class="button button-primary" id="copy-final-btn" style="margin-top: 16px;">Copy Final Submission</button>
                </div>
            </div>
            
            <aside class="secondary-panel">
                <div class="panel-card">
                    <h3>Submission Rules</h3>
                    <p>Ensure all endpoints are publicly accessible before final submission.</p>
                    <button class="button button-secondary" onclick="window.location.href='../08-ship/'">Back to Ship Step</button>
                </div>
            </aside>
        </main>
`;

let proofDir = path.join(bDir, 'proof');
ensureDir(proofDir);
fs.writeFileSync(path.join(proofDir, 'index.html'), getBaseTemplate('Final Proof', proofContent, 9, true));

console.log('Routes generated exactly!');
