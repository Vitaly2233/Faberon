import { defineRelations } from 'drizzle-orm';
import * as schema from './index';

export const relations = defineRelations(schema);
