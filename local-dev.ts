#!/usr/bin/env deno run --allow-all

import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import handler from "./api/index.ts";

const port = 8000;
console.log(`🚀 Local development server running at http://localhost:${port}`);
console.log("Press Ctrl+C to stop");

await serve(handler, { port });
