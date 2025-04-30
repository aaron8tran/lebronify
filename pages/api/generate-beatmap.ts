// /pages/api/generate-beatmap.ts
import { exec } from 'node:child_process';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { song } = req.query;
  console.log(`Running beatmap generator for: ${song}`);
  
  if (!song || typeof song !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid song name' });
  }

  exec(`python3 scripts/generate_beatmap.py ${song}`, (error, stdout, stderr) => {
    if (error) {
      console.error(stderr);
      return res.status(500).json({ error: 'Beatmap generation failed', stderr });
    }

    return res.status(200).json({ message: 'Beatmap generated!', output: stdout });
  });
}
