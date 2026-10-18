# LeetCode Medium & Hard

A local tracker for 186 of the most-asked LeetCode mediums (126) and hards (60), served as one shuffled list with no difficulty or pattern labels, the way an interview serves them. Open `index.html` in a browser — no build step, no server.

Progress (solved / unsolved) is stored in this browser’s local storage and can optionally sync across devices through one private JSON file in Vercel Blob.

## How to use

1. Open `index.html`.
2. Work top to bottom and try to finish each problem within its target time (set from its LeetCode acceptance rate; allow about 1.5× before reading hints).
3. Mark **Solved** when you can do the problem from memory.
4. Search, filter (all / unsolved / solved), or pick a **Random** problem.

## Export / import

Use **Export** to download progress as JSON, **Import** to restore it on another device, and **Reset** to clear this browser’s progress.

## Optional Vercel sync

1. In the Vercel project, open **Storage**, create a **private Blob** store, and connect it to this project. Vercel adds `BLOB_READ_WRITE_TOKEN` automatically.
2. Add a strong `SYNC_PASSWORD` in **Project settings → Environment Variables** for Production, Preview, and Development as needed.
3. Redeploy the project.
4. Open the site, select **Enable sync**, and enter the password once on each device.

The password is exchanged for a secure, HTTP-only cookie and is not stored by the page. Local storage remains the immediate fallback when the network is unavailable. The most recently changed device snapshot wins when devices reconnect, so avoid making offline changes on two devices at the same time.

## Source

Compiled from LeetCode Discuss interview posts, company-frequency data, and prep lists (see **Sources** on the page). Acceptance rates from [noworneverev/leetcode-api](https://github.com/noworneverev/leetcode-api), Oct 12, 2026.
