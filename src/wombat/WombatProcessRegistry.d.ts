interface WombatProcessRegistry extends IPosisProcessRegistry {
  getNewProcess(context: IPosisProcessContext): WombatProcess | undefined;
}
