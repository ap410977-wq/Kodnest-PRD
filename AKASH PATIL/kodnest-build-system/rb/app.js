// KodNest Premium Build System - Gating & Route Rail Logic

document.addEventListener('DOMContentLoaded', () => {

    // Gating Logic
    if (!window.IS_PROOF) {
        const currentStep = window.CURRENT_STEP;

        // 1. Verify previous steps are completed (No skipping)
        if (currentStep > 1) {
            for (let i = 1; i < currentStep; i++) {
                const prevArtifact = localStorage.getItem(`rb_step_${i}_artifact`);
                if (!prevArtifact) {
                    alert(`Access denied. Step ${i} artifact is missing. Redirecting...`);
                    // Redirect to earliest incomplete step
                    const previousRoute = getRoutePathForStep(i);
                    window.location.href = `../${previousRoute}/`;
                    return; // stop execution
                }
            }
        }

        // 2. Handle Current Step Artifact Save
        const artifactInput = document.getElementById('artifact-input');
        const saveBtn = document.getElementById('save-artifact-btn');
        const nextBtn = document.getElementById('next-step-btn');

        // Pre-fill if exists
        const existingArtifact = localStorage.getItem(`rb_step_${currentStep}_artifact`);
        if (existingArtifact) {
            artifactInput.value = existingArtifact;
            enableNextButton(nextBtn);
            saveBtn.textContent = 'Saved!';
        }

        saveBtn.addEventListener('click', () => {
            const val = artifactInput.value.trim();
            if (val.length > 5) {
                localStorage.setItem(`rb_step_${currentStep}_artifact`, val);
                saveBtn.textContent = 'Saved!';
                enableNextButton(nextBtn);
            } else {
                alert('Please enter a valid artifact link.');
            }
        });

        nextBtn.addEventListener('click', (e) => {
            if (nextBtn.disabled) {
                e.preventDefault();
            } else {
                window.location.href = nextBtn.getAttribute('data-next');
            }
        });

    } else {
        // PROOF PAGE LOGIC
        const statusList = document.getElementById('proof-status-list');
        const routes = [
            '01-problem', '02-market', '03-architecture', '04-hld',
            '05-lld', '06-build', '07-test', '08-ship'
        ];

        routes.forEach((route, idx) => {
            const stepNum = idx + 1;
            const artifact = localStorage.getItem(`rb_step_${stepNum}_artifact`);

            const div = document.createElement('div');
            div.className = 'proof-data-item';

            if (artifact) {
                div.innerHTML = `<span class="proof-status-dot status-done"></span> Step ${stepNum} (${route}) - <a href="${artifact}" target="_blank" style="color:var(--accent-color)">View Artifact</a>`;
            } else {
                div.innerHTML = `<span class="proof-status-dot status-pending"></span> Step ${stepNum} (${route}) - Missing`;
            }
            statusList.appendChild(div);
        });

        // Handle Final Copy
        document.getElementById('copy-final-btn').addEventListener('click', () => {
            const l = document.getElementById('final-lovable-link').value;
            const g = document.getElementById('final-github-link').value;
            const d = document.getElementById('final-deploy-link').value;

            const submissionText = `== AI Resume Builder - Final Submission ==\nLovable: ${l}\nGitHub: ${g}\nDeploy: ${d}\n\n`;
            navigator.clipboard.writeText(submissionText).then(() => {
                alert('Copied Final Submission to clipboard!');
            });
        });
    }
});

function enableNextButton(btn) {
    if (!btn) return;
    btn.disabled = false;
    btn.classList.remove('disabled-btn');
}

function getRoutePathForStep(step) {
    const r = [
        '01-problem', '02-market', '03-architecture', '04-hld',
        '05-lld', '06-build', '07-test', '08-ship'
    ];
    return r[step - 1];
}
