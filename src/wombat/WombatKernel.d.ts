
interface WombatKernel extends IPosisKernel {
  notify(pid: PosisPID, msg: any): void;
}
