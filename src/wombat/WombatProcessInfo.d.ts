interface WombatProcessInfo {
  id: PosisPID;
  parentId: PosisPID;
  name: string;

  status: ProcessStatus;
  error?: string;

  startTick: number;
  wakeTick?: number;
  endedTick?: number;
}
