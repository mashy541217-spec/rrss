/**
 * CapabilityType – execution capabilities a Worker may declare
 * and an Execution may require.
 *
 * These are extensible; new types are added as new adapters are built.
 * No infrastructure logic lives here.
 */
export enum CapabilityType {
  BrowserAutomation = 'BrowserAutomation',
  AndroidAutomation = 'AndroidAutomation',
  VirtualMachine = 'VirtualMachine',
  AiAgent = 'AiAgent',
  ResidentialProxy = 'ResidentialProxy',
  Generic = 'Generic',
}
