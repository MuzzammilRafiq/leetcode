# DSA Pattern-Wise Master Sheet

A local, pattern-first LeetCode tracker. Open `index.html` in a browser — no build step, no server.

Progress (solved / unsolved) is stored in this browser’s local storage and can optionally sync across devices through one private JSON file in Vercel Blob. The same problem number is shared across patterns.

## How to use

1. Open `index.html`.
2. Learn the keywords and template for a pattern, then work the list.
3. Mark **Solved** when you can do the problem from memory.
4. Search, filter (all / unsolved / solved / starred), and jump between patterns.

Suggested loop: 3 easy → 5 medium → 1 hard → close notes → redo.

## Export / import

Use **Export** to download progress as JSON, **Import** to restore it on another device, and **Reset** to clear this browser’s progress.

## Optional Vercel sync

1. In the Vercel project, open **Storage**, create a **private Blob** store, and connect it to this project. Vercel adds `BLOB_READ_WRITE_TOKEN` automatically.
2. Add a strong `SYNC_PASSWORD` in **Project settings → Environment Variables** for Production, Preview, and Development as needed.
3. Redeploy the project.
4. Open the site, select **Enable sync**, and enter the password once on each device.

The password is exchanged for a secure, HTTP-only cookie and is not stored by the page. Local storage remains the immediate fallback when the network is unavailable. The most recently changed device snapshot wins when devices reconnect, so avoid making offline changes on two devices at the same time.

## Source

Based on [DSA Pattern-Wise Master Sheet by Alien_me](https://leetcode.com/discuss/post/8492532/dsa-pattern-wise-master-sheet-by-vishalb-vnx9/).
