import { Command } from '@teambit/legacy/dist/cli/command';
import { CommandOptions } from '@teambit/legacy/dist/cli/legacy-command';
import { getCommandId } from './get-command-id';

export class GenerateCommandsDoc {
  constructor(private commands: Command[]) {}

  generate(): string {
    const commands = this.getAllPublicCommands();
    let output = `---
id: cli-all
title: CLI Commands
---

Commands that are marked as workspace only must be executed inside a workspace. Commands that are marked as not workspace only, can be executed from anywhere and will run on a remote server.
`;
    output += commands.map((cmd) => this.generateCommand(cmd)).join('\n');

    return output;
  }

  private getAllPublicCommands() {
    return this.commands.filter((cmd) => !cmd.private);
  }

  private generateCommand(cmd: Command) {
    const commandName = getCommandId(cmd.name);
    let result = `## ${commandName}  \n\n`;
    if (cmd.alias && cmd.alias.length > 0) {
      result += `**Alias**: \`${cmd.alias}\`  \n`;
    }
    result += `**Workspace only**: ${cmd.skipWorkspace ? 'no' : 'yes'}  \n`;
    result += `**Description**: ${this.formatDescription(cmd.description as string)}`;
    result += `\`bit ${cmd.name}\`  \n\n`;

    if (cmd.commands && cmd.commands.length > 0) {
      result += this.generateSubCommands(cmd.commands);
    }
    result += this.generateOptions(cmd.options);
    result += `---  \n`;

    return result;
  }

  private generateSubCommands(subCommands: Command[]) {
    let ret = '';
    subCommands.forEach((subCommand) => {
      // @ts-ignore
      const name = subCommand.name.match(/^([\w-]+)/)[0];
      ret += `### ${name} \n`;
      ret += `**Usage**: ${subCommand.name.replace(/([<>*()?])/g, '\\$1')}  \n\n`;
      ret += `**Description**: ${this.formatDescription(subCommand.description as string)}`;

      ret += '\n';
      ret += this.generateOptions(subCommand.options);
    });
    return ret;
  }

  private generateOptions(options: CommandOptions): string {
    if (!options || options.length <= 0) return '';
    let output = `| **Option** | **Option alias** | **Description**|  \n`;
    output += `|---|:-----:|---|\n`;
    options.forEach((opt) => {
      const [alias, flag, description] = opt;
      const aliasFormatted = alias ? `-${alias}` : '   ';
      const flagFormatted = `--${flag}`;
      output += `|\`${flagFormatted}\`|\`${aliasFormatted}\`|${description}|\n`;
    });
    output += `\n`;
    return output;
  }

  private formatDescription(description: string): string {
    return `${description.split('\n').join('  \n')}  \n\n`;
  }
}
