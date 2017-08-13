
interface PosisInterfaces {
  wombatKernel: WombatKernel;
}

interface WombatKernel extends IPosisKernel {
  notify(pid: PosisPID, msg: WombatMessage): void;
  getProcessById(pid: PosisPID): WombatProcess | undefined;
  startProcess(imageName: string, startContext: any): { pid: PosisPID; process: WombatProcess; } | undefined 
}
