import createClient from "openapi-fetch";
import type { paths } from "./generated/schema";

const baseUrl =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1";

export const apiClient = createClient<paths>({ baseUrl });
