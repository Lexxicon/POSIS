
interface WombatKernel extends IPosisKernel {
  notify(pid: PosisPID, msg: any): void;
  getProcessById(pid: PosisPID): WombatProcess | IPosisProcess | undefined;
  startProcess(imageName: string, startContext: any): { pid: PosisPID; process: WombatProcess | IPosisProcess; } | undefined 
}
