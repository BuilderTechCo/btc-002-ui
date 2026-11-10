import type { FullConfig } from '@playwright/test';
import { spawn } from 'child_process';
import type { ChildProcess } from 'child_process';

let storybookProcess: ChildProcess | null = null;

export default async function globalSetup(_config: FullConfig) {
  // Solo levanta Storybook si no está corriendo (local dev)
  if (process.env.CI) {
    console.warn('[globalSetup] CI detectado — saltando Storybook local');
    return;
  }

  const port = 6006;
  const url = `http://localhost:${port}`;

  // Verifica si ya hay servidor corriendo
  try {
    const res = await fetch(url);
    if (res.ok) {
      console.warn('[globalSetup] Storybook ya corriendo en', url);
      return;
    }
  } catch {
    // No hay servidor, continuar
  }

  console.warn('[globalSetup] Levantando Storybook...');

  return new Promise<void>((resolve, reject) => {
    storybookProcess = spawn('pnpm', ['storybook', '--ci', `--port=${port}`], {
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true,
      env: { ...process.env, CI: 'true' },
    });

    let output = '';
    const timeout = setTimeout(() => {
      reject(new Error('Timeout esperando Storybook'));
    }, 60_000);

    storybookProcess.stdout?.on('data', (data) => {
      output += data.toString();
      if (output.includes('Storybook started') || output.includes(`localhost:${port}`)) {
        clearTimeout(timeout);
        console.warn('[globalSetup] Storybook listo en', url);
        resolve();
      }
    });

    storybookProcess.stderr?.on('data', (data) => {
      console.error('[Storybook]', data.toString());
    });

    storybookProcess.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });

    storybookProcess.on('exit', (code) => {
      if (code !== 0 && !timeout.hasRef()) {
        reject(new Error(`Storybook exited with code ${code}`));
      }
    });
  });
}