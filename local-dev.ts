#!/usr/bin/env deno run --allow-all --env

import handler from "./api/index.ts";

const port = 8000;
console.log(`🚀 Local development server running at http://localhost:${port}`);
console.log("Press Ctrl+C to stop");

Deno.serve({ port }, handler);
