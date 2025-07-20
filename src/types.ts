/**
 * Type definitions for move-prop-types
 */

export interface FindMatchFunction {
  (givenValue: string[], setToMatch: string[]): string;
}

export interface InstallPackageFunction {
  (): Promise<void>;
}

export interface UpdateFileFunction {
  (cmd: string, fileAndPath: string): Promise<void>;
}

export interface UpdateFolderFunction {
  (cmd: string, folderName: string): Promise<void>;
}

export interface HelpExamplesFunction {
  (): string;
}

export interface CommandOptions {
  install?: boolean;
  path?: string;
  folder?: string;
}

export type FileEncoding = 'utf-8';

export interface ProcessingStats {
  filesProcessed: number;
  filesUpdated: number;
  errors: string[];
}
