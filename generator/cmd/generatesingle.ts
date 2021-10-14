import * as constants from '../constants';
import { cloneAndGenerateBasePaths, resolveAbsolutePath, validateAndReturnReadmePath, getPackageString } from '../specs';
import { generateSchemas, saveAutoGeneratedSchemaRefs } from '../generate';
import process from 'process';
import { findAutogenEntries } from '../autogenlist';
import chalk from 'chalk';
import { executeSynchronous } from '../utils';

executeSynchronous(async () => {
    const basePath = process.argv[2];
    let localPath = process.argv[3];
    if (!localPath) {
        localPath = constants.specsRepoPath;
        await cloneAndGenerateBasePaths(localPath, constants.specsRepoUri, constants.specsRepoCommitHash);
    } else {
        localPath = await resolveAbsolutePath(localPath);
    }

    let readme = '';
    try {
        readme = await validateAndReturnReadmePath(localPath, basePath);
    } catch {
        throw new Error(`Unable to find a readme under '${basePath}'. Please try running 'npm run list-basepaths' to find the list of valid paths.`);
    }

    const schemaConfigs = [];
    const autoGenEntries = findAutogenEntries(basePath);
    console.log(autoGenEntries);

    if (autoGenEntries.length === 0) {
        const localSchemaConfigs = await generateSchemas(readme);
        schemaConfigs.push(...localSchemaConfigs);
    } else {
        for (const autoGenConfig of autoGenEntries) {
            console.log(`Using autogenlist config:`)
            console.log(chalk.green(JSON.stringify(autoGenConfig, null, 2)));

            const localSchemaConfigs = await generateSchemas(readme, autoGenConfig);
            schemaConfigs.push(...localSchemaConfigs);
        }
    }

    await saveAutoGeneratedSchemaRefs(schemaConfigs);
});