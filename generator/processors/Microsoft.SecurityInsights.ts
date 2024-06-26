// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { SchemaPostProcessor } from '../models';
import { replaceCyclicRefByName } from './helpers';

export const postProcessor: SchemaPostProcessor = async (namespace, apiVersion, schema) => {
  replaceCyclicRefByName(schema, 'MetadataDependencies', { type: 'object' });
  replaceCyclicRefByName(schema, 'MetadataDependenciesAutoGenerated', { type: 'object' });
  replaceCyclicRefByName(schema, 'AutomationRuleCondition', { type: 'object' });
}