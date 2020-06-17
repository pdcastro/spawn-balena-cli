#!/usr/bin/env node

class ExpectedError extends Error {};

async function ssh(uuid) {
	const { spawn } = require('child_process');

	if (!uuid) {
		throw new ExpectedError('Please provide the device UUID as argument');
	}
	await new Promise((resolve, reject) => {
		const child = spawn('balena', ['ssh', uuid], { stdio: 'inherit'});
		child.on('error', reject);
		child.on('exit', (code, signal) => {
			console.error(`balena CLI exited with error code ${code}`);
			resolve();
		});
	});
}

// Usage:
// $ node index.js <device-uuid>
//
async function main() {
	try {
		await ssh(process.argv[2]);
	} catch (e) {
		if (e instanceof ExpectedError) {
			console.error(e.message);
		} else {
			throw e;
		}
	}
}

main();
