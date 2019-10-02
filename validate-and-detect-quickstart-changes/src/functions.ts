import * as core from '@actions/core';
import jp from "jsonpath";
import axios from 'axios';

export async function getFiles(trigger: string, repoName: string, sourceVersion?: string, prNumber?: number): Promise<string[]> {

    let files: string[];

    if (trigger == "push") {
        let commitUri = `https://api.github.com/repos/${repoName}/commits/${sourceVersion}`;

        core.info(`Merge Commit uri: ${commitUri}`);

        let response = await axios.get(commitUri);
        let data = await response.data;

        files = jp.query(data, '$..filename');
    }
    else if (trigger == "pull_request") {
        let prUri = `https://api.github.com/repos/${repoName}/pulls/${prNumber}/files`;

        core.info(`PR uri: ${prUri}`);

        let response = await axios.get(prUri);
        let data = await response.data;

        files = jp.query(data, '$..filename');
    }
    else {
        throw new Error(`Unsupported trigger type: ${trigger}`);
    }

    core.info("Files changed:");
    files.forEach(file => {
        core.info(file);
    });

    return files;
}

export function areChangesValid(changes: string[]): boolean {
    changes = removeFilesWithPathThatBeginsWithDot(changes);

    let changesAreValid = true;

    let noChangesInQuickstartSolutions = changes.every(function (path) {
        return path.split('/').length < 3;
    });

    let previousQuickstartSolutionPath: string;
    if (!noChangesInQuickstartSolutions) {
        let allQuickstartSolutionChangesAreInTheSameFolder = changes.every(function (path) {
            let segments = path.split('/');

            let quickstartSolutionPath = segments.slice(0, 2).join('/');

            if (segments.length > 2) {
                if (previousQuickstartSolutionPath && previousQuickstartSolutionPath != quickstartSolutionPath) {
                    return false;
                } else {
                    previousQuickstartSolutionPath = quickstartSolutionPath;
                    return true;
                }
            } else {
                return true;
            }
        });

        changesAreValid = allQuickstartSolutionChangesAreInTheSameFolder;
    }

    return changesAreValid;
}

export function isBuildRequired(changes: string[]): boolean {
    changes = removeFilesWithPathThatBeginsWithDot(changes);

    return changes.length > 0
        && !changes.every(function (path) {
            return path.split('/').length < 3;
        });
}

export function getQuickstartSolutionPath(changes: string[]): string {
    changes = removeFilesWithPathThatBeginsWithDot(changes);

    let found = changes.find(function (path) { return path.split('/').length > 2; });

    if (found) {
        return found
            .split('/')
            .splice(0, 2)
            .join('/');
    } else {
        throw "No quickstart solution changes found."
    }
}

export function getQuickstartTool(changes: string[]): string {
    changes = removeFilesWithPathThatBeginsWithDot(changes);
    let found = changes.find(function (path) { return path.split('/').length > 2; });

    if (found) {
        return found.split('/')[0];
    } else {
        throw "No quickstart solution changes found."
    }
}

function removeFilesWithPathThatBeginsWithDot(changes: string[]): string[] {
    return changes.filter(function (path) {
        return path[0] != '.';
    });
}